from openai import OpenAI
from typing import Optional, List
from app.config import settings
import logging
import json

logger = logging.getLogger(__name__)


class AIService:
    """AI分析服务"""
    
    def __init__(self):
        self.client = None
        if settings.OPENAI_API_KEY:
            self.client = OpenAI(
                api_key=settings.OPENAI_API_KEY,
                base_url=settings.OPENAI_API_BASE
            )
    
    def _get_client(self):
        """获取OpenAI客户端"""
        if self.client is None:
            if settings.OPENAI_API_KEY:
                self.client = OpenAI(
                    api_key=settings.OPENAI_API_KEY,
                    base_url=settings.OPENAI_API_BASE
                )
        return self.client
    
    def is_available(self) -> bool:
        """检查AI服务是否可用"""
        return settings.OPENAI_API_KEY is not None and settings.OPENAI_API_KEY != ""
    
    def get_embedding(self, text: str) -> Optional[List[float]]:
        """获取文本嵌入向量"""
        client = self._get_client()
        if client is None:
            logger.warning("OpenAI client not available")
            return None
        
        try:
            response = client.embeddings.create(
                model="text-embedding-ada-002",
                input=text[:8000]  # 限制输入长度
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Failed to get embedding: {e}")
            return None
    
    def analyze_fund_report(self, fund_info: dict, report_data: dict) -> dict:
        """分析基金周报"""
        client = self._get_client()
        if client is None:
            return {
                "ai_summary": "AI服务暂不可用",
                "ai_sentiment": "neutral",
                "ai_score": 50.0
            }
        
        prompt = f"""请分析以下基金周报数据，并提供专业的投资分析：

基金信息：
- 基金代码：{fund_info.get('fund_code', 'N/A')}
- 基金名称：{fund_info.get('fund_name', 'N/A')}
- 基金类型：{fund_info.get('fund_type', 'N/A')}
- 基金经理：{fund_info.get('fund_manager', 'N/A')}

周报数据：
- 周收益率：{report_data.get('weekly_return', 'N/A')}%
- 月收益率：{report_data.get('monthly_return', 'N/A')}%
- 年初至今收益率：{report_data.get('ytd_return', 'N/A')}%
- 最大回撤：{report_data.get('max_drawdown', 'N/A')}%
- 波动率：{report_data.get('volatility', 'N/A')}%
- 夏普比率：{report_data.get('sharpe_ratio', 'N/A')}
- 总资产规模：{report_data.get('total_assets', 'N/A')}亿元

请以JSON格式返回分析结果，包含以下字段：
1. ai_summary: 200字以内的分析摘要
2. ai_sentiment: 情绪分析，可选值为 positive/negative/neutral
3. ai_score: 投资评分，范围0-100

只返回JSON，不要其他内容。"""
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "你是一位专业的基金分析师，擅长分析基金数据和投资风险。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            content = response.choices[0].message.content.strip()
            
            # 尝试解析JSON
            try:
                result = json.loads(content)
                return {
                    "ai_summary": result.get("ai_summary", ""),
                    "ai_sentiment": result.get("ai_sentiment", "neutral"),
                    "ai_score": float(result.get("ai_score", 50))
                }
            except json.JSONDecodeError:
                # 如果不是JSON格式，返回文本摘要
                return {
                    "ai_summary": content[:500],
                    "ai_sentiment": "neutral",
                    "ai_score": 50.0
                }
        except Exception as e:
            logger.error(f"Failed to analyze fund report: {e}")
            return {
                "ai_summary": f"分析失败: {str(e)}",
                "ai_sentiment": "neutral",
                "ai_score": 50.0
            }
    
    def generate_weekly_summary(self, reports: List[dict]) -> str:
        """生成周报总结"""
        client = self._get_client()
        if client is None:
            return "AI服务暂不可用，无法生成周报总结。"
        
        # 构建报告摘要
        reports_summary = "\n".join([
            f"- {r.get('fund_code')} {r.get('fund_name')}: 周收益率 {r.get('weekly_return', 'N/A')}%"
            for r in reports[:20]  # 限制数量
        ])
        
        prompt = f"""请根据以下基金周报数据，生成一份投资周报总结：

{reports_summary}

请包含以下内容：
1. 市场整体表现概述
2. 表现较好的基金分析
3. 表现较差的基金分析
4. 下周投资建议

总结字数控制在500字以内。"""
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "你是一位专业的基金分析师。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"Failed to generate weekly summary: {e}")
            return f"生成周报总结失败: {str(e)}"


ai_service = AIService()
