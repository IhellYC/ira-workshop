import redis
import json
from typing import Optional, List, Any
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class RedisService:
    """Redis缓存服务"""
    
    def __init__(self):
        self.client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        
    def get(self, key: str) -> Optional[str]:
        """获取缓存值"""
        try:
            return self.client.get(key)
        except Exception as e:
            logger.error(f"Redis get error: {e}")
            return None
    
    def set(self, key: str, value: str, expire: int = 3600) -> bool:
        """设置缓存值"""
        try:
            self.client.setex(key, expire, value)
            return True
        except Exception as e:
            logger.error(f"Redis set error: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """删除缓存"""
        try:
            self.client.delete(key)
            return True
        except Exception as e:
            logger.error(f"Redis delete error: {e}")
            return False
    
    def get_json(self, key: str) -> Optional[Any]:
        """获取JSON格式的缓存"""
        value = self.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return None
        return None
    
    def set_json(self, key: str, value: Any, expire: int = 3600) -> bool:
        """设置JSON格式的缓存"""
        try:
            return self.set(key, json.dumps(value, ensure_ascii=False), expire)
        except Exception as e:
            logger.error(f"Redis set_json error: {e}")
            return False
    
    def get_list(self, key: str) -> List[str]:
        """获取列表"""
        try:
            return self.client.lrange(key, 0, -1)
        except Exception as e:
            logger.error(f"Redis get_list error: {e}")
            return []
    
    def push_list(self, key: str, value: str, max_size: int = 100) -> bool:
        """推入列表，并限制长度"""
        try:
            self.client.lpush(key, value)
            self.client.ltrim(key, 0, max_size - 1)
            return True
        except Exception as e:
            logger.error(f"Redis push_list error: {e}")
            return False
    
    def health_check(self) -> bool:
        """健康检查"""
        try:
            return self.client.ping()
        except Exception as e:
            logger.error(f"Redis health check error: {e}")
            return False


redis_service = RedisService()
