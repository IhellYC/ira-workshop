# AI基金数据周报系统

## 项目简介

AI基金数据周报系统是一个基于人工智能的基金数据管理和周报生成平台，支持基金数据管理、周报生成、AI分析和语义搜索等功能。

## 技术栈

### 后端
- Python 3.10+
- FastAPI - Web框架
- SQLAlchemy - ORM
- MySQL - 关系型数据库
- Redis - 缓存
- Milvus - 向量数据库
- OpenAI API - AI分析

### 前端
- Vue 3
- Vite
- Element Plus
- Vue Router
- Pinia
- Axios
- ECharts

## 项目结构

```
group-d/05/
├── backend/                    # 后端代码
│   ├── app/
│   │   ├── api/               # API路由
│   │   │   ├── funds.py       # 基金管理API
│   │   │   ├── reports.py     # 周报管理API
│   │   │   └── health.py      # 健康检查API
│   │   ├── models/            # 数据模型
│   │   ├── schemas/           # Pydantic模型
│   │   ├── services/          # 业务服务
│   │   │   ├── ai_service.py  # AI分析服务
│   │   │   ├── redis_service.py # Redis缓存服务
│   │   │   └── milvus_service.py # 向量数据库服务
│   │   ├── config.py          # 配置文件
│   │   ├── database.py        # 数据库连接
│   │   └── main.py            # 应用入口
│   ├── requirements.txt       # Python依赖
│   └── .env.example           # 环境变量示例
├── frontend/                   # 前端代码
│   ├── src/
│   │   ├── api/               # API调用
│   │   ├── router/            # 路由配置
│   │   ├── styles/            # 样式文件
│   │   ├── views/             # 页面组件
│   │   │   ├── Dashboard.vue  # 仪表盘
│   │   │   ├── Funds.vue      # 基金管理
│   │   │   ├── FundDetail.vue # 基金详情
│   │   │   ├── Reports.vue    # 周报列表
│   │   │   ├── ReportDetail.vue # 周报详情
│   │   │   └── Search.vue     # 智能搜索
│   │   ├── App.vue            # 根组件
│   │   └── main.js            # 入口文件
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── docs/                      # 文档目录
```

## 快速开始

### 环境要求

- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Redis 6.0+
- Milvus 2.3+

### 后端启动

1. 创建虚拟环境并安装依赖：
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

2. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

3. 创建数据库：
```sql
CREATE DATABASE ai_fund_weekly CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. 启动后端服务：
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 前端启动

1. 安装依赖：
```bash
cd frontend
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 访问 http://localhost:5173

## API文档

启动后端服务后，访问以下地址查看API文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 主要功能

### 1. 基金管理
- 添加、编辑、删除基金
- 按类型、状态筛选基金
- 搜索基金

### 2. 周报管理
- 创建、编辑、删除周报
- 按日期范围筛选周报
- 查看周报详情

### 3. AI分析
- 自动生成基金周报分析摘要
- 情绪分析（积极/消极/中性）
- AI评分（0-100分）
- 自动向量化存储

### 4. 智能搜索
- 基于语义的相似性搜索
- 支持自然语言查询
- 返回相似度排序结果

## 数据库配置

### MySQL
```
Host: localhost
Port: 3306
User: root
Password: (你的密码)
Database: ai_fund_weekly
```

### Redis
```
URL: redis://localhost:6379/0
```

### Milvus
```
Host: localhost
Port: 19530
```

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| MYSQL_HOST | MySQL主机 | localhost |
| MYSQL_PORT | MySQL端口 | 3306 |
| MYSQL_USER | MySQL用户 | root |
| MYSQL_PASSWORD | MySQL密码 | |
| MYSQL_DATABASE | 数据库名 | ai_fund_weekly |
| REDIS_URL | Redis连接URL | redis://localhost:6379/0 |
| MILVUS_HOST | Milvus主机 | localhost |
| MILVUS_PORT | Milvus端口 | 19530 |
| OPENAI_API_KEY | OpenAI API密钥 | |
| OPENAI_API_BASE | OpenAI API地址 | https://api.openai.com/v1 |
| SECRET_KEY | 应用密钥 | |
| CORS_ORIGINS | 允许的跨域来源 | http://localhost:5173 |

## 开发说明

- 后端默认端口: 8000
- 前端默认端口: 5173
- 前端会自动代理 `/api` 请求到后端

## License

MIT
