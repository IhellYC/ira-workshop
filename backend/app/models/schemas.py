from pydantic import BaseModel
from typing import Optional
from enum import Enum


class TaskStatus(str, Enum):
    PENDING = "pending"
    ANALYZING = "analyzing"
    COMPLETED = "completed"
    FAILED = "failed"


class AnalyzeRequest(BaseModel):
    task_id: str
    customer_name: Optional[str] = "客户"


class RegenerateRequest(BaseModel):
    feedback: str


class AnalysisResult(BaseModel):
    task_id: str
    status: TaskStatus
    customer_name: str
    asset_analysis: Optional[str] = None
    trade_analysis: Optional[str] = None
    summary: Optional[str] = None
    error: Optional[str] = None
