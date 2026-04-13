# 快速启动指南

## 第一步：启动 Redis

### 方式1：使用 Docker（推荐）
```bash
docker run -d -p 6379:6379 --name redis-comparator redis:latest
```

### 方式2：Windows 本地安装
1. 下载 Redis for Windows: https://github.com/tporadowski/redis/releases
2. 解压后运行 `redis-server.exe`

### 方式3：Linux
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

## 第二步：启动后端

```bash
# 进入后端目录
cd backend

# 使用 Maven 启动
mvn spring-boot:run

# 或者先打包再运行
mvn clean package
java -jar target/fixed-text-comparator-1.0.0.jar
```

后端启动成功后会显示：
```
Started ComparatorApplication in X.XXX seconds
```

访问 http://localhost:8080 验证后端是否启动成功

## 第三步：启动前端

打开新的终端窗口：

```bash
# 进入前端目录
cd frontend

# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev
```

前端启动成功后会显示：
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

## 第四步：测试对比功能

1. 打开浏览器访问 http://localhost:3000

2. **选择配置**：
   - 点击"新建配置"创建配置
   - 或使用默认的 "default" 配置

3. **上传文件**：
   - 拖拽上传 `test-data/file1.txt` 和 `test-data/file2.txt`
   - 或直接复制文件内容粘贴到文本框

4. **开始对比**：
   - 点击"开始对比"按钮
   - 查看右侧的对比结果

## 常见问题

### 1. 后端启动失败：连接 Redis 失败
**解决方案**：
- 确保 Redis 已启动
- 检查 `backend/src/main/resources/application.yml` 中的 Redis 配置
- 测试 Redis 连接：`redis-cli ping`（应返回 PONG）

### 2. 前端启动失败：npm install 报错
**解决方案**：
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 3. 对比时提示"配置文件不存在"
**解决方案**：
- 确保 `backend/src/main/resources/configs/` 目录下有 `.ini` 文件
- 或通过前端"新建配置"创建新配置

### 4. 文件上传后解析错误
**解决方案**：
- 检查文本文件每行长度是否一致
- 检查 INI 配置中的字段起始位置和长度是否正确
- 确保字段位置不重叠

## 测试示例

使用提供的测试数据：

1. 选择配置："default" 或 "测试配置"
2. 上传 `test-data/file1.txt` 作为文件1
3. 上传 `test-data/file2.txt` 作为文件2
4. 点击"开始对比"

**预期结果**：
- 仅在文件1：2条记录（编号00004、00005）
- 仅在文件2：2条记录（编号00006、00007）
- 已修改：2条记录（编号00002的field2不同，编号00003的field4不同）
- 相同：1条记录（编号00001）

## 端口说明

- **后端**：8080
- **前端**：3000
- **Redis**：6379

如需修改端口，编辑：
- 后端：`backend/src/main/resources/application.yml`
- 前端：`frontend/vite.config.js`
