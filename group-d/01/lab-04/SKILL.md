---
name: scan-to-report
description: 扫描项目代码模块并生成符合金融科技风格的技术文档报告。基于《四组-技术文档规范.md》的设计规范，生成包含系统架构、核心模块、API参考、安全系统等章节的HTML报告。Use when用户需要分析代码模块并生成技术文档报告，或提到"扫描"、"生成报告"、"技术文档"等关键词。
---

# Scan to Report - 代码扫描报告生成

## 概述

本 Skill 用于扫描项目中的代码模块，分析其架构和实现，并生成符合金融科技风格的技术文档HTML报告。

### 设计规范来源

- **设计规范**: `/Users/jeccey/Project/ira/四组-技术文档规范.md`
- **示例报告**: `/Users/jeccey/Project/ira/copaw-dingtalk-report.html`
- **风格**: 现代金融科技风格（参考南方基金官网）

### 核心能力

1. 扫描代码模块结构和关键文件
2. 分析系统架构、数据流、核心功能
3. 生成符合规范的HTML技术报告
4. 支持自定义报告标题和章节

---

## 使用流程

### Step 1: 分析用户需求

确定以下信息：
- **扫描目标**: 需要扫描的代码目录或模块路径
- **报告主题**: 技术报告的主题名称
- **报告范围**: 需要包含的章节（默认全部）

### Step 2: 扫描代码模块

执行代码扫描，收集以下信息：

```
扫描清单:
- [ ] 模块目录结构
- [ ] 核心代码文件（主要类/函数）
- [ ] 配置文件和常量定义
- [ ] 依赖和接口定义
- [ ] 注释和文档字符串
```

### Step 3: 分析架构

基于扫描结果分析：
- 系统架构和模块划分
- 核心类和它们的关系
- 数据流和消息流转
- 关键功能实现

### Step 4: 生成报告

按照设计规范生成HTML报告，包含以下章节：

```
报告结构:
1. 项目概述（定位、技术栈、术语）
2. 系统架构（架构图、模块划分、类关系）
3. 核心模块（详细设计、代码示例）
4. 数据流分析（入站/出站流程）
5. 功能特性（消息类型、企业级功能）
6. API参考（核心方法、常量定义）
7. 安全系统（认证、访问控制、数据安全）
8. 配置管理（配置示例、环境变量）
9. 部署运维（前置条件、监控指标、常见问题）
10. 总结（核心优势、技术亮点、改进建议）
```

---

## 设计规范要求

### 颜色系统

必须使用以下品牌色：

```css
/* 品牌色 */
--color-brand-red: #E72521;     /* 主色 - 品牌红 */
--color-brand-blue: #004098;    /* 副色 - 企业蓝 */
--color-dark-blue: #0B264A;     /* 页脚背景色 */

/* 中性色 */
--color-white: #FFFFFF;
--color-dark-gray: #333333;
--color-text: #222222;
--color-gray: #888888;
--color-light-bg: #EFF4F9;
--color-light-blue: #E5F8FD;
```

### 字体规范

```css
/* 系统字体栈 */
--font-family: -apple-system, "system-ui", "Segoe UI", system-ui, 
               Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, 
               "PingFang SC", "Microsoft YaHei", 
               "Helvetica Neue", Helvetica, Arial;

/* 标题 */
H1: 36px | 500 | #FFFFFF (Hero区域)
H2: 28px | 500 | #333333 | 下边距15px | 底部边框2px solid #004098
H3: 20px | 500 | #333333

/* 正文 */
正文: 16px | 400 | #222222 | 行高1.8
小文本: 14px | 400 | #888888
```

### 间距规范

```css
/* 页面间距 */
--spacing-page: 131.67px;   /* 页面两侧边距 */
--spacing-lg: 60px;         /* 章节间距 */
--spacing-md: 40px;         /* 模块间距 */
--spacing-sm: 30px;         /* 元素间距 */
--spacing-xs: 20px;         /* 小间距 */
```

### 组件样式

#### 信息卡片

```css
.info-card {
    background: #EFF4F9;
    padding: 24px;
    margin: 20px 0;
    border-radius: 8px;
    border-left: 4px solid #004098;  /* 蓝色边框 */
}

.info-card.warning {
    border-left-color: #E72521;       /* 红色边框 */
    background: #FFF5F5;
}

.info-card.success {
    border-left-color: #10B981;       /* 绿色边框 */
    background: #F0FDF4;
}
```

#### 代码块

```css
.code-block {
    background: #0B264A;              /* 深墨蓝背景 */
    color: #FFFFFF;
    padding: 20px;
    border-radius: 8px;
    font-family: "Consolas", "Monaco", monospace;
    font-size: 14px;
    line-height: 1.6;
}
```

#### 表格

```css
.data-table th {
    background: #004098;              /* 企业蓝表头 */
    color: #FFFFFF;
    padding: 14px 16px;
}

.data-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #E5E7EB;
}

.data-table tr:nth-child(even) {
    background: #EFF4F9;              /* 斑马纹 */
}
```

#### 按钮/标签

