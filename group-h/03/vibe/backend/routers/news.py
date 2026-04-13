from fastapi import APIRouter, HTTPException
from services.news_service import get_stock_news, get_market_news

router = APIRouter(prefix="/news", tags=["News"])


@router.get("/market")
async def market_news():
    """获取市场热点新闻"""
    try:
        data = get_market_news()
        return {"items": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{symbol}")
async def stock_news(symbol: str):
    """获取个股相关新闻"""
    try:
        data = get_stock_news(symbol.upper())
        return {"items": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
