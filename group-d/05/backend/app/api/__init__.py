from fastapi import APIRouter
from app.api import funds, reports, health

api_router = APIRouter()

# 注册各模块路由
api_router.include_router(health.router)
api_router.include_router(funds.router)
api_router.include_router(reports.router)
