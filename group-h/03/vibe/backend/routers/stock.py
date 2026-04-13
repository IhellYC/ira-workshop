from fastapi import APIRouter, HTTPException
from services.stock_service import get_stock_profile, get_stock_financials, get_stock_history

router = APIRouter(prefix="/stock", tags=["Stock"])


@router.get("/{symbol}/profile")
async def stock_profile(symbol: str):
    """获取公司概况"""
    try:
        data = get_stock_profile(symbol.upper())
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{symbol}/financials")
async def stock_financials(symbol: str):
    """获取财务数据"""
    try:
        data = get_stock_financials(symbol.upper())
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{symbol}/history")
async def stock_history(symbol: str, period: str = "1y"):
    """获取历史行情数据"""
    try:
        data = get_stock_history(symbol.upper(), period)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
