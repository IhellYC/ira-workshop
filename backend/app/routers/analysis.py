"""分析相关 API 路由"""

import os
import uuid
import traceback
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse

from app.services.data_parser import parse_holdings, parse_trades
from app.services.analyzer import run_full_analysis
from app.services.pdf_generator import generate_pdf

router = APIRouter()

# 内存存储（生产环境应使用数据库）
_tasks: dict = {}

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
REPORT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "reports")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(REPORT_DIR, exist_ok=True)


def _save_upload(file: UploadFile, task_id: str, prefix: str) -> str:
    """保存上传文件到本地"""
    ext = os.path.splitext(file.filename)[1] or ".csv"
    filename = f"{task_id}_{prefix}{ext}"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as f:
        f.write(file.file.read())
    return path


@router.post("/upload")
async def upload_files(
    holdings_file: UploadFile = File(..., description="持仓数据文件(CSV/Excel)"),
    trades_file: UploadFile = File(None, description="交易记录文件(CSV/Excel，可选)"),
    customer_name: str = Form("客户"),
):
    """上传持仓和交易数据文件"""
    task_id = str(uuid.uuid4())[:8]

    holdings_path = _save_upload(holdings_file, task_id, "holdings")

    trades_path = None
    if trades_file:
        trades_path = _save_upload(trades_file, task_id, "trades")

    # 解析文件做预览
    try:
        h_df, h_text = parse_holdings(holdings_path)
        holdings_preview = h_df.head(10).to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"持仓文件解析失败: {str(e)}")

    trades_preview = None
    t_text = ""
    if trades_path:
        try:
            t_df, t_text = parse_trades(trades_path)
            trades_preview = t_df.head(10).to_dict(orient="records")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"交易文件解析失败: {str(e)}")

    _tasks[task_id] = {
        "task_id": task_id,
        "customer_name": customer_name,
        "status": "pending",
        "holdings_path": holdings_path,
        "trades_path": trades_path,
        "holdings_text": h_text,
        "trades_text": t_text,
        "result": None,
    }

    return {
        "task_id": task_id,
        "customer_name": customer_name,
        "holdings_preview": holdings_preview,
        "trades_preview": trades_preview,
        "message": "文件上传成功，请调用分析接口开始分析",
    }


@router.post("/analyze")
async def analyze(task_id: str = Form(...), customer_name: Optional[str] = Form(None)):
    """触发分析"""
    task = _tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")

    if customer_name:
        task["customer_name"] = customer_name

    task["status"] = "analyzing"

    try:
        holdings_text = task["holdings_text"]
        trades_text = task.get("trades_text", "暂无交易记录数据")

        result = run_full_analysis(
            holdings_text=holdings_text,
            trades_text=trades_text,
            customer_name=task["customer_name"],
        )

        # 生成 PDF
        pdf_path = generate_pdf(
            task_id=task_id,
            customer_name=task["customer_name"],
            asset_analysis=result["asset_analysis"],
            trade_analysis=result["trade_analysis"],
            summary=result["summary"],
            output_dir=REPORT_DIR,
        )

        task["status"] = "completed"
        task["result"] = result
        task["pdf_path"] = pdf_path

        return {
            "task_id": task_id,
            "status": "completed",
            "asset_analysis": result["asset_analysis"],
            "trade_analysis": result["trade_analysis"],
            "summary": result["summary"],
        }

    except Exception as e:
        task["status"] = "failed"
        task["error"] = str(e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"分析失败: {str(e)}")


@router.get("/report/{task_id}/pdf")
async def download_pdf(task_id: str):
    """下载 PDF 报告"""
    task = _tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")

    pdf_path = task.get("pdf_path")
    if not pdf_path or not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="报告尚未生成")

    return FileResponse(
        path=pdf_path,
        filename=f"资产分析报告_{task['customer_name']}_{task_id}.pdf",
        media_type="application/pdf",
    )


@router.post("/analyze/{task_id}/regenerate")
async def regenerate(task_id: str, feedback: str = Form(...)):
    """根据反馈重新生成分析"""
    task = _tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")

    task["status"] = "analyzing"

    try:
        holdings_text = task["holdings_text"]
        trades_text = task.get("trades_text", "暂无交易记录数据")

        result = run_full_analysis(
            holdings_text=holdings_text,
            trades_text=trades_text,
            customer_name=task["customer_name"],
            feedback=feedback,
        )

        pdf_path = generate_pdf(
            task_id=task_id,
            customer_name=task["customer_name"],
            asset_analysis=result["asset_analysis"],
            trade_analysis=result["trade_analysis"],
            summary=result["summary"],
            output_dir=REPORT_DIR,
        )

        task["status"] = "completed"
        task["result"] = result
        task["pdf_path"] = pdf_path

        return {
            "task_id": task_id,
            "status": "completed",
            "asset_analysis": result["asset_analysis"],
            "trade_analysis": result["trade_analysis"],
            "summary": result["summary"],
        }

    except Exception as e:
        task["status"] = "failed"
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"重新生成失败: {str(e)}")


@router.get("/task/{task_id}")
async def get_task_status(task_id: str):
    """查询任务状态"""
    task = _tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")

    response = {
        "task_id": task_id,
        "status": task["status"],
        "customer_name": task["customer_name"],
    }
    if task["result"]:
        response.update(task["result"])

    return response
