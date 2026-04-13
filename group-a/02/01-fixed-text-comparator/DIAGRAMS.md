# 定长文本文件对比工具 - 完整架构图

## 📁 一、项目代码结构图

### 1.1 完整目录树状图

```mermaid
graph TB
    ROOT[05-fixed-text-comparator] --> BACKEND[backend/]
    ROOT --> FRONTEND[frontend/]
    ROOT --> TESTDATA[test-data/]
    ROOT --> DOCS[文档/]
    
    BACKEND --> B1[pom.xml]
    BACKEND --> B2[src/main/java/]
    BACKEND --> B3[src/main/resources/]
    
    B2 --> B2A[com/comparator/]
    B2A --> B2A1[ComparatorApplication.java]
    B2A --> B2A2[config/]
    B2A --> B2A3[controller/]
    B2A --> B2A4[service/]
    B2A --> B2A5[model/]
    B2A --> B2A6[util/]
    
    B2A2 --> B2A2A[RedisConfig.java]
    B2A2 --> B2A2B[CorsConfig.java]
    
    B2A3 --> B2A3A[ConfigController.java]
    B2A3 --> B2A3B[CompareController.java]
    
    B2A4 --> B2A4A[ConfigService.java]
    B2A4 --> B2A4B[CompareService.java]
    
    B2A5 --> B2A5A[FieldDefinition.java]
    B2A5 --> B2A5B[CompareConfig.java]
    B2A5 --> B2A5C[CompareResult.java]
    B2A5 --> B2A5D[CompareRequest.java]
    
    B2A6 --> B2A6A[IniParser.java]
    B2A6 --> B2A6B[FixedTextParser.java]
    
    B3 --> B3A[application.yml]
    B3 --> B3B[configs/default.ini]
    
    FRONTEND --> F1[package.json]
    FRONTEND --> F2[vite.config.js]
    FRONTEND --> F3[index.html]
    FRONTEND --> F4[src/]
    
    F4 --> F4A[main.js]
    F4 --> F4B[App.vue]
    F4 --> F4C[api/]
    F4 --> F4D[components/]
    
    F4C --> F4C1[client.js]
    
    F4D --> F4D1[ConfigEditor.vue]
    F4D --> F4D2[FileUploader.vue]
    F4D --> F4D3[ComparisonView.vue]
    
    TESTDATA --> T1[file1.txt]
    TESTDATA --> T2[file2.txt]
    TESTDATA --> T3[config.ini]
    
    DOCS --> D1[README.md]
    DOCS --> D2[QUICKSTART.md]
    DOCS --> D3[ARCHITECTURE.md]
    DOCS --> D4[.gitignore]
    
    style ROOT fill:#e1f5ff
    style BACKEND fill:#fff3e0
    style FRONTEND fill:#e8f5e9
    style TESTDATA fill:#fce4ec
    style DOCS fill:#f3e5f5
```

### 1.2 后端代码结构图

```mermaid
graph LR
    subgraph "📦 后端包结构"
        direction TB
        
        ROOT[com.comparator]
        
        ROOT --> APP[ComparatorApplication.java<br/>Spring Boot 主程序]
        ROOT --> CFG[config 配置层]
        ROOT --> CTRL[controller 控制层]
        ROOT --> SVC[service 服务层]
        ROOT --> MDL[model 模型层]
        ROOT --> UTL[util 工具层]
        
        CFG --> CFG1[RedisConfig.java<br/>Redis配置]
        CFG --> CFG2[CorsConfig.java<br/>跨域配置]
        
        CTRL --> CTRL1[ConfigController.java<br/>配置管理API]
        CTRL --> CTRL2[CompareController.java<br/>对比服务API]
        
        SVC --> SVC1[ConfigService.java<br/>配置管理服务]
        SVC --> SVC2[CompareService.java<br/>文件对比服务]
        
        MDL --> MDL1[FieldDefinition.java<br/>字段定义]
        MDL --> MDL2[CompareConfig.java<br/>对比配置]
        MDL --> MDL3[CompareResult.java<br/>对比结果]
        MDL --> MDL4[CompareRequest.java<br/>对比请求]
        
        UTL --> UTL1[IniParser.java<br/>INI文件解析]
        UTL --> UTL2[FixedTextParser.java<br/>定长文本解析]
    end
    
    style ROOT fill:#ff9800,color:#fff
    style APP fill:#2196f3,color:#fff
    style CFG fill:#4caf50,color:#fff
    style CTRL fill:#f44336,color:#fff
    style SVC fill:#9c27b0,color:#fff
    style MDL fill:#00bcd4,color:#fff
    style UTL fill:#ff5722,color:#fff
```

