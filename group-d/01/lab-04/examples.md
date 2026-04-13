# Scan to Report - 使用示例

## 示例 1: 扫描钉钉消息推送模块

### 用户输入

```
扫描 copaw/src/copaw/app/channels/dingtalk/ 目录，生成钉钉消息推送模块的技术报告
```

### Skill 执行流程

1. **扫描代码**
   - 列出 dingtalk/ 目录结构
   - 读取 channel.py、handler.py、ai_card.py 等核心文件
   - 统计代码行数和文件数量

2. **分析架构**
   - 识别 DingTalkChannel 核心类
   - 分析消息处理流程
   - 整理配置参数和常量

3. **生成报告**
   - 创建 copaw-dingtalk-report.html
   - 包含 10 个章节
   - 应用金融科技风格设计

### 生成的报告结构

```
copaw-dingtalk-report.html
├── Hero区域: "CoPaw 钉钉消息推送模块技术架构分析报告"
├── 统计概览: 8个文件、2,956行代码、3种推送方式
├── 10个章节:
│   ├── 1. 项目概述（技术栈、术语定义）
│   ├── 2. 系统架构（架构图、模块划分）
│   ├── 3. 核心模块（DingTalkChannel详解）
│   ├── 4. 数据流分析（入站/出站流程）
│   ├── 5. 功能特性（消息类型、企业级功能）
│   ├── 6. API参考（核心方法、常量）
│   ├── 7. 安全系统（认证、访问控制）
│   ├── 8. 配置管理（配置示例、环境变量）
│   ├── 9. 部署运维（监控指标、常见问题）
│   └── 10. 总结（优势、亮点、建议）
└── 页脚: 报告生成时间和数据来源
```

---

## 示例 2: 扫描飞书消息模块

### 用户输入

```
扫描 copaw/src/copaw/app/channels/feishu/ 生成飞书通道技术报告
```

### Skill 执行流程

1. **扫描代码**
   ```bash
   ls copaw/src/copaw/app/channels/feishu/
   # __init__.py  channel.py  handler.py  utils.py
   ```

2. **读取核心文件**
   - channel.py: FeishuChannel 类实现
   - handler.py: 飞书消息处理器
   - utils.py: 工具函数

3. **生成报告**
   - 文件: copaw-feishu-report.html
   - 主题: "CoPaw 飞书消息推送模块技术架构分析报告"

---

## 示例 3: 扫描自定义模块

### 用户输入

```
扫描 main-project/backend/app/blueprints/notify/ 目录，生成消息推送蓝图的技术报告
```

### Skill 执行流程

1. **扫描目录结构**
   ```
   notify/
   ├── __init__.py
   ├── routes.py
   ├── services.py
   └── models.py
   ```

2. **分析代码**
   - 提取 API 路由定义
   - 分析业务逻辑
   - 整理数据模型

3. **生成报告**
   - 文件: notify-blueprint-report.html
   - 包含 REST API 文档
   - 数据库模型说明

---

## 设计规范应用示例

### 颜色应用

```html
<!-- 品牌红 - 用于强调和警告 -->
<div class="info-card warning" style="border-left-color: #E72521;">
    <h4>⚠️ 注意事项</h4>
</div>

<!-- 企业蓝 - 用于主要信息 -->
<div class="info-card" style="border-left-color: #004098;">
    <h4>ℹ️ 提示信息</h4>
</div>

<!-- 深墨蓝 - 用于代码块背景 -->
<div class="code-block" style="background: #0B264A;">
    code here...
</div>
```

### 布局应用

```html
<!-- 页面边距 131.67px -->
<main class="main-content" style="padding: 60px 131.67px;">
    
    <!-- 章节间距 60px -->
    <section class="section" style="margin-bottom: 60px;">
        <h2 class="section-title">章节标题</h2>
        
        <!-- 模块间距 40px -->
        <div class="info-card" style="margin: 20px 0;">
            <!-- 内容内边距 24px -->
        </div>
    </section>
</main>
```

### 组件应用

```html
<!-- 统计卡片 -->
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-number">8</div>
        <div class="stat-label">核心模块文件</div>
    </div>
</div>

<!-- 文件列表 -->
<div class="file-list">
    <div class="file-item">
        <h5>📄 channel.py</h5>
        <p>核心通道类实现</p>
    </div>
</div>

<!-- 标签 -->
<span class="tag">PROCESSING</span>
<span class="tag red">FAILED</span>
<span class="tag green">FINISHED</span>
```

---

## 常见使用场景

### 场景 1: 新模块文档化

```
用户: 我刚完成了一个新的消息队列模块，帮我生成技术文档
Skill: 请提供模块路径
用户: modules/message-queue/
Skill: [扫描并生成报告]
```

### 场景 2: 代码审查辅助

```
用户: 帮我分析一下这个认证模块的实现
Skill: 请提供模块路径
用户: app/auth/
Skill: [扫描并生成报告，包含安全分析]
```

### 场景 3: 项目文档整理

```
用户: 把项目里的所有通道模块都生成技术报告
Skill: [扫描 channels/ 目录下的所有子目录]
```

---

## 输出文件命名规范

默认命名规则：
```
{项目名}-{模块名}-report.html
```

示例：
- `copaw-dingtalk-report.html`
- `copaw-feishu-report.html`
- `ira-notify-report.html`

---

## 质量检查清单

生成报告后，检查以下项目：

- [ ] 所有CSS变量正确使用
- [ ] 颜色符合品牌规范
- [ ] 字体大小和字重正确
- [ ] 间距符合规范
- [ ] 响应式布局正常
- [ ] 章节完整（10个章节）
- [ ] 代码块有语法高亮
- [ ] 表格有斑马纹效果
- [ ] 锚点链接可点击
- [ ] 页脚信息完整
