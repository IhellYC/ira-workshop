from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models import Fund, WeeklyReport, NavHistory, MarketIndex
from app.schemas import (
    WeeklyReportCreate, WeeklyReportUpdate, WeeklyReportResponse, WeeklyReportWithFund,
    DashboardStats, VectorSearchRequest, VectorSearchResponse, VectorSearchResult,
    FundResponse
)
from app.services import redis_service, milvus_service, ai_service

router = APIRouter(prefix="/reports", tags=["周报管理"])


@router.get("/", response_model=List[WeeklyReportWithFund])
def get_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    fund_id: Optional[int] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """获取周报列表"""
    query = db.query(WeeklyReport).join(Fund)
    
    if fund_id:
        query = query.filter(WeeklyReport.fund_id == fund_id)
    if start_date:
        query = query.filter(WeeklyReport.report_date >= start_date)
    if end_date:
        query = query.filter(WeeklyReport.report_date <= end_date)
    
    reports = query.order_by(WeeklyReport.report_date.desc()).offset(skip).limit(limit).all()
    
    # 构建包含基金信息的响应
    result = []
    for report in reports:
        report_dict = WeeklyReportResponse.model_validate(report).model_dump()
        report_dict['fund'] = FundResponse.model_validate(report.fund).model_dump()
        result.append(report_dict)
    
    return result


@router.get("/latest", response_model=List[WeeklyReportWithFund])
def get_latest_reports(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """获取最新周报"""
    # 获取最新报告日期
    latest_report = db.query(WeeklyReport).order_by(WeeklyReport.report_date.desc()).first()
    if not latest_report:
        return []
    
    reports = db.query(WeeklyReport).join(Fund).filter(
        WeeklyReport.report_date == latest_report.report_date
    ).order_by(WeeklyReport.weekly_return.desc()).limit(limit).all()
    
    result = []
    for report in reports:
        report_dict = WeeklyReportResponse.model_validate(report).model_dump()
        report_dict['fund'] = FundResponse.model_validate(report.fund).model_dump()
        result.append(report_dict)
    
    return result


@router.get("/{report_id}", response_model=WeeklyReportWithFund)
def get_report(report_id: int, db: Session = Depends(get_db)):
    """获取单个周报详情"""
    report = db.query(WeeklyReport).filter(WeeklyReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="周报不存在")
    
    report_dict = WeeklyReportResponse.model_validate(report).model_dump()
    report_dict['fund'] = FundResponse.model_validate(report.fund).model_dump()
    return report_dict


@router.post("/", response_model=WeeklyReportResponse)
def create_report(report: WeeklyReportCreate, db: Session = Depends(get_db)):
    """创建周报"""
    # 检查基金是否存在
    fund = db.query(Fund).filter(Fund.id == report.fund_id).first()
    if not fund:
        raise HTTPException(status_code=404, detail="基金不存在")
    
    db_report = WeeklyReport(**report.model_dump())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


@router.put("/{report_id}", response_model=WeeklyReportResponse)
def update_report(report_id: int, report: WeeklyReportUpdate, db: Session = Depends(get_db)):
    """更新周报"""
    db_report = db.query(WeeklyReport).filter(WeeklyReport.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="周报不存在")
    
    update_data = report.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_report, key, value)
    
    db.commit()
    db.refresh(db_report)
    return db_report