### 1.3 前端代码结构图

```mermaid
graph LR
    subgraph "🎨 前端组件结构"
        direction TB
        
        ROOT[frontend/src/]
        
        ROOT --> MAIN[main.js<br/>Vue应用入口]
        ROOT --> APP[App.vue<br/>主应用组件]
        ROOT --> API[api/]
        ROOT --> CMP[components/]
        
        API --> API1[client.js<br/>Axios API客户端]
        
        CMP --> CMP1[ConfigEditor.vue<br/>配置编辑器]
        CMP --> CMP2[FileUploader.vue<br/>文件上传器]
        CMP --> CMP3[ComparisonView.vue<br/>对比结果视图]
        
        CMP1 --> CMP1A[配置选择]
        CMP1 --> CMP1B[配置详情]
        CMP1 --> CMP1C[新建配置对话框]
        
        CMP2 --> CMP2A[文件1上传]
        CMP2 --> CMP2B[文件2上传]
        CMP2 --> CMP2C[文件预览]
        
        CMP3 --> CMP3A[统计卡片]
        CMP3 --> CMP3B[差异表格]
        CMP3 --> CMP3C[筛选标签]
    end
    
    style ROOT fill:#e91e63,color:#fff
    style MAIN fill:#3f51b5,color:#fff
    style APP fill:#009688,color:#fff
    style API fill:#ff9800,color:#fff
    style CMP fill:#4caf50,color:#fff
```

---

## 🏗️ 二、系统架构图

### 2.1 三层架构图

```mermaid
graph TB
    subgraph "🖥️ 表现层 Presentation Layer"
        direction LR
        VUE[Vue 3 应用] --> COMP1[ConfigEditor]
        VUE --> COMP2[FileUploader]
        VUE --> COMP3[ComparisonView]
        COMP1 --> UI[Element Plus UI]
        COMP2 --> UI
        COMP3 --> UI
    end
    
    subgraph "⚙️ 业务层 Business Layer"
        direction LR
        API[Spring Boot REST API] --> CTRL1[ConfigController]
        API --> CTRL2[CompareController]
        CTRL1 --> SVC1[ConfigService]
        CTRL2 --> SVC2[CompareService]
        SVC1 --> UTL1[IniParser]
        SVC2 --> UTL2[FixedTextParser]
    end
    
    subgraph "💾 数据层 Data Layer"
        direction LR
        REDIS[(Redis Cache)] --> CACHE1[配置缓存<br/>24h TTL]
        REDIS --> CACHE2[结果缓存<br/>30min TTL]
        REDIS --> CACHE3[配置列表<br/>Set结构]
        FILES[INI 配置文件] --> FILE1[default.ini]
        FILES --> FILE2[*.ini]
    end
    
    VUE -.HTTP/REST.-> API
    SVC1 -.读写.-> REDIS
    SVC2 -.读写.-> REDIS
    UTL1 -.读取.-> FILES
    
    style 表现层 fill:#e3f2fd
    style 业务层 fill:#fff3e0
    style 数据层 fill:#e8f5e9
```

### 2.2 技术栈架构图

