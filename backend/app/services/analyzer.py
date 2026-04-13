"""分析引擎 - 调用大模型 API 进行资产分析"""

import os
from openai import OpenAI
from typing import Optional


SKILLS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "skills")


def _load_skill(skill_name: str) -> str:
    """加载 skill 文件内容"""
    path = os.path.join(SKILLS_DIR, f"{skill_name}.md")
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def _get_client() -> OpenAI:
    """获取 OpenAI 客户端，支持自定义 base_url"""
    api_key = os.getenv("OPENAI_API_KEY", "")
    base_url = os.getenv("OPENAI_BASE_URL", None)
    return OpenAI(api_key=api_key, base_url=base_url)


def _call_llm(system_prompt: str, user_prompt: str) -> str:
    """调用大模型 API"""
    client = _get_client()
    model = os.getenv("OPENAI_MODEL", "gpt-4o")
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.7,
        max_tokens=4000,
    )
    return response.choices[0].message.content


def analyze_assets(holdings_text: str, feedback: Optional[str] = None) -> str:
    """资产配置分析"""
    skill = _load_skill("asset_analysis")
    user_prompt = f"请分析以下客户持仓数据：\n\n{holdings_text}"
    if feedback:
        user_prompt += f"\n\n客户经理反馈意见（请据此调整分析）：\n{feedback}"
    return _call_llm(skill, user_prompt)


def analyze_trades(trades_text: str, feedback: Optional[str] = None) -> str:
    """交易行为分析"""
    skill = _load_skill("trade_behavior")
    user_prompt = f"请分析以下客户交易记录：\n\n{trades_text}"
    if feedback:
        user_prompt += f"\n\n客户经理反馈意见（请据此调整分析）：\n{feedback}"
    return _call_llm(skill, user_prompt)


def generate_summary(
    asset_analysis: str,
    trade_analysis: str,
    customer_name: str = "客户",
    feedback: Optional[str] = None,
) -> str:
    """生成综合报告"""
    skill = _load_skill("report_template")
    user_prompt = (
        f"客户名称：{customer_name}\n\n"
        f"## 资产配置分析结果\n\n{asset_analysis}\n\n"
        f"## 交易行为分析结果\n\n{trade_analysis}"
    )
    if feedback:
        user_prompt += f"\n\n客户经理反馈意见（请据此调整报告）：\n{feedback}"
    return _call_llm(skill, user_prompt)


def run_full_analysis(
    holdings_text: str,
    trades_text: str,
    customer_name: str = "客户",
    feedback: Optional[str] = None,
) -> dict:
    """运行完整分析流程"""
    asset_result = analyze_assets(holdings_text, feedback)
    trade_result = analyze_trades(trades_text, feedback)
    summary = generate_summary(asset_result, trade_result, customer_name, feedback)

    return {
        "asset_analysis": asset_result,
        "trade_analysis": trade_result,
        "summary": summary,
    }
