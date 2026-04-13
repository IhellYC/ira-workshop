"""数据解析服务 - 解析上传的持仓和交易数据文件"""

import pandas as pd
from typing import Tuple


def parse_holdings(file_path: str) -> Tuple[pd.DataFrame, str]:
    """解析持仓数据文件，返回 DataFrame 和格式化文本"""
    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path, encoding="utf-8-sig")
    else:
        df = pd.read_excel(file_path)

    # 标准化列名映射
    column_mapping = {
        "证券名称": "name",
        "证券代码": "code",
        "持仓数量": "quantity",
        "成本价": "cost_price",
        "现价": "current_price",
        "市值": "market_value",
        "资产类别": "asset_type",
        "行业": "industry",
        "浮动盈亏": "pnl",
        "盈亏比例": "pnl_ratio",
    }

    renamed = {}
    for cn, en in column_mapping.items():
        for col in df.columns:
            if cn in str(col):
                renamed[col] = en
                break
    if renamed:
        df = df.rename(columns=renamed)

    # 计算衍生字段
    if "market_value" not in df.columns and "quantity" in df.columns and "current_price" in df.columns:
        df["market_value"] = df["quantity"] * df["current_price"]
    if "pnl" not in df.columns and "quantity" in df.columns and "cost_price" in df.columns and "current_price" in df.columns:
        df["pnl"] = df["quantity"] * (df["current_price"] - df["cost_price"])
    if "pnl_ratio" not in df.columns and "cost_price" in df.columns and "current_price" in df.columns:
        df["pnl_ratio"] = ((df["current_price"] - df["cost_price"]) / df["cost_price"] * 100).round(2)

    # 格式化为文本供 LLM 分析
    text = "## 持仓数据\n\n"
    text += df.to_string(index=False)
    if "market_value" in df.columns:
        total = df["market_value"].sum()
        text += f"\n\n总市值: {total:,.2f}"

    return df, text


def parse_trades(file_path: str) -> Tuple[pd.DataFrame, str]:
    """解析交易记录文件，返回 DataFrame 和格式化文本"""
    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path, encoding="utf-8-sig")
    else:
        df = pd.read_excel(file_path)

    column_mapping = {
        "证券名称": "name",
        "证券代码": "code",
        "交易方向": "direction",
        "买卖方向": "direction",
        "交易数量": "quantity",
        "成交数量": "quantity",
        "成交价格": "price",
        "交易价格": "price",
        "成交金额": "amount",
        "交易金额": "amount",
        "交易时间": "trade_time",
        "成交时间": "trade_time",
        "交易日期": "trade_time",
        "手续费": "commission",
    }

    renamed = {}
    for cn, en in column_mapping.items():
        for col in df.columns:
            if cn in str(col):
                renamed[col] = en
                break
    if renamed:
        df = df.rename(columns=renamed)

    if "amount" not in df.columns and "quantity" in df.columns and "price" in df.columns:
        df["amount"] = df["quantity"] * df["price"]

    text = "## 交易记录数据\n\n"
    text += df.to_string(index=False)
    text += f"\n\n总交易笔数: {len(df)}"

    return df, text
