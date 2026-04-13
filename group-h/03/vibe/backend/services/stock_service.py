"""股票数据服务 - 通过 yfinance 获取股票信息，网络不可用时返回 mock 数据"""

import yfinance as yf


def get_stock_profile(symbol: str) -> dict:
    """获取公司概况"""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info

        # If info is empty or has no useful data, treat as failure
        if not info or not info.get("shortName"):
            raise ValueError("No profile data")

        # currentPrice 兜底逻辑
        current_price = info.get("currentPrice") or info.get(
            "regularMarketPrice") or info.get("previousClose") or 0.0

        # changePercent 兜底
        change_percent = info.get("regularMarketChangePercent")
        if change_percent is None:
            prev = info.get("previousClose")
            if prev and prev != 0 and current_price:
                change_percent = (
                    (float(current_price) - float(prev)) / float(prev)) * 100
            else:
                change_percent = 0.0

        return {
            "symbol": info.get("symbol", symbol),
            "name": info.get("shortName", ""),
            "sector": info.get("sector", ""),
            "industry": info.get("industry", ""),
            "market_cap": float(info.get("marketCap", 0) or 0),
            "current_price": float(current_price),
            "change_percent": round(float(change_percent), 2),
            "currency": info.get("currency", "USD"),
            "description": info.get("longBusinessSummary", ""),
        }
    except Exception:
        # Mock 数据兜底
        return {
            "symbol": symbol,
            "name": f"{symbol} Inc.",
            "sector": "Technology",
            "industry": "Consumer Electronics",
            "market_cap": 2800000000000,
            "current_price": 178.72,
            "change_percent": 1.25,
            "currency": "USD",
            "description": f"This is mock data for {symbol}. The live data source is currently unavailable."
        }


def get_stock_financials(symbol: str) -> dict:
    """获取核心财务数据"""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info

        if not info or not info.get("shortName"):
            raise ValueError("No financials data")
        fin = ticker.financials  # DataFrame: rows=指标, cols=日期(Timestamp)

        revenue_list = []
        net_income_list = []
        eps_list = []
        dates = []

        if fin is not None and not fin.empty:
            # columns 是日期，按时间正序排列（从旧到新）
            sorted_cols = sorted(fin.columns)
            dates = [col.strftime("%Y") for col in sorted_cols]

            for col in sorted_cols:
                rev = fin.loc["Total Revenue",
                              col] if "Total Revenue" in fin.index else None
                ni = fin.loc["Net Income",
                             col] if "Net Income" in fin.index else None
                revenue_list.append(float(rev) if rev is not None else 0.0)
                net_income_list.append(float(ni) if ni is not None else 0.0)

            # EPS 列表：从 info 中只能拿到 trailing，用相同长度填充
            trailing_eps = info.get("trailingEps")
            # 只有最后一年有 trailing EPS，其余填 0
            eps_list = [0.0] * (len(sorted_cols) - 1) + \
                [float(trailing_eps) if trailing_eps is not None else 0.0]

        return {
            "revenue": revenue_list,
            "net_income": net_income_list,
            "eps": eps_list,
            "pe_ratio": float(info["trailingPE"]) if info.get("trailingPE") is not None else None,
            "pb_ratio": float(info["priceToBook"]) if info.get("priceToBook") is not None else None,
            "gross_margin": float(info["grossMargins"]) if info.get("grossMargins") is not None else None,
            "profit_margin": float(info["profitMargins"]) if info.get("profitMargins") is not None else None,
            "dates": dates,
        }
    except Exception:
        # Mock 数据兜底
        return {
            "revenue": [274515000000, 365817000000, 394328000000, 383285000000],
            "net_income": [57411000000, 94680000000, 99803000000, 96995000000],
            "eps": [0.0, 0.0, 0.0, 6.13],
            "pe_ratio": 29.15,
            "pb_ratio": 47.2,
            "gross_margin": 0.4413,
            "profit_margin": 0.2531,
            "dates": ["2021", "2022", "2023", "2024"],
        }


def get_stock_history(symbol: str, period: str = "1y") -> dict:
    """获取历史价格数据"""
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period)

        if hist.empty:
            raise ValueError("No history data")

        return {
            "dates": [d.strftime("%Y-%m-%d") for d in hist.index],
            "open": [round(float(v), 2) for v in hist["Open"]],
            "high": [round(float(v), 2) for v in hist["High"]],
            "low": [round(float(v), 2) for v in hist["Low"]],
            "close": [round(float(v), 2) for v in hist["Close"]],
            "volume": [int(v) for v in hist["Volume"]],
        }
    except Exception:
        # Mock 数据兜底 - 生成 30 天的模拟数据
        import random
        from datetime import datetime, timedelta

        base_price = 178.0
        dates = []
        open_list = []
        high_list = []
        low_list = []
        close_list = []
        volume_list = []

        num_days = 30 if period in ("1mo", "1m") else 90 if period in (
            "3mo", "3m") else 180 if period in ("6mo", "6m") else 252
        start_date = datetime.now() - timedelta(days=num_days)
        price = base_price

        for i in range(num_days):
            day = start_date + timedelta(days=i)
            if day.weekday() >= 5:  # skip weekends
                continue
            change = random.uniform(-3, 3)
            o = round(price, 2)
            c = round(price + change, 2)
            h = round(max(o, c) + random.uniform(0, 2), 2)
            l = round(min(o, c) - random.uniform(0, 2), 2)
            v = random.randint(40000000, 120000000)
            dates.append(day.strftime("%Y-%m-%d"))
            open_list.append(o)
            close_list.append(c)
            high_list.append(h)
            low_list.append(l)
            volume_list.append(v)
            price = c

        return {
            "dates": dates,
            "open": open_list,
            "high": high_list,
            "low": low_list,
            "close": close_list,
            "volume": volume_list,
        }