@router.delete("/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    """删除周报"""
    db_report = db.query(WeeklyReport).filter(WeeklyReport.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="周报不存在")
    
    # 删除向量库中的数据
    if db_report.vector_id:
        milvus_service.delete_by_report_id(report_id)
    
    db.delete(db_report)
    db.commit()
    return {"message": "周报已删除"}


@router.post("/{report_id}/analyze")
def analyze_report(report_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """AI分析周报"""
    report = db.query(WeeklyReport).filter(WeeklyReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="周报不存在")
    
    fund = report.fund
    
    # 构建分析数据
    fund_info = {
        "fund_code": fund.fund_code,
        "fund_name": fund.fund_name,
        "fund_type": fund.fund_type,
        "fund_manager": fund.fund_manager
    }
    
    report_data = {
        "weekly_return": report.weekly_return,
        "monthly_return": report.monthly_return,
        "ytd_return": report.ytd_return,
        "max_drawdown": report.max_drawdown,
        "volatility": report.volatility,
        "sharpe_ratio": report.sharpe_ratio,
        "total_assets": report.total_assets
    }
    
    # 执行AI分析
    result = ai_service.analyze_fund_report(fund_info, report_data)
    
    # 更新报告
    report.ai_summary = result["ai_summary"]
    report.ai_sentiment = result["ai_sentiment"]
    report.ai_score = result["ai_score"]
    
    # 生成向量并存储到Milvus
    if ai_service.is_available() and report.ai_summary:
        embedding = ai_service.get_embedding(report.ai_summary)
        if embedding:
            vector_data = [{
                "report_id": report.id,
                "fund_code": fund.fund_code,
                "fund_name": fund.fund_name,
                "ai_summary": report.ai_summary,
                "report_date": int(report.report_date.timestamp()),
                "embedding": embedding
            }]
            milvus_service.insert_vectors(vector_data)
    
    db.commit()
    db.refresh(report)
    
    return {
        "report_id": report_id,
        "ai_summary": result["ai_summary"],
        "ai_sentiment": result["ai_sentiment"],
        "ai_score": result["ai_score"]
    }


@router.post("/search", response_model=VectorSearchResponse)
def search_similar_reports(request: VectorSearchRequest):
    """语义搜索相似周报"""
    if not ai_service.is_available():
        raise HTTPException(status_code=503, detail="AI服务不可用")
    
    # 获取查询向量
    query_embedding = ai_service.get_embedding(request.query)
    if not query_embedding:
        raise HTTPException(status_code=500, detail="生成向量失败")
    
    # 搜索相似向量
    results = milvus_service.search_similar(query_embedding, request.top_k)
    
    search_results = [
        VectorSearchResult(
            report_id=r["report_id"],
            fund_code=r["fund_code"],
            fund_name=r["fund_name"],
            ai_summary=r["ai_summary"],
            score=r["score"]
        )
        for r in results
    ]
    
    return VectorSearchResponse(
        results=search_results,
        total=len(search_results)
    )


@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """获取仪表盘统计数据"""
    # 尝试从缓存获取
    cache_key = "dashboard:stats"
    cached = redis_service.get_json(cache_key)
    if cached:
        return cached
    
    total_funds = db.query(Fund).filter(Fund.is_active == True).count()
    total_reports = db.query(WeeklyReport).count()
    
    # 获取最新报告日期的平均收益率
    latest_report = db.query(WeeklyReport).order_by(WeeklyReport.report_date.desc()).first()
    
    avg_weekly_return = None
    avg_ytd_return = None
    if latest_report:
        stats = db.query(
            func.avg(WeeklyReport.weekly_return).label('avg_weekly'),
            func.avg(WeeklyReport.ytd_return).label('avg_ytd')
        ).filter(WeeklyReport.report_date == latest_report.report_date).first()
        
        avg_weekly_return = float(stats.avg_weekly) if stats.avg_weekly else None
        avg_ytd_return = float(stats.avg_ytd) if stats.avg_ytd else None
    
    # 获取最佳和最差表现基金
    best_performer = None
    worst_performer = None
    if latest_report:
        best = db.query(WeeklyReport).join(Fund).filter(
            WeeklyReport.report_date == latest_report.report_date
        ).order_by(WeeklyReport.weekly_return.desc()).first()
        
        worst = db.query(WeeklyReport).join(Fund).filter(
            WeeklyReport.report_date == latest_report.report_date
        ).order_by(WeeklyReport.weekly_return.asc()).first()
        
        if best:
            best_performer = FundResponse.model_validate(best.fund).model_dump()
        if worst:
            worst_performer = FundResponse.model_validate(worst.fund).model_dump()
    
    stats_data = DashboardStats(
        total_funds=total_funds,
        total_reports=total_reports,
        avg_weekly_return=avg_weekly_return,
        avg_ytd_return=avg_ytd_return,
        best_performer=best_performer,
        worst_performer=worst_performer
    )
    
    # 缓存结果
    redis_service.set_json(cache_key, stats_data.model_dump(), expire=300)
    
    return stats_data
