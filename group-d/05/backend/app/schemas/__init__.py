from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class FundType(str, Enum):
    STOCK = "股票型"
    BOND = "债券型"
    MIXED = "混合型"
    INDEX = "指数型"
    MONEY = "货币型"
    QDII = "QDII"
    OTHER = "其他"


class SentimentType(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"


# ============ Fund Schemas ============
class FundBase(BaseModel):
    fund_code: str = Field(..., max_length=10, description="基金代码")
    fund_name: str = Field(..., max_length=100, description="基金名称")
    fund_type: Optional[str] = Field(None, description="基金类型")
    fund_company: Optional[str] = Field(None, description="基金公司")
    fund_manager: Optional[str] = Field(None, description="基金经理")


class FundCreate(FundBase):
    inception_date: Optional[datetime] = None
    nav: Optional[float] = None
    nav_date: Optional[datetime] = None


class FundUpdate(BaseModel):
    fund_name: Optional[str] = None
    fund_type: Optional[str] = None
    fund_company: Optional[str] = None
    fund_manager: Optional[str] = None
    nav: Optional[float] = None
    nav_date: Optional[datetime] = None
    is_active: Optional[bool] = None


class FundResponse(FundBase):
    id: int
    nav: Optional[float] = None
    nav_date: Optional[datetime] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============ WeeklyReport Schemas ============
class WeeklyReportBase(BaseModel):
    fund_id: int = Field(..., description="基金ID")
    report_date: datetime = Field(..., description="报告日期")
    week_start: datetime = Field(..., description="周开始日期")
    week_end: datetime = Field(..., description="周结束日期")


class WeeklyReportCreate(WeeklyReportBase):
    weekly_return: Optional[float] = None
    monthly_return: Optional[float] = None
    ytd_return: Optional[float] = None
    max_drawdown: Optional[float] = None
    volatility: Optional[float] = None
    sharpe_ratio: Optional[float] = None
    total_assets: Optional[float] = None
    asset_change: Optional[float] = None


class WeeklyReportUpdate(BaseModel):
    weekly_return: Optional[float] = None
    monthly_return: Optional[float] = None
    ytd_return: Optional[float] = None
    max_drawdown: Optional[float] = None
    volatility: Optional[float] = None
    sharpe_ratio: Optional[float] = None
    total_assets: Optional[float] = None
    asset_change: Optional[float] = None
    ai_summary: Optional[str] = None
    ai_sentiment: Optional[str] = None
    ai_score: Optional[float] = None


class WeeklyReportResponse(WeeklyReportBase):
    id: int
    weekly_return: Optional[float] = None
    monthly_return: Optional[float] = None
    ytd_return: Optional[float] = None
    max_drawdown: Optional[float] = None
    volatility: Optional[float] = None
    sharpe_ratio: Optional[float] = None
    total_assets: Optional[float] = None
    asset_change: Optional[float] = None
    ai_summary: Optional[str] = None
    ai_sentiment: Optional[str] = None
    ai_score: Optional[float] = None
    vector_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WeeklyReportWithFund(WeeklyReportResponse):
    fund: Optional[FundResponse] = None


# ============ NavHistory Schemas ============
class NavHistoryBase(BaseModel):
    fund_id: int
    nav_date: datetime
    nav: float
    acc_nav: Optional[float] = None
    daily_return: Optional[float] = None


class NavHistoryCreate(NavHistoryBase):
    pass


class NavHistoryResponse(NavHistoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============ MarketIndex Schemas ============
class MarketIndexBase(BaseModel):
    index_code: str = Field(..., max_length=10)
    index_name: str = Field(..., max_length=50)
    current_value: Optional[float] = None
    change_percent: Optional[float] = None
    report_date: Optional[datetime] = None


class MarketIndexResponse(MarketIndexBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============ AI Analysis Schemas ============
class AIAnalysisRequest(BaseModel):
    report_id: int = Field(..., description="周报ID")
    analysis_type: str = Field(default="summary", description="分析类型: summary/sentiment/score")


class AIAnalysisResponse(BaseModel):
    report_id: int
    ai_summary: Optional[str] = None
    ai_sentiment: Optional[str] = None
    ai_score: Optional[float] = None


# ============ Vector Search Schemas ============
class VectorSearchRequest(BaseModel):
    query: str = Field(..., description="搜索查询文本")
    top_k: int = Field(default=10, description="返回结果数量")


class VectorSearchResult(BaseModel):
    report_id: int
    fund_code: str
    fund_name: str
    ai_summary: Optional[str] = None
    score: float


class VectorSearchResponse(BaseModel):
    results: List[VectorSearchResult]
    total: int


# ============ Dashboard Schemas ============
class DashboardStats(BaseModel):
    total_funds: int
    total_reports: int
    avg_weekly_return: Optional[float] = None
    avg_ytd_return: Optional[float] = None
    best_performer: Optional[FundResponse] = None
    worst_performer: Optional[FundResponse] = None


# ============ Pagination ============
class PaginatedResponse(BaseModel):
    items: List
    total: int
    page: int
    page_size: int
    total_pages: int
