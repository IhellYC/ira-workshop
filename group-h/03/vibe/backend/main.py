from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.stock import router as stock_router
from routers.technical import router as technical_router
from routers.news import router as news_router

app = FastAPI(title="AI投研助手 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stock_router, prefix="/api")
app.include_router(technical_router, prefix="/api")
app.include_router(news_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "AI投研助手 API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
