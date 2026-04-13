# 定长文本文件对比工具 - 系统架构图

## 系统架构总览

```mermaid
graph TB
    subgraph "前端层 (Vue 3 + Element Plus)"
        A[用户界面] --> B[ConfigEditor 配置编辑器]
        A --> C[FileUploader 文件上传]
        A --> D[ComparisonView 对比结果]
        B --> E[API Client Axios]
        C --> E
        D --> E
    end
    
    subgraph "后端层 (Spring Boot)"
        E --> F[API Gateway]
        F --> G[ConfigController 配置管理]
        F --> H[CompareController 文件对比]
        
        G --> I[ConfigService 配置服务]
        H --> J[CompareService 对比服务]
        
        I --> K[IniParser INI解析器]
        J --> L[FixedTextParser 文本解析器]
    end
    
    subgraph "数据存储层"
        I --> M[(Redis 缓存)]
        J --> M
        K --> N[INI 配置文件]
        M --> N
    end
    
    subgraph "外部资源"
        N -.-> O[configs/default.ini]
        N -.-> P[configs/*.ini]
    end
```

## 详细架构分层

```mermaid
graph LR
    subgraph "表现层 Presentation"
        A1[Vue 3 组件]
        A2[Element Plus UI]
        A3[响应式布局]
    end
    
    subgraph "接口层 Interface"
        B1[Axios HTTP客户端]
        B2[RESTful API]
        B3[CORS 跨域配置]
    end
    
    subgraph "业务层 Business"
        C1[配置管理服务]
        C2[文件对比服务]
        C3[文本解析引擎]
    end
    
    subgraph "数据层 Data"
        D1[Redis 缓存]
        D2[INI 配置文件]
        D3[内存数据模型]
    end
    
    A1 --> B1
    A2 --> B1
    A3 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> C1
    B3 --> C2
    C1 --> C3
    C2 --> C3
    C1 --> D1
    C2 --> D1
    C3 --> D2
    D1 --> D3
```

## 数据流架构

```mermaid
sequenceDiagram
    participant U as 用户
    participant F as 前端 Vue
    participant A as API Client
    participant C as Controller
    participant S as Service
    participant R as Redis
    participant P as Parser
    participant FI as 文件系统
    
    U->>F: 1. 选择配置文件
    F->>A: 2. GET /api/configs
    A->>C: 3. 请求配置列表
    C->>R: 4. 查询缓存
    R-->>C: 5. 返回配置名列表
    C-->>A: 6. 返回配置列表
    A-->>F: 7. 显示配置选项
    
    U->>F: 8. 上传两个文件
    F->>A: 9. POST /api/compare
    A->>C: 10. 发送对比请求
    C->>S: 11. 调用对比服务
    S->>R: 12. 获取配置缓存
    R-->>S: 13. 返回配置
    S->>P: 14. 解析文件1
    S->>P: 15. 解析文件2
    P->>S: 16. 返回解析结果
    S->>S: 17. 执行对比逻辑
    S->>R: 18. 缓存对比结果
    R-->>S: 19. 返回缓存Key
    S-->>C: 20. 返回对比结果
    C-->>A: 21. 返回JSON
    A-->>F: 22. 更新UI
    F->>U: 23. 展示差异
```

## 技术栈架构

```mermaid
graph TB
    subgraph "前端技术栈"
        F1[Vue 3.4] --> F2[Composition API]
        F3[Element Plus 2.5] --> F4[UI组件库]
        F5[Vite 5.0] --> F6[构建工具]
        F7[Axios 1.6] --> F8[HTTP客户端]
    end
    
    subgraph "后端技术栈"
        B1[Spring Boot 3.2] --> B2[Web框架]
        B3[Java 17] --> B4[编程语言]
        B5[Spring Data Redis] --> B6[Redis客户端]
        B7[ini4j 0.5.4] --> B8[INI解析]
        B9[Lombok] --> B10[代码简化]
    end
    
    subgraph "基础设施"
        I1[Redis 6+] --> I2[缓存服务]
        I3[Maven 3.6+] --> I4[依赖管理]
        I5[Node.js 16+] --> I6[前端运行环境]
    end
```

## 模块依赖关系