```css
.tag {
    display: inline-block;
    background: #004098;
    color: #FFFFFF;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 8px;
}

.tag.red { background: #E72521; }
.tag.green { background: #10B981; }
```

---

## HTML报告模板结构

### 页面布局

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <!-- 样式定义 -->
</head>
<body>
    <!-- 1. 固定顶部导航 -->
    <header class="header">
        <div class="logo">项目名称 <span>技术报告</span></div>
        <nav class="nav-links">...</nav>
    </header>

    <!-- 2. Hero区域（深蓝渐变背景） -->
    <section class="hero">
        <h1>报告标题</h1>
        <p class="hero-subtitle">副标题</p>
        <div class="hero-meta">
            <span>📅 生成时间</span>
            <span>📁 项目路径</span>
            <span>🔖 版本</span>
        </div>
    </section>

    <!-- 3. 主内容区 -->
    <main class="main-content">
        <!-- 目录 -->
        <nav class="toc">...</nav>
        
        <!-- 统计概览 -->
        <div class="stats-grid">...</div>
        
        <!-- 各章节 -->
        <section class="section" id="overview">...</section>
        <section class="section" id="architecture">...</section>
        <!-- ... -->
    </main>

    <!-- 4. 页脚（深墨蓝背景） -->
    <footer class="footer">...</footer>
</body>
</html>
```

### 响应式设计

```css
/* 平板 */
@media (max-width: 1024px) {
    :root { --spacing-page: 40px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

/* 手机 */
@media (max-width: 768px) {
    .hero h1 { font-size: 28px; }
    .stats-grid { grid-template-columns: 1fr; }
}
```

---

## 报告内容规范

### 1. 项目概述

必须包含：
- **模块定位**: 一句话描述模块的核心作用
- **核心能力**: 用 bullet points 列出 3-5 个关键能力
- **技术栈**: 表格形式（组件、版本、用途）
- **术语定义**: 表格形式（术语、定义）

### 2. 系统架构

必须包含：
- **整体架构图**: 使用 flow-box 和 flow-arrow 展示
- **模块划分**: file-list 展示核心文件
- **类关系图**: code-block 展示类继承和依赖关系

### 3. 核心模块

必须包含：
- **核心类详解**: 属性表格、方法说明
- **消息处理流程**: 代码块展示关键流程
- **功能特性**: info-card 或 file-list 展示

### 4. 数据流分析

必须包含：
- **入站消息流**: 架构图展示
- **出站消息流**: 表格对比不同方式
- **关键数据结构**: code-block 展示

### 5. 功能特性

必须包含：
- **支持的功能列表**: file-list 展示
- **企业级功能**: info-card 分组展示
- **配置参数**: data-table 展示

### 6. API参考

必须包含：
- **核心方法**: code-block 展示方法签名和注释
- **常量定义**: data-table 展示

### 7. 安全系统

必须包含：
- **认证机制**: code-block 展示流程
- **访问控制**: info-card.warning 展示策略
- **数据安全**: data-table 展示

### 8. 配置管理

必须包含：
- **配置示例**: code-block 展示 JSON/YAML
- **环境变量**: data-table 展示

### 9. 部署运维

必须包含：
- **前置条件**: info-card 展示步骤
- **监控指标**: data-table 展示
- **常见问题**: info-card.warning 展示 Q&A

### 10. 总结

必须包含：
- **核心优势**: file-list 展示 4 个优势
- **技术亮点**: bullet points 展示
- **改进建议**: info-card 展示未来方向

---

## 执行步骤

当用户使用此 Skill 时，按以下步骤执行：

### Step 1: 确认扫描目标

询问或确认：
- 需要扫描的代码目录路径
- 报告的主题名称
- 输出文件路径（可选，默认使用 `{主题}-report.html`）

### Step 2: 执行代码扫描

使用工具扫描代码：
1. `list_dir` 查看目录结构
2. `read_file` 读取核心文件
3. `grep_code` 搜索关键模式
4. 记录文件数量、代码行数等统计数据

### Step 3: 分析并生成报告

基于扫描结果：
1. 提取关键类和函数
2. 分析架构关系
3. 整理配置参数
4. 编写各章节内容

### Step 4: 输出HTML报告

使用 `create_file` 生成HTML文件，确保：
- 完整包含所有CSS样式
- 符合设计规范的颜色和间距
- 响应式布局
- 正确的章节锚点链接

---

## 示例

### 输入

```
扫描 copaw/src/copaw/app/channels/dingtalk/ 目录，生成钉钉消息推送模块的技术报告
```

### 输出

生成文件：`copaw-dingtalk-report.html`

报告包含：
- 统计概览（8个核心文件、2,956行代码等）
- 完整的10个章节
- 符合金融科技风格的视觉设计
- 响应式布局支持

---

## 注意事项

1. **颜色一致性**: 严格使用规范中的品牌色，不要自行调配
2. **字体一致性**: 所有中文内容使用系统字体栈
3. **间距规范性**: 使用标准间距值（60px、40px、20px等）
4. **代码可读性**: 代码块使用语法高亮，关键部分加注释
5. **响应式设计**: 确保在移动设备上也能正常显示
6. **文件大小**: 单个HTML文件应控制在合理范围内（< 2MB）
