from fastapi import APIRouter, HTTPException
from services.technical_service import get_technical_indicators

router = APIRouter(prefix="/technical", tags=["Technical"])


@router.get("/{symbol}/indicators")
async def technical_indicators(symbol: str, period: str = "1y"):
    """获取技术分析指标（MA, MACD, KDJ, RSI, BOLL）"""
    try:
        data = get_technical_indicators(symbol.upper(), period)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
