# AI基金数据周报系统 - 后端入口
# 运行方式: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
