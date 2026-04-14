from app.database import Base
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime


class Fund(Base):
    """基金基本信息表"""
    __tablename__ = "funds"

    id = Column(Integer, primary_key=True, index=True)
    fund_code = Column(String(10), unique=True, index=True, nullable=False, comment="基金代码")
    fund_name = Column(String(100), nullable=False, comment="基金名称")
    fund_type = Column(String(50), comment="基金类型")
    fund_company = Column(String(100), comment="基金公司")
    fund_manager = Column(String(50), comment="基金经理")
    inception_date = Column(DateTime, comment="成立日期")
    nav = Column(Float, comment="最新净值")
    nav_date = Column(DateTime, comment="净值日期")
    is_active = Column(Boolean, default=True, comment="是否活跃")
    created_at = Column(DateTime, default=datetime.utcnow, comment="创建时间")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, comment="更新时间")

    # 关系
    weekly_reports = relationship("WeeklyReport", back_populates="fund")
    nav_histories = relationship("NavHistory", back_populates="fund")


class WeeklyReport(Base):
    """周报表"""
    __tablename__ = "weekly_reports"

    id = Column(Integer, primary_key=True, index=True)
    fund_id = Column(Integer, ForeignKey("funds.id"), nullable=False, comment="基金ID")
    report_date = Column(DateTime, nullable=False, comment="报告日期")
    week_start = Column(DateTime, nullable=False, comment="周开始日期")
    week_end = Column(DateTime, nullable=False, comment="周结束日期")
    
    # 收益相关
    weekly_return = Column(Float, comment="周收益率(%)")
    monthly_return = Column(Float, comment="月收益率(%)")
    ytd_return = Column(Float, comment="年初至今收益率(%)")
    
    # 风险指标
    max_drawdown = Column(Float, comment="最大回撤(%)")
    volatility = Column(Float, comment="波动率(%)")
    sharpe_ratio = Column(Float, comment="夏普比率")
    
    # 规模相关
    total_assets = Column(Float, comment="总资产规模(亿元)")
    asset_change = Column(Float, comment="资产变动(亿元)")
    
    # AI分析
    ai_summary = Column(Text, comment="AI分析摘要")
    ai_sentiment = Column(String(20), comment="AI情绪分析: positive/negative/neutral")
    ai_score = Column(Float, comment="AI评分(0-100)")
    
    # 向量ID (用于向量检索)
    vector_id = Column(String(100), comment="向量库中的ID")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关系
    fund = relationship("Fund", back_populates="weekly_reports")


class NavHistory(Base):
    """净值历史表"""
    __tablename__ = "nav_histories"

    id = Column(Integer, primary_key=True, index=True)
    fund_id = Column(Integer, ForeignKey("funds.id"), nullable=False)
    nav_date = Column(DateTime, nullable=False, comment="净值日期")
    nav = Column(Float, nullable=False, comment="单位净值")
    acc_nav = Column(Float, comment="累计净值")
    daily_return = Column(Float, comment="日收益率(%)")
    created_at = Column(DateTime, default=datetime.utcnow)

    fund = relationship("Fund", back_populates="nav_histories")


class MarketIndex(Base):
    """市场指数表"""
    __tablename__ = "market_indices"

    id = Column(Integer, primary_key=True, index=True)
    index_code = Column(String(10), unique=True, index=True, comment="指数代码")
    index_name = Column(String(50), nullable=False, comment="指数名称")
    current_value = Column(Float, comment="当前点位")
    change_percent = Column(Float, comment="涨跌幅(%)")
    report_date = Column(DateTime, comment="报告日期")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ReportTemplate(Base):
    """报告模板表"""
    __tablename__ = "report_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, comment="模板名称")
    description = Column(Text, comment="模板描述")
    template_content = Column(Text, nullable=False, comment="模板内容")
    is_default = Column(Boolean, default=False, comment="是否默认模板")
    is_active = Column(Boolean, default=True, comment="是否启用")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AIAnalysisLog(Base):
    """AI分析日志表"""
    __tablename__ = "ai_analysis_logs"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("weekly_reports.id"), comment="关联周报ID")
    prompt = Column(Text, comment="提示词")
    response = Column(Text, comment="AI响应")
    model = Column(String(50), comment="使用的模型")
    tokens_used = Column(Integer, comment="使用的token数")
    analysis_type = Column(String(50), comment="分析类型")
    created_at = Column(DateTime, default=datetime.utcnow)
