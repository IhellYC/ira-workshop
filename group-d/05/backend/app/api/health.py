from fastapi import APIRouter
from app.services import redis_service, milvus_service, ai_service
from app.config import settings

router = APIRouter(tags=["系统"])


@router.get("/health")
def health_check():
    """系统健康检查"""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


@router.get("/health/detail")
def detailed_health_check():
    """详细健康检查"""
    redis_status = "connected" if redis_service.health_check() else "disconnected"
    milvus_status = "connected" if milvus_service.health_check() else "disconnected"
    ai_status = "available" if ai_service.is_available() else "unavailable"
    
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "services": {
            "redis": redis_status,
            "milvus": milvus_status,
            "ai": ai_status
        }
    }