```mermaid
graph TB
    subgraph "🎨 前端技术栈 Frontend Stack"
        F1[Vue 3.4<br/>渐进式框架] --> F2[Composition API<br/>组合式API]
        F3[Element Plus 2.5<br/>UI组件库] --> F4[表格/表单/对话框]
        F5[Vite 5.0<br/>构建工具] --> F6[热更新/快速启动]
        F7[Axios 1.6<br/>HTTP客户端] --> F8[API请求封装]
    end
    
    subgraph "🔧 后端技术栈 Backend Stack"
        B1[Spring Boot 3.2<br/>应用框架] --> B2[自动配置/内嵌服务器]
        B3[Java 17<br/>编程语言] --> B4[记录类/密封类]
        B5[Spring Data Redis<br/>Redis集成] --> B6[RedisTemplate]
        B7[ini4j 0.5.4<br/>INI解析库] --> B8[配置文件读写]
        B9[Lombok<br/>代码简化] --> B10[@Data/@Slf4j]
    end
    
    subgraph "🗄️ 基础设施 Infrastructure"
        I1[Redis 6+<br/>缓存数据库] --> I2[高性能KV存储]
        I3[Maven 3.6+<br/>构建工具] --> I4[依赖管理/打包]
        I5[Node.js 16+<br/>运行环境] --> I6[npm包管理]
    end
    
    F7 -.HTTP.-> B1
    B5 -.TCP.-> I1
    F5 -.依赖.-> I5
    B1 -.依赖.-> I3
    
    style F1 fill:#42b883,color:#fff
    style B1 fill:#6db33f,color:#fff
    style I1 fill:#dc382d,color:#fff
```

### 2.3 部署架构图

```mermaid
graph TB
    subgraph "💻 开发环境 Development"
        D1[浏览器<br/>Chrome/Edge] --> D2[Vite Dev Server<br/>localhost:3000]
        D2 -.代理.-> D3[Spring Boot<br/>localhost:8080]
        D3 -.连接.-> D4[Redis<br/>localhost:6379]
        D5[INI文件<br/>本地目录] -.读取.-> D3
    end
    
    subgraph "🚀 生产环境 Production (可选)"
        P1[用户浏览器] --> P2[Nginx<br/>静态资源服务]
        P2 -.反向代理.-> P3[Spring Boot JAR<br/>内嵌Tomcat]
        P3 -.连接池.-> P4[Redis Cluster<br/>高可用集群]
        P5[配置文件中心<br/>Nacos/Apollo] -.配置.-> P3
    end
    
    style 开发环境 fill:#e3f2fd
    style 生产环境 fill:#fff3e0
```

---

## 🔄 三、数据流图

### 3.1 完整业务流程图

```mermaid
sequenceDiagram
    participant User as 👤 用户
    participant FE as 🖥️ 前端 Vue
    participant API as 📡 API Client
    participant Ctrl as 🎯 Controller
    participant Svc as ⚙️ Service
    participant Redis as 💾 Redis
    participant Parser as 🔧 Parser
    participant File as 📄 文件系统
    
    Note over User,File: 阶段1: 配置加载
    User->>FE: 1. 打开页面
    FE->>API: 2. GET /api/configs
    API->>Ctrl: 3. 请求配置列表
    Ctrl->>Svc: 4. listConfigs()
    Svc->>Redis: 5. GET config:names
    alt 缓存命中
        Redis-->>Svc: 6a. 返回缓存数据
    else 缓存未命中
        Svc->>File: 6b. 扫描configs目录
        File-->>Svc: 7b. 返回.ini文件列表
        Svc->>Redis: 8b. SET config:names
    end
    Svc-->>Ctrl: 9. 返回配置列表
    Ctrl-->>API: 10. JSON响应
    API-->>FE: 11. 显示配置选项
    
    Note over User,File: 阶段2: 文件上传与对比
    User->>FE: 12. 选择配置+上传文件
    FE->>API: 13. POST /api/compare
    API->>Ctrl: 14. 对比请求
    Ctrl->>Svc: 15. compare()
    Svc->>Redis: 16. GET config:{name}
    Redis-->>Svc: 17. 返回配置
    Svc->>Parser: 18. parseText(file1)
    Parser-->>Svc: 19. 记录列表1
    Svc->>Parser: 20. parseText(file2)
    Parser-->>Svc: 21. 记录列表2
    Svc->>Svc: 22. 执行对比算法
    Svc->>Redis: 23. SET compare:{uuid}<br/>TTL=30min
    Redis-->>Svc: 24. 返回cacheKey
    Svc-->>Ctrl: 25. CompareResult
    Ctrl-->>API: 26. JSON响应
    API-->>FE: 27. 更新UI
    FE->>User: 28. 展示对比结果
```

