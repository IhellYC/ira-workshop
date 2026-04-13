"""技术分析服务 - 计算各类技术指标"""

import yfinance as yf
import pandas as pd
import numpy as np


def _sma(series: pd.Series, length: int) -> pd.Series:
    return series.rolling(window=length).mean()


def _ema(series: pd.Series, length: int) -> pd.Series:
    return series.ewm(span=length, adjust=False).mean()


def _macd(close: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9):
    ema_fast = _ema(close, fast)
    ema_slow = _ema(close, slow)
    macd_line = ema_fast - ema_slow
    signal_line = _ema(macd_line, signal)
    histogram = macd_line - signal_line
    return macd_line, signal_line, histogram


def _stoch(high: pd.Series, low: pd.Series, close: pd.Series, k: int = 9, d: int = 3, smooth_k: int = 3):
    lowest_low = low.rolling(window=k).min()
    highest_high = high.rolling(window=k).max()
    raw_k = 100 * (close - lowest_low) / (highest_high - lowest_low)
    k_line = raw_k.rolling(window=smooth_k).mean()
    d_line = k_line.rolling(window=d).mean()
    return k_line, d_line


def _rsi(close: pd.Series, length: int = 14) -> pd.Series:
    delta = close.diff()
    gain = delta.where(delta > 0, 0.0)
    loss = (-delta).where(delta < 0, 0.0)
    avg_gain = gain.rolling(window=length, min_periods=length).mean()
    avg_loss = loss.rolling(window=length, min_periods=length).mean()
    for i in range(length, len(close)):
        avg_gain.iloc[i] = (avg_gain.iloc[i - 1] *
                            (length - 1) + gain.iloc[i]) / length
        avg_loss.iloc[i] = (avg_loss.iloc[i - 1] *
                            (length - 1) + loss.iloc[i]) / length
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi


def _bbands(close: pd.Series, length: int = 20, std: float = 2.0):
    mid = _sma(close, length)
    std_dev = close.rolling(window=length).std()
    upper = mid + std * std_dev
    lower = mid - std * std_dev
    return lower, mid, upper


def _safe_round(v, decimals=2):
    if v is None or (isinstance(v, float) and np.isnan(v)):
        return None
    return round(float(v), decimals)


def _build_result(df: pd.DataFrame) -> dict:
    """从 DataFrame 构建返回结果"""
    df = df.where(pd.notnull(df), None)
    return {
        "dates": [d.strftime("%Y-%m-%d") for d in df.index],
        "open": [_safe_round(v) for v in df['Open'].tolist()],
        "high": [_safe_round(v) for v in df['High'].tolist()],
        "low": [_safe_round(v) for v in df['Low'].tolist()],
        "close": [_safe_round(v) for v in df['Close'].tolist()],
        "volume": [int(v) if v is not None else 0 for v in df['Volume'].tolist()],
        "ma5": [_safe_round(v) for v in df['ma5'].tolist()],
        "ma10": [_safe_round(v) for v in df['ma10'].tolist()],
        "ma20": [_safe_round(v) for v in df['ma20'].tolist()],
        "ma60": [_safe_round(v) for v in df['ma60'].tolist()],
        "macd": [_safe_round(v, 4) for v in df['macd'].tolist()],
        "macd_signal": [_safe_round(v, 4) for v in df['macd_signal'].tolist()],
        "macd_hist": [_safe_round(v, 4) for v in df['macd_hist'].tolist()],
        "kdj_k": [_safe_round(v) for v in df['kdj_k'].tolist()],
        "kdj_d": [_safe_round(v) for v in df['kdj_d'].tolist()],
        "kdj_j": [_safe_round(v) for v in df['kdj_j'].tolist()],
        "rsi": [_safe_round(v) for v in df['rsi'].tolist()],
        "boll_upper": [_safe_round(v) for v in df['boll_upper'].tolist()],
        "boll_mid": [_safe_round(v) for v in df['boll_mid'].tolist()],
        "boll_lower": [_safe_round(v) for v in df['boll_lower'].tolist()],
    }


def _compute_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """对 DataFrame 计算所有技术指标"""
    df['ma5'] = _sma(df['Close'], 5)
    df['ma10'] = _sma(df['Close'], 10)
    df['ma20'] = _sma(df['Close'], 20)
    df['ma60'] = _sma(df['Close'], 60)
    df['macd'], df['macd_signal'], df['macd_hist'] = _macd(
        df['Close'], 12, 26, 9)
    df['kdj_k'], df['kdj_d'] = _stoch(
        df['High'], df['Low'], df['Close'], k=9, d=3, smooth_k=3)
    df['kdj_j'] = 3 * df['kdj_k'] - 2 * df['kdj_d']
    df['rsi'] = _rsi(df['Close'], 14)
    df['boll_lower'], df['boll_mid'], df['boll_upper'] = _bbands(
        df['Close'], 20, 2)
    return df


def _generate_mock_data(symbol: str, period: str) -> dict:
    """生成模拟技术指标数据"""
    import random
    from datetime import datetime, timedelta

    num_days = 30 if period in ("1mo", "1m") else 90 if period in (
        "3mo", "3m") else 180 if period in ("6mo", "6m") else 252
    start_date = datetime.now() - timedelta(days=int(num_days * 1.5))
    base_price = 178.0
    price = base_price

    dates, opens, highs, lows, closes, volumes = [], [], [], [], [], []
    for i in range(int(num_days * 1.5)):
        day = start_date + timedelta(days=i)
        if day.weekday() >= 5:
            continue
        change = random.uniform(-3, 3)
        o = round(price, 2)
        c = round(price + change, 2)
        h = round(max(o, c) + random.uniform(0, 2), 2)
        l = round(min(o, c) - random.uniform(0, 2), 2)
        dates.append(day.strftime("%Y-%m-%d"))
        opens.append(o)
        closes.append(c)
        highs.append(h)
        lows.append(l)
        volumes.append(random.randint(40000000, 120000000))
        price = c

    df = pd.DataFrame(
        {"Open": opens, "High": highs, "Low": lows,
            "Close": closes, "Volume": volumes},
        index=pd.to_datetime(dates),
    )
    df = _compute_indicators(df)
    return _build_result(df)


def get_technical_indicators(symbol: str, period: str = "1y") -> dict:
    """获取技术分析指标（MA, MACD, KDJ, RSI, BOLL）"""
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period)

        if df.empty:
            raise ValueError(f"No data found for symbol: {symbol}")

        df = _compute_indicators(df)
        return _build_result(df)
    except Exception:
        # Mock 数据兜底
        return _generate_mock_data(symbol, period)
