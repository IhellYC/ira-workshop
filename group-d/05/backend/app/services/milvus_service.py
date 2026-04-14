from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType, utility
from typing import List, Optional, Dict, Any
from app.config import settings
import logging
import numpy as np

logger = logging.getLogger(__name__)


class MilvusService:
    """Milvus向量数据库服务"""
    
    COLLECTION_NAME = "fund_weekly_reports"
    VECTOR_DIMENSION = 1536  # OpenAI embedding维度
    
    def __init__(self):
        self.connected = False
        self.collection = None
        
    def connect(self) -> bool:
        """连接Milvus"""
        try:
            connections.connect(
                alias="default",
                host=settings.MILVUS_HOST,
                port=settings.MILVUS_PORT
            )
            self.connected = True
            logger.info(f"Connected to Milvus at {settings.MILVUS_HOST}:{settings.MILVUS_PORT}")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to Milvus: {e}")
            self.connected = False
            return False
    
    def disconnect(self):
        """断开连接"""
        try:
            connections.disconnect("default")
            self.connected = False
        except Exception as e:
            logger.error(f"Failed to disconnect from Milvus: {e}")
    
    def create_collection(self) -> bool:
        """创建集合"""
        try:
            if utility.has_collection(self.COLLECTION_NAME):
                logger.info(f"Collection {self.COLLECTION_NAME} already exists")
                return True
            
            fields = [
                FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
                FieldSchema(name="report_id", dtype=DataType.INT64),
                FieldSchema(name="fund_code", dtype=DataType.VARCHAR, max_length=10),
                FieldSchema(name="fund_name", dtype=DataType.VARCHAR, max_length=100),
                FieldSchema(name="ai_summary", dtype=DataType.VARCHAR, max_length=2000),
                FieldSchema(name="report_date", dtype=DataType.INT64),  # timestamp
                FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=self.VECTOR_DIMENSION)
            ]
            
            schema = CollectionSchema(fields=fields, description="基金周报向量存储")
            self.collection = Collection(name=self.COLLECTION_NAME, schema=schema)
            
            # 创建索引
            index_params = {
                "metric_type": "COSINE",
                "index_type": "IVF_FLAT",
                "params": {"nlist": 1024}
            }
            self.collection.create_index(field_name="embedding", index_params=index_params)
            
            logger.info(f"Created collection {self.COLLECTION_NAME}")
            return True
        except Exception as e:
            logger.error(f"Failed to create collection: {e}")
            return False
    
    def get_collection(self) -> Optional[Collection]:
        """获取集合"""
        if not self.connected:
            self.connect()
        
        if self.collection is None:
            try:
                self.collection = Collection(self.COLLECTION_NAME)
            except Exception as e:
                logger.error(f"Failed to get collection: {e}")
                return None
        return self.collection
    
    def insert_vectors(self, data: List[Dict[str, Any]]) -> Optional[List[int]]:
        """插入向量数据"""
        collection = self.get_collection()
        if collection is None:
            return None
        
        try:
            insert_data = [
                [d["report_id"] for d in data],
                [d["fund_code"] for d in data],
                [d["fund_name"] for d in data],
                [d.get("ai_summary", "")[:2000] for d in data],
                [d["report_date"] for d in data],
                [d["embedding"] for d in data]
            ]
            
            result = collection.insert(insert_data)
            collection.flush()
            logger.info(f"Inserted {len(data)} vectors")
            return result.primary_keys
        except Exception as e:
            logger.error(f"Failed to insert vectors: {e}")
            return None
    
    def search_similar(self, query_embedding: List[float], top_k: int = 10) -> List[Dict[str, Any]]:
        """搜索相似向量"""
        collection = self.get_collection()
        if collection is None:
            return []
        
        try:
            collection.load()
            
            search_params = {"metric_type": "COSINE", "params": {"nprobe": 10}}
            
            results = collection.search(
                data=[query_embedding],
                anns_field="embedding",
                param=search_params,
                limit=top_k,
                output_fields=["report_id", "fund_code", "fund_name", "ai_summary", "report_date"]
            )
            
            search_results = []
            for hits in results:
                for hit in hits:
                    search_results.append({
                        "report_id": hit.entity.get("report_id"),
                        "fund_code": hit.entity.get("fund_code"),
                        "fund_name": hit.entity.get("fund_name"),
                        "ai_summary": hit.entity.get("ai_summary"),
                        "report_date": hit.entity.get("report_date"),
                        "score": hit.score
                    })
            
            return search_results
        except Exception as e:
            logger.error(f"Failed to search vectors: {e}")
            return []
    
    def delete_by_report_id(self, report_id: int) -> bool:
        """根据report_id删除向量"""
        collection = self.get_collection()
        if collection is None:
            return False
        
        try:
            collection.delete(f'report_id == {report_id}')
            logger.info(f"Deleted vectors for report_id {report_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete vectors: {e}")
            return False
    
    def health_check(self) -> bool:
        """健康检查"""
        try:
            if not self.connected:
                return self.connect()
            return True
        except Exception as e:
            logger.error(f"Milvus health check failed: {e}")
            return False


milvus_service = MilvusService()