### 3.2 对比算法流程图

```mermaid
flowchart TD
    A[开始对比] --> B[加载配置]
    B --> C[解析文件1]
    B --> D[解析文件2]
    
    C --> E[提取字段值]
    D --> F[提取字段值]
    
    E --> G[构建Key映射Map1]
    F --> H[构建Key映射Map2]
    
    G --> I[合并所有Key]
    H --> I
    
    I --> J{遍历每个Key}
    
    J --> K{Key在Map1?}
    K -->|否| L{Key在Map2?}
    L -->|是| M[添加到仅在文件2]
    L -->|否| N[错误:不应发生]
    
    K -->|是| O{Key在Map2?}
    O -->|否| P[添加到仅在文件1]
    O -->|是| Q{记录内容相同?}
    
    Q -->|是| R[相同计数+1]
    Q -->|否| S[找出差异字段]
    S --> T[添加到已修改列表]
    
    M --> U{还有Key?}
    P --> U
    R --> U
    T --> U
    
    U -->|是| J
    U -->|否| V[生成对比结果]
    
    V --> W[缓存到Redis]
    W --> X[返回前端]
    X --> Y[结束]
    
    style A fill:#4caf50,color:#fff
    style Y fill:#f44336,color:#fff
    style V fill:#2196f3,color:#fff
```

---

## 📊 四、组件交互图

### 4.1 前端组件交互图

```mermaid
graph TB
    subgraph "🎭 前端组件交互"
        APP[App.vue<br/>根组件]
        
        APP --> CE[ConfigEditor.vue<br/>配置编辑器]
        APP --> FU[FileUploader.vue<br/>文件上传器]
        APP --> CV[ComparisonView.vue<br/>对比结果]
        
        CE --> API[api/client.js<br/>API客户端]
        FU --> API
        CV -.读取.-> API
        
        CE -->|@config-selected| APP
        FU -->|@compare| APP
        APP -->|:config| FU
        APP -->|:result| CV
        APP -->|:config| CV
        
        API -.axios.-> BACKEND[后端API]
    end
    
    style APP fill:#e91e63,color:#fff
    style CE fill:#9c27b0,color:#fff
    style FU fill:#673ab7,color:#fff
    style CV fill:#3f51b5,color:#fff
    style API fill:#ff9800,color:#fff
```

### 4.2 后端类交互图

```mermaid
graph TB
    subgraph "🏛️ 后端类交互关系"
        CC[ConfigController] -.使用.-> CS[ConfigService]
        CM[CompareController] -.使用.-> CMS[CompareService]
        
        CS -.使用.-> IP[IniParser]
        CMS -.使用.-> FP[FixedTextParser]
        CMS -.使用.-> CS
        
        CS -.读写.-> RT[RedisTemplate]
        CMS -.读写.-> RT
        
        IP -.读写.-> INI[INI文件]
        FP -.处理.-> TXT[文本内容]
        
        CS -.返回.-> CFG[CompareConfig]
        CMS -.返回.-> RES[CompareResult]
        
        CFG -.包含.-> FD[FieldDefinition]
        RES -.包含.-> MR[ModifiedRecord]
    end
    
    style CC fill:#f44336,color:#fff
    style CM fill:#f44336,color:#fff
    style CS fill:#9c27b0,color:#fff
    style CMS fill:#9c27b0,color:#fff
    style IP fill:#ff9800,color:#fff
    style FP fill:#ff9800,color:#fff
    style RT fill:#4caf50,color:#fff
```

---

## 💾 五、数据模型图

### 5.1 实体关系图 (ER Diagram)

