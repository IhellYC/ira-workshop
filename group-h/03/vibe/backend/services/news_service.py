"""资讯服务 - 获取股票相关新闻，网络不可用时返回 mock 数据"""

import yfinance as yf
from datetime import datetime, timedelta


def _parse_news_item(article: dict) -> dict:
    """从 yfinance 新闻数据中解析单条新闻"""
    # 安全获取缩略图URL
    thumbnail = None
    thumb_data = article.get("thumbnail")
    if thumb_data and isinstance(thumb_data, dict):
        resolutions = thumb_data.get("resolutions", [])
        if resolutions:
            thumbnail = resolutions[0].get("url")

    # 时间戳转换为 ISO 格式字符串
    pub_time = article.get("providerPublishTime", 0)
    published_at = datetime.fromtimestamp(
        pub_time).isoformat() if pub_time else None

    return {
        "title": article.get("title", ""),
        "source": article.get("publisher", "Unknown"),
        "published_at": published_at,
        "url": article.get("link", ""),
        "thumbnail": thumbnail,
        "summary": None  # yfinance 新闻不提供摘要
    }


def _mock_stock_news(symbol: str) -> list:
    """生成模拟个股新闻"""
    now = datetime.now()
    return [
        {
            "title": f"{symbol} Reports Strong Q4 Earnings, Beating Analyst Expectations",
            "source": "Reuters",
            "published_at": (now - timedelta(hours=2)).isoformat(),
            "url": f"https://example.com/news/{symbol.lower()}-q4-earnings",
            "thumbnail": None,
            "summary": f"{symbol} reported quarterly earnings that exceeded Wall Street expectations."
        },
        {
            "title": f"Analysts Upgrade {symbol} Price Target Amid Growth Outlook",
            "source": "Bloomberg",
            "published_at": (now - timedelta(hours=5)).isoformat(),
            "url": f"https://example.com/news/{symbol.lower()}-upgrade",
            "thumbnail": None,
            "summary": f"Several major analysts raised their price targets for {symbol}."
        },
        {
            "title": f"{symbol} Announces New Product Line for 2026",
            "source": "CNBC",
            "published_at": (now - timedelta(hours=8)).isoformat(),
            "url": f"https://example.com/news/{symbol.lower()}-new-product",
            "thumbnail": None,
            "summary": f"{symbol} unveiled its latest product lineup at a special event."
        },
        {
            "title": f"{symbol} Stock Rises on Strong Market Momentum",
            "source": "MarketWatch",
            "published_at": (now - timedelta(days=1)).isoformat(),
            "url": f"https://example.com/news/{symbol.lower()}-momentum",
            "thumbnail": None,
            "summary": None
        },
        {
            "title": f"Institutional Investors Increase {symbol} Holdings",
            "source": "Financial Times",
            "published_at": (now - timedelta(days=2)).isoformat(),
            "url": f"https://example.com/news/{symbol.lower()}-holdings",
            "thumbnail": None,
            "summary": None
        },
    ]


def _mock_market_news() -> list:
    """生成模拟市场新闻"""
    now = datetime.now()
    return [
        {
            "title": "S&P 500 Reaches New All-Time High as Tech Stocks Rally",
            "source": "Reuters",
            "published_at": (now - timedelta(hours=1)).isoformat(),
            "url": "https://example.com/news/sp500-high",
            "thumbnail": None,
            "summary": "The S&P 500 index reached a record high, driven by gains in technology stocks."
        },
        {
            "title": "Federal Reserve Holds Interest Rates Steady",
            "source": "Bloomberg",
            "published_at": (now - timedelta(hours=3)).isoformat(),
            "url": "https://example.com/news/fed-rates",
            "thumbnail": None,
            "summary": "The Federal Reserve decided to keep interest rates unchanged at its latest meeting."
        },
        {
            "title": "NASDAQ Composite Gains 1.5% on AI Sector Boost",
            "source": "CNBC",
            "published_at": (now - timedelta(hours=6)).isoformat(),
            "url": "https://example.com/news/nasdaq-ai",
            "thumbnail": None,
            "summary": "AI-related stocks lifted the NASDAQ to strong gains today."
        },
        {
            "title": "Global Markets Mixed Amid Trade Policy Uncertainty",
            "source": "Financial Times",
            "published_at": (now - timedelta(hours=10)).isoformat(),
            "url": "https://example.com/news/global-markets",
            "thumbnail": None,
            "summary": None
        },
        {
            "title": "Oil Prices Surge on Supply Concerns",
            "source": "MarketWatch",
            "published_at": (now - timedelta(days=1)).isoformat(),
            "url": "https://example.com/news/oil-surge",
            "thumbnail": None,
            "summary": None
        },
    ]


def get_stock_news(symbol: str) -> list:
    """获取个股相关新闻"""
    try:
        ticker = yf.Ticker(symbol)
        news = ticker.news

        items = []
        for article in (news or []):
            items.append(_parse_news_item(article))

        if not items:
            return _mock_stock_news(symbol)
        return items
    except Exception:
        return _mock_stock_news(symbol)


def get_market_news() -> list:
    """获取市场热点新闻"""
    try:
        # 使用几个主要指数/热门股票的新闻作为市场新闻
        market_symbols = ["^GSPC", "^IXIC", "^DJI"]  # S&P500, NASDAQ, DJI
        all_news = []
        seen_titles = set()  # 去重

        for sym in market_symbols:
            try:
                ticker = yf.Ticker(sym)
                news = ticker.news or []
                for article in news:
                    title = article.get("title", "")
                    if title and title not in seen_titles:
                        seen_titles.add(title)
                        all_news.append(_parse_news_item(article))
            except Exception:
                continue

        # 按时间排序（最新在前）
        all_news.sort(key=lambda x: x["published_at"] or "", reverse=True)
        result = all_news[:20]  # 最多返回20条
        if not result:
            return _mock_market_news()
        return result
    except Exception:
        return _mock_market_news()
