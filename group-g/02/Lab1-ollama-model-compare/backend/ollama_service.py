"""Ollama 服务封装模块"""
import json
from typing import Generator, List, Dict, Any
import requests
from flask import Response


class OllamaService:
    """Ollama 服务封装类，提供模型列表和流式对话功能"""
    
    def __init__(self, host: str = "http://127.0.0.1:11434"):
        self.host = host.rstrip("/")
        self.api_url = f"{self.host}/api"
    
    def list_models(self) -> List[Dict[str, Any]]:
        """获取 Ollama 可用模型列表"""
        try:
            response = requests.get(f"{self.api_url}/tags", timeout=5)
            response.raise_for_status()
            data = response.json()
            models = []
            for model in data.get("models", []):
                models.append({
                    "name": model.get("name", ""),
                    "size": model.get("size", 0),
                    "modified_at": model.get("modified_at", ""),
                    "digest": model.get("digest", ""),
                })
            return models
        except requests.exceptions.RequestException as e:
            raise ConnectionError(f"无法连接到 Ollama 服务 ({self.host}): {str(e)}")
    
    def chat_stream(
        self, 
        model: str, 
        messages: List[Dict[str, str]], 
        **kwargs
    ) -> Generator[str, None, None]:
        """
        流式对话生成器
        
        Args:
            model: 模型名称
            messages: 对话历史 [{"role": "user", "content": "..."}]
            **kwargs: 其他生成参数 (temperature, top_p, etc.)
        
        Yields:
            str: JSON格式的流式响应数据
        """
        url = f"{self.api_url}/chat"
        payload = {
            "model": model,
            "messages": messages,
            "stream": True,
            **kwargs
        }
        
        try:
            with requests.post(url, json=payload, stream=True, timeout=60) as response:
                response.raise_for_status()
                for line in response.iter_lines():
                    if line:
                        yield line.decode("utf-8") + "\n"
        except requests.exceptions.RequestException as e:
            error_msg = json.dumps({
                "error": True,
                "message": f"模型 {model} 调用失败: {str(e)}"
            })
            yield error_msg + "\n"
    
    def generate_stream(
        self,
        model: str,
        prompt: str,
        **kwargs
    ) -> Generator[str, None, None]:
        """
        流式生成响应（简化接口）
        
        Args:
            model: 模型名称
            prompt: 用户输入
            **kwargs: 其他生成参数
        
        Yields:
            str: JSON格式的流式响应数据
        """
        messages = [{"role": "user", "content": prompt}]
        yield from self.chat_stream(model, messages, **kwargs)
    
    def health_check(self) -> bool:
        """检查 Ollama 服务是否可用"""
        try:
            response = requests.get(f"{self.host}", timeout=2)
            return response.status_code == 200
        except:
            return False


# 创建全局服务实例
ollama_service = OllamaService()
