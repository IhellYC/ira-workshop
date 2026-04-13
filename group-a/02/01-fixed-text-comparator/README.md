# 定长文本文件对比工具

基于 Vue 3 + Spring Boot + Redis 的定长文本文件对比工具，支持通过 INI 配置文件定义字段规则，根据配置的 Key 键对比两个定长文本文件的差异。

## 功能特性

- ✅ **INI 配置管理**：通过 INI 文件定义字段规则（起始位置、长度、类型）
- ✅ **Key 键配置**：支持配置多个字段作为唯一标识
- ✅ **定长文本解析**：自动解析定长文本，支持字符串和数字类型
- ✅ **数字字段处理**：自动去掉小数点，左侧补0
- ✅ **文件对比**：基于 Key 键对比两个文件的差异
- ✅ **差异展示**：清晰展示仅在文件1、仅在文件2、已修改、相同的记录
- ✅ **Redis 缓存**：配置和对比结果缓存在 Redis 中，提高性能

## 技术栈

### 后端
- **框架**：Spring Boot 3.2.0
- **语言**：Java 17
- **缓存**：Redis
- **INI 解析**：ini4j 0.5.4
- **工具**：Lombok

### 前端
- **框架**：Vue 3
- **构建工具**：Vite 5
- **UI 组件库**：Element Plus
- **HTTP 客户端**：Axios

## 项目结构

```
05-fixed-text-comparator/
├── backend/                    # 后端 Spring Boot 项目
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/comparator/
│       │   ├── ComparatorApplication.java
│       │   ├── config/         # 配置类
│       │   ├── controller/     # 控制器
│       │   ├── service/        # 服务层
│       │   ├── model/          # 数据模型
│       │   └── util/           # 工具类
│       └── resources/
│           ├── application.yml
│           └── configs/        # INI 配置文件
├── frontend/                   # 前端 Vue 项目
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── api/                # API 客户端
│       └── components/         # Vue 组件
├── test-data/                  # 测试数据
│   ├── file1.txt
│   ├── file2.txt
│   └── config.ini
└── README.md
```

## 快速开始

### 前置要求

- Java 17+
- Maven 3.6+
- Node.js 16+
- Redis 6+

### 后端启动

1. **配置 Redis**
   
   编辑 `backend/src/main/resources/application.yml`，确保 Redis 配置正确：
   ```yaml
   spring:
     redis:
       host: localhost
       port: 6379
   ```

2. **启动 Redis**
   ```bash
   # Windows（需要先安装 Redis）
   redis-server
   
   # Linux
   sudo systemctl start redis
   
   # Docker
   docker run -d -p 6379:6379 redis:latest
   ```

3. **启动后端**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   
   后端将在 http://localhost:8080 启动

### 前端启动

1. **安装依赖**
   ```bash
   cd frontend
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```
   
   前端将在 http://localhost:3000 启动

### 测试

1. 打开浏览器访问 http://localhost:3000
2. 选择或创建一个配置
3. 上传或粘贴两个定长文本文件
4. 点击"开始对比"查看结果

## INI 配置文件格式

```ini
[general]
name = 配置名称
description = 配置描述

[key_fields]
# 定义作为唯一标识的字段（支持多个，用逗号分隔）
fields = field1,field3

[fields]
# 格式: 字段名 = 起始位置(0-based),长度,类型(string|number)
field1 = 0,10,string
field2 = 10,8,number
field3 = 18,15,string
field4 = 33,12,number
```

### 字段类型说明

- **string**：字符串类型，解析时自动去除右侧空格
- **number**：数字类型，解析时自动去除小数点和左侧的0

## API 接口

### 配置管理

- `GET /api/configs` - 获取配置列表
- `GET /api/configs/{name}` - 获取指定配置
- `POST /api/configs` - 保存配置
- `DELETE /api/configs/{name}` - 删除配置

### 文件对比

- `POST /api/compare` - 对比两个文件
  ```json
  {
    "configName": "配置名称",
    "file1Content": "文件1内容",
    "file2Content": "文件2内容"
  }
  ```

- `GET /api/compare/result/{cacheKey}` - 获取缓存的对比结果

## 对比结果

对比结果包含以下信息：

- **仅在文件1**：只存在于文件1中的记录
- **仅在文件2**：只存在于文件2中的记录
- **已修改**：Key 相同但内容有差异的记录，会标注具体哪些字段不同
- **相同**：完全相同的记录数量

## 测试数据

项目提供了测试数据在 `test-data/` 目录下：

- `file1.txt` 和 `file2.txt`：两个示例定长文本文件
- `config.ini`：对应的配置文件

### 测试数据说明

测试数据包含以下字段：
- `field1`（0-10）：编号（字符串）
- `field2`（10-18）：金额（数字）
- `field3`（18-33）：姓名（字符串）
- `field4`（33-45）：数量（数字）

Key 键配置为：`field1` + `field3`（编号 + 姓名）

## 开发说明

### 后端开发

```bash
# 编译
mvn clean compile

# 打包
mvn clean package

# 运行测试
mvn test
```

### 前端开发

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 注意事项

1. **Redis 必须启动**：后端依赖 Redis 存储配置和对比结果
2. **字段位置不重叠**：INI 配置中的字段起始位置和长度不能重叠
3. **行长度一致**：定长文本文件的每行长度应该一致
4. **编码格式**：文本文件建议使用 UTF-8 编码

## 许可证

MIT License
