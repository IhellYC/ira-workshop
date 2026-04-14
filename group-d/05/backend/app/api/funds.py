from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models import Fund, WeeklyReport
from app.schemas import (
    FundCreate, FundUpdate, FundResponse,
    WeeklyReportCreate, WeeklyReportUpdate, WeeklyReportResponse, WeeklyReportWithFund
)
from app.services import redis_service

router = APIRouter(prefix="/funds", tags=["基金管理"])


@router.get("/", response_model=List[FundResponse])
def get_funds(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    fund_type: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """获取基金列表"""
    query = db.query(Fund)
    
    if fund_type:
        query = query.filter(Fund.fund_type == fund_type)
    if is_active is not None:
        query = query.filter(Fund.is_active == is_active)
    
    funds = query.order_by(Fund.created_at.desc()).offset(skip).limit(limit).all()
    return funds


@router.get("/{fund_id}", response_model=FundResponse)
def get_fund(fund_id: int, db: Session = Depends(get_db)):
    """获取单个基金详情"""
    # 尝试从缓存获取
    cache_key = f"fund:{fund_id}"
    cached = redis_service.get_json(cache_key)
    if cached:
        return cached
    
    fund = db.query(Fund).filter(Fund.id == fund_id).first()
    if not fund:
        raise HTTPException(status_code=404, detail="基金不存在")
    
    # 缓存结果
    fund_dict = FundResponse.model_validate(fund).model_dump()
    redis_service.set_json(cache_key, fund_dict, expire=300)
    
    return fund


@router.post("/", response_model=FundResponse)
def create_fund(fund: FundCreate, db: Session = Depends(get_db)):
    """创建基金"""
    # 检查基金代码是否已存在
    existing = db.query(Fund).filter(Fund.fund_code == fund.fund_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="基金代码已存在")
    
    db_fund = Fund(**fund.model_dump())
    db.add(db_fund)
    db.commit()
    db.refresh(db_fund)
    return db_fund


@router.put("/{fund_id}", response_model=FundResponse)
def update_fund(fund_id: int, fund: FundUpdate, db: Session = Depends(get_db)):
    """更新基金信息"""
    db_fund = db.query(Fund).filter(Fund.id == fund_id).first()
    if not db_fund:
        raise HTTPException(status_code=404, detail="基金不存在")
    
    update_data = fund.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_fund, key, value)
    
    db.commit()
    db.refresh(db_fund)
    
    # 清除缓存
    redis_service.delete(f"fund:{fund_id}")
    
    return db_fund


@router.delete("/{fund_id}")
def delete_fund(fund_id: int, db: Session = Depends(get_db)):
    """删除基金（软删除）"""
    db_fund = db.query(Fund).filter(Fund.id == fund_id).first()
    if not db_fund:
        raise HTTPException(status_code=404, detail="基金不存在")
    
    db_fund.is_active = False
    db.commit()
    
    # 清除缓存
    redis_service.delete(f"fund:{fund_id}")
    
    return {"message": "基金已禁用"}


@router.get("/{fund_id}/reports", response_model=List[WeeklyReportResponse])
def get_fund_reports(
    fund_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """获取基金的历史周报"""
    reports = db.query(WeeklyReport).filter(
        WeeklyReport.fund_id == fund_id
    ).order_by(WeeklyReport.report_date.desc()).offset(skip).limit(limit).all()
    return reports


@router.get("/search/{keyword}", response_model=List[FundResponse])
def search_funds(keyword: str, db: Session = Depends(get_db)):
    """搜索基金"""
    funds = db.query(Fund).filter(
        (Fund.fund_code.contains(keyword)) | 
        (Fund.fund_name.contains(keyword))
    ).limit(20).all()
    return funds