```mermaid
erDiagram
    COMPARE_CONFIG ||--o{ FIELD_DEFINITION : 包含
    COMPARE_CONFIG ||--o{ KEY_FIELD : 包含
    COMPARE_RESULT ||--o{ MODIFIED_RECORD : 包含
    COMPARE_RESULT ||--o{ RECORD : 仅文件1
    COMPARE_RESULT ||--o{ RECORD : 仅文件2
    
    COMPARE_CONFIG {
        String name PK "配置名称"
        String description "配置描述"
        List keyFields "Key字段列表"
        List fields "字段定义列表"
    }
    
    FIELD_DEFINITION {
        String name "字段名称"
        Integer start "起始位置"
        Integer length "字段长度"
        String type "类型string/number"
    }
    
    KEY_FIELD {
        String fieldName "字段名"
        Integer order "顺序"
    }
    
    COMPARE_RESULT {
        String cacheKey PK "缓存Key"
        Integer identicalCount "相同记录数"
        Integer onlyInFile1Count "仅文件1数量"
        Integer onlyInFile2Count "仅文件2数量"
        Integer modifiedCount "修改数量"
    }
    
    MODIFIED_RECORD {
        String key PK "组合Key值"
        Map file1 "文件1记录"
        Map file2 "文件2记录"
        List diffFields "差异字段列表"
    }
    
    RECORD {
        Map fields "字段值映射"
        String source "来源文件"
    }
```

### 5.2 Redis 数据结构图

```mermaid
graph LR
    subgraph "🗄️ Redis 缓存结构"
        direction TB
        
        REDIS[(Redis Server)]
        
        REDIS --> SET1[config:names<br/>SET类型<br/>配置名称集合]
        REDIS --> HASH1[config:{name}<br/>JSON序列化<br/>TTL: 24小时]
        REDIS --> HASH2[compare:{uuid}<br/>JSON序列化<br/>TTL: 30分钟]
        
        SET1 --> S1[default]
        SET1 --> S2[测试配置]
        SET1 --> S3[...]
        
        HASH1 --> H1{name: "default"<br/>keyFields: [...]<br/>fields: [...]}
        
        HASH2 --> H2{cacheKey: "uuid"<br/>onlyInFile1: [...]<br/>onlyInFile2: [...]<br/>modified: [...]<br/>identicalCount: 0}
    end
    
    style REDIS fill:#dc382d,color:#fff
    style SET1 fill:#ff9800,color:#fff
    style HASH1 fill:#4caf50,color:#fff
    style HASH2 fill:#2196f3,color:#fff
```

---

## 🔌 六、API 接口图

### 6.1 RESTful API 架构图

```mermaid
graph TB
    subgraph "📡 API 接口层"
        CLIENT[客户端请求] --> ROUTE[路由分发]
        
        ROUTE --> CFG_API[配置管理 API]
        ROUTE --> CMP_API[对比服务 API]
        
        CFG_API --> CFG1[GET /api/configs<br/>获取配置列表]
        CFG_API --> CFG2[GET /api/configs/:name<br/>获取配置详情]
        CFG_API --> CFG3[POST /api/configs<br/>保存配置]
        CFG_API --> CFG4[DELETE /api/configs/:name<br/>删除配置]
        
        CMP_API --> CMP1[POST /api/compare<br/>执行文件对比]
        CMP_API --> CMP2[GET /api/compare/result/:key<br/>获取缓存结果]
    end
    
    subgraph "📦 响应格式"
        CFG1 --> RESP1[{name1, name2, ...}]
        CFG2 --> RESP2[{name, description,<br/>keyFields, fields}]
        CFG3 --> RESP3[{status, message}]
        CFG4 --> RESP4[{status, message}]
        CMP1 --> RESP5[{cacheKey, onlyInFile1,<br/>onlyInFile2, modified,<br/>identicalCount}]
        CMP2 --> RESP6[CompareResult对象]
    end
    
    style 响应格式 fill:#e8f5e9
    style API接口层 fill:#e3f2fd
```

### 6.2 API 调用时序图

```mermaid
sequenceDiagram
    participant C as Client
    participant G as Gateway
    participant Ctrl as Controller
    participant Svc as Service
    participant DB as Database
    
    Note over C,DB: 配置管理流程
    C->>G: GET /api/configs
    G->>Ctrl: 路由到ConfigController
    Ctrl->>Svc: listConfigs()
    Svc->>DB: 读取缓存/文件
    DB-->>Svc: 配置列表
    Svc-->>Ctrl: List<String>
    Ctrl-->>G: ResponseEntity
    G-->>C: 200 OK [JSON]
    
    Note over C,DB: 文件对比流程
    C->>G: POST /api/compare
    G->>Ctrl: 路由到CompareController
    Ctrl->>Svc: compare(request)
    Svc->>DB: 加载配置
    DB-->>Svc: CompareConfig
    Svc->>Svc: 解析文件
    Svc->>Svc: 执行对比
    Svc->>DB: 缓存结果
    DB-->>Svc: cacheKey
    Svc-->>Ctrl: CompareResult
    Ctrl-->>G: ResponseEntity
    G-->>C: 200 OK [JSON]
```

