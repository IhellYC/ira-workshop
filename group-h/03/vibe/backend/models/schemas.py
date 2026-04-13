from pydantic import BaseModel
from typing import List, Optional


class StockProfile(BaseModel):
    symbol: str
    name: str
    sector: str
    industry: str
    market_cap: float
    current_price: float
    change_percent: float
    currency: str
    description: str


class FinancialData(BaseModel):
    revenue: List[float]
    net_income: List[float]
    eps: List[float]
    pe_ratio: Optional[float] = None
    pb_ratio: Optional[float] = None
    gross_margin: Optional[float] = None
    profit_margin: Optional[float] = None
    dates: List[str]


class HistoryData(BaseModel):
    dates: List[str]
    open: List[float]
    high: List[float]
    low: List[float]
    close: List[float]
    volume: List[int]


class TechnicalIndicators(BaseModel):
    dates: List[str]
    open: List[float]
    high: List[float]
    low: List[float]
    close: List[float]
    volume: List[int]
    ma5: List[Optional[float]]
    ma10: List[Optional[float]]
    ma20: List[Optional[float]]
    ma60: List[Optional[float]]
    macd: List[Optional[float]]
    macd_signal: List[Optional[float]]
    macd_hist: List[Optional[float]]
    kdj_k: List[Optional[float]]
    kdj_d: List[Optional[float]]
    kdj_j: List[Optional[float]]
    rsi: List[Optional[float]]
    boll_upper: List[Optional[float]]
    boll_mid: List[Optional[float]]
    boll_lower: List[Optional[float]]


class NewsItem(BaseModel):
    title: str
    source: str
    published_at: str
    url: str
    thumbnail: Optional[str] = None
    summary: Optional[str] = None


class NewsResponse(BaseModel):
    items: List[NewsItem]