```mermaid
graph LR
    subgraph "前端模块"
        F1[App.vue] --> F2[ConfigEditor.vue]
        F1 --> F3[FileUploader.vue]
        F1 --> F4[ComparisonView.vue]
        F2 --> F5[api/client.js]
        F3 --> F5
        F4 --> F5
    end
    
    subgraph "后端模块"
        B1[ComparatorApplication] --> B2[Config]
        B1 --> B3[Controller]
        B1 --> B4[Service]
        B1 --> B5[Model]
        B1 --> B6[Util]
        
        B3 --> B4
        B4 --> B5
        B4 --> B6
        B6 --> B7[ini4j]
    end
    
    F5 -.HTTP.-> B3
```

## 缓存策略架构

```mermaid
graph TB
    subgraph "缓存层"
        A[Redis Cache]
        A --> B[config:names<br/>配置列表 Set]
        A --> C[config:{name}<br/>配置详情 JSON<br/>TTL: 24h]
        A --> D[compare:{uuid}<br/>对比结果 JSON<br/>TTL: 30min]
    end
    
    subgraph "缓存策略"
        E[读取配置] --> F{缓存命中?}
        F -->|是| G[直接返回]
        F -->|否| H[从文件读取]
        H --> I[写入缓存]
        I --> G
        
        J[保存配置] --> K[更新文件]
        K --> L[更新缓存]
        L --> M[清除列表缓存]
    end
```

## 核心处理流程

```mermaid
flowchart TD
    A[用户上传文件] --> B[选择配置文件]
    B --> C[解析INI配置]
    C --> D{配置缓存?}
    D -->|否| E[读取INI文件]
    D -->|是| F[从Redis读取]
    E --> F
    
    F --> G[解析文件1内容]
    F --> H[解析文件2内容]
    
    G --> I[按字段定义提取]
    H --> I
    
    I --> J[构建Key映射]
    J --> K[执行对比算法]
    
    K --> L{记录状态}
    L -->|仅在文件1| M[标记为新增]
    L -->|仅在文件2| N[标记为删除]
    L -->|两边都有| O{内容相同?}
    O -->|是| P[标记为相同]
    O -->|否| Q[标记为修改]
    
    M --> R[生成对比结果]
    N --> R
    P --> R
    Q --> R
    
    R --> S[缓存到Redis]
    S --> T[返回前端展示]
```

## 部署架构

```mermaid
graph TB
    subgraph "开发环境"
        A1[前端开发服务器<br/>Vite :3000]
        A2[后端开发服务器<br/>Spring Boot :8080]
        A3[Redis 本地<br/>:6379]
    end
    
    subgraph "生产环境 (可选)"
        B1[Nginx<br/>静态资源]
        B2[Spring Boot<br/>打包JAR]
        B3[Redis 服务器]
    end
    
    A1 -.代理.-> A2
    A2 -.连接.-> A3
    
    B1 -.反向代理.-> B2
    B2 -.连接.-> B3
```

## 数据模型关系

```mermaid
erDiagram
    CompareConfig ||--o{ FieldDefinition : contains
    CompareConfig ||--o{ String : keyFields
    CompareResult ||--o{ Map : onlyInFile1
    CompareResult ||--o{ Map : onlyInFile2
    CompareResult ||--o{ ModifiedRecord : modified
    ModifiedRecord ||--o{ String : diffFields
    
    CompareConfig {
        String name PK
        String description
        List keyFields
        List fields
    }
    
    FieldDefinition {
        String name
        Integer start
        Integer length
        String type
    }
    
    CompareResult {
        String cacheKey
        Integer identicalCount
    }
    
    ModifiedRecord {
        String key
        Map file1
        Map file2
        List diffFields
    }
```

## API 接口架构

```mermaid
graph LR
    subgraph "配置管理 API"
        A1[GET /api/configs] --> A2[获取配置列表]
        A3[GET /api/configs/:name] --> A4[获取配置详情]
        A5[POST /api/configs] --> A6[保存配置]
        A7[DELETE /api/configs/:name] --> A8[删除配置]
    end
    
    subgraph "对比服务 API"
        B1[POST /api/compare] --> B2[执行文件对比]
        B3[GET /api/compare/result/:key] --> B4[获取缓存结果]
    end
    
    subgraph "响应格式"
        C1[JSON Response]
        C2[HTTP Status]
        C3[Error Handling]
    end
    
    A2 --> C1
    A4 --> C1
    A6 --> C1
    A8 --> C1
    B2 --> C1
    B4 --> C1
```