---

## 🎯 七、核心处理流程图

### 7.1 INI 配置文件解析流程

```mermaid
flowchart LR
    A[读取INI文件] --> B[ini4j解析]
    B --> C{解析Section}
    
    C --> D[general]
    C --> E[key_fields]
    C --> F[fields]
    
    D --> D1[name]
    D --> D2[description]
    
    E --> E1[fields字符串]
    E1 --> E2[split分割]
    E2 --> E3[List<String>]
    
    F --> F1[遍历字段]
    F1 --> F2[解析: start,length,type]
    F2 --> F3[FieldDefinition对象]
    F3 --> F4[List<FieldDefinition>]
    
    D1 --> G[CompareConfig对象]
    D2 --> G
    E3 --> G
    F4 --> G
    
    style A fill:#4caf50,color:#fff
    style G fill:#2196f3,color:#fff
```

### 7.2 定长文本解析流程

```mermaid
flowchart TD
    A[输入文本行] --> B[遍历字段定义]
    B --> C[根据start和length<br/>截取子串]
    C --> D{字段类型?}
    
    D -->|string| E[stripTrailing<br/>去除右侧空格]
    D -->|number| F[trim去空格]
    
    F --> G[replace.<br/>去掉小数点]
    G --> H[replaceAll ^0+<br/>去掉左侧0]
    H --> I{是否为空?}
    I -->|是| J[设为0]
    I -->|否| K[保持原值]
    
    E --> L[放入Map<br/>fieldName -> value]
    J --> L
    K --> L
    
    L --> M{还有字段?}
    M -->|是| B
    M -->|否| N[返回Map对象]
    
    style A fill:#ff9800,color:#fff
    style N fill:#4caf50,color:#fff
```

---

## 📈 八、性能优化架构图

```mermaid
graph TB
    subgraph "⚡ 缓存策略"
        L1[一级缓存: Redis] --> L1A[配置缓存 24h]
        L1 --> L1B[结果缓存 30min]
        L1 --> L1C[列表缓存 24h]
        
        L2[二级缓存: 内存] --> L2A[Service层缓存]
        L2 --> L2B[解析结果缓存]
        
        L3[文件系统] --> L3A[INI配置文件]
        L3 --> L3B[按需加载]
    end
    
    subgraph "🚀 性能优化点"
        P1[Redis序列化优化<br/>String + JSON] --> P2[减少网络传输]
        P3[批量解析<br/>一次读取多行] --> P4[减少IO操作]
        P5[Key索引<br/>HashMap映射] --> P6[O1查找复杂度]
        P7[懒加载<br/>按需加载配置] --> P8[减少内存占用]
    end
    
    L1 -.使用.-> P1
    L1 -.使用.-> P5
    L2 -.使用.-> P3
    L3 -.使用.-> P7
    
    style 缓存策略 fill:#e3f2fd
    style 性能优化点 fill:#fff3e0
```

---

## 📝 九、总结

本文档提供了定长文本文件对比工具的完整架构视图，包括：

1. **代码结构图**：清晰展示前后端代码组织
2. **系统架构图**：三层架构和技术栈全景
3. **数据流图**：完整的业务流程和算法流程
4. **组件交互图**：前后端组件间的协作关系
5. **数据模型图**：实体关系和Redis缓存结构
6. **API接口图**：RESTful API设计和调用流程
7. **核心处理流程**：INI解析和文本解析详解
8. **性能优化架构**：多级缓存和优化策略

所有图表均使用 Mermaid 语法编写，可在支持 Mermaid 的 Markdown 编辑器中查看渲染效果。
