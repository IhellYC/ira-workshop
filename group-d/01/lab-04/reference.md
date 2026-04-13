# Scan to Report - 参考文档

## 设计规范详解

### 色彩系统

#### 品牌主色

| 色彩类型 | HEX值 | RGB值 | 应用场景 |
|---------|------|-------|---------|
| **主色 - 品牌红** | `#E72521` | `rgb(231, 37, 33)` | CTA主要按钮、强调元素、重点提示、警告状态 |
| **副色 - 企业蓝** | `#004098` | `rgb(0, 64, 152)` | 导航链接、次要按钮、交互元素、表头背景 |
| **页脚背景色** | `#0B264A` | `rgb(11, 38, 74)` | 页脚背景、代码块背景、深色区域 |

**色彩寓意：**
- **红色（#E72521）**：代表活力、信心、紧迫性，引导用户进行重要操作
- **深蓝（#004098）**：象征专业、信任、稳定，符合金融行业特质
- **深墨蓝（#0B264A）**：提供深层背景，增强品牌统一性

#### 中性色系

| 色彩名称 | HEX值 | RGB值 | 应用场景 |
|---------|------|-------|---------|
| 纯白 | `#FFFFFF` | `rgb(255, 255, 255)` | 主要背景、卡片背景（占比 60%+） |
| 深灰（标题） | `#333333` | `rgb(51, 51, 51)` | 标题、标签文本、重要信息 |
| 浅灰（正文） | `#222222` | `rgb(34, 34, 34)` | 正文、描述文本、主要内容 |
| 中灰（辅助） | `#888888` | `rgb(136, 136, 136)` | 辅助文本、时间戳、次要信息 |
| 浅背景灰 | `#EFF4F9` | `rgb(239, 244, 249)` | 内容区域背景、模块分割、卡片背景 |
| 极浅蓝 | `#E5F8FD` | `rgb(229, 248, 253)` | 信息提示区域背景、表格hover |

---

## 字体规范

### 系统字体栈

```css
font-family: -apple-system, "system-ui", "Segoe UI", system-ui, 
             Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, 
             "PingFang SC", "Microsoft YaHei", 
             "Helvetica Neue", Helvetica, Arial;
```

**优先级说明：**
1. `-apple-system` - macOS/iOS 系统字体
2. `"PingFang SC"` - 苹果苹方体（中文首选）
3. `"Microsoft YaHei"` - 微软雅黑（Windows中文）
4. `Roboto` - Android 系统字体
5. `Helvetica/Arial` - 通用降级方案

### 标题层级

| 标题等级 | 字号 | 字重 | 行高 | 颜色 | 下边距 | 应用场景 |
|---------|------|------|------|------|--------|---------|
| **H1** | 36px | 500 | 1.2 | `#FFFFFF` | 20px | Hero区域大标题 |
| **H2** | 28px | 500 | 1.3 | `#333333` | 15px | 章节标题，带底部边框 |
| **H3** | 20px | 500 | 1.4 | `#333333` | 15px | 小节标题 |
| **H4** | 16px | 500 | 1.5 | `#333333` | 12px | 卡片标题 |

### 正文字体

| 字体类型 | 字号 | 字重 | 行高 | 颜色 | 应用 |
|---------|------|------|------|------|------|
| **正文** | 16px | 400 | 1.8 | `#222222` | 长文本内容 |
| **小文本** | 14px | 400 | 1.6 | `#888888` | 时间、标签、次要信息 |
| **链接文本** | 14px | 400 | 1.6 | `#004098` | 导航、CTA链接 |

---

## 间距系统

### 水平间距

| 间距名称 | 值 | 应用场景 |
|---------|-----|---------|
| 页面边距 | 131.67px | 页面左右两侧外边距（约占屏幕宽度的12-15%） |
| 模块内补 | 60px | 章节内部的内边距 |
| 元素间距大 | 40px | 大元素之间的间距 |
| 元素间距中 | 30px | 中等元素之间的间距 |
| 元素间距小 | 20px | 小元素之间的间距 |

### 垂直间距

| 间距名称 | 值 | 应用场景 |
|---------|-----|---------|
| 章节间距 | 60px | section 之间的间距 |
| 模块间距 | 40px | 模块之间的间距 |
| 卡片内边距 | 24px | info-card 内部 padding |
| 表格单元格 | 12-14px | 表格 td/th 的 padding |

### 圆角规范

| 元素 | 圆角值 | 说明 |
|------|--------|------|
| 按钮 | 8px | 主要按钮和次要按钮 |
| 卡片 | 8px | info-card、stat-card |
| 输入框 | 4px | 表单元素 |
| 标签 | 4px | tag 组件 |
| 代码块 | 8px | code-block |

---

## 组件样式参考

### 顶部导航 (Header)

```css
.header {
    background: #0B264A;
    padding: 20px 131.67px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.logo {
    font-size: 24px;
    font-weight: 500;
    color: #FFFFFF;
}

.logo span {
    color: #E72521;  /* 品牌红 */
}

.nav-links a {
    color: #FFFFFF;
    text-decoration: none;
    font-size: 14px;
}
```

### Hero 区域

```css
.hero {
    background: linear-gradient(135deg, #0B264A 0%, #004098 100%);
    padding: 140px 131.67px 80px;  /* 上内边距140px给固定导航留空间 */
    color: #FFFFFF;
}

.hero h1 {
    font-size: 36px;
    font-weight: 500;
    margin-bottom: 20px;
}

.hero-subtitle {
    font-size: 18px;
    opacity: 0.9;
    margin-bottom: 30px;
}

.hero-meta {
    font-size: 14px;
    opacity: 0.8;
}
```

### 信息卡片

```css
.info-card {
    background: #EFF4F9;
    padding: 24px;
    margin: 20px 0;
    border-radius: 8px;
    border-left: 4px solid #004098;  /* 蓝色左边框 */
}

.info-card.warning {
    border-left-color: #E72521;  /* 红色 */
    background: #FFF5F5;
}

.info-card.success {
    border-left-color: #10B981;  /* 绿色 */
    background: #F0FDF4;
}
```

### 代码块

```css
.code-block {
    background: #0B264A;
    color: #FFFFFF;
    padding: 20px;
    border-radius: 8px;
    font-family: "Consolas", "Monaco", "Courier New", monospace;
    font-size: 14px;
    line-height: 1.6;
    overflow-x: auto;
}

/* 语法高亮 */
.code-block .comment { color: #6B7280; }
.code-block .keyword { color: #F472B6; }
.code-block .string { color: #A3E635; }
```

### 表格

```css
.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.data-table th {
    background: #004098;
    color: #FFFFFF;
    padding: 14px 16px;
    text-align: left;
    font-weight: 500;
}

.data-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #E5E7EB;
}

.data-table tr:nth-child(even) {
    background: #EFF4F9;  /* 斑马纹 */
}

.data-table tr:hover {
    background: #E5F8FD;
}
```

### 统计卡片

```css
.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin: 30px 0;
}

.stat-card {
    background: #EFF4F9;
    padding: 24px;
    border-radius: 8px;
    text-align: center;
}

.stat-number {
    font-size: 36px;
    font-weight: 500;
    color: #004098;
    margin-bottom: 8px;
}

.stat-label {
    font-size: 14px;
    color: #888888;
}
```

### 文件列表

```css
.file-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin: 20px 0;
}

.file-item {
    background: #EFF4F9;
    padding: 16px;
    border-radius: 8px;
    border-left: 3px solid #004098;
}

.file-item h5 {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    margin-bottom: 8px;
}

.file-item p {
    font-size: 13px;
    color: #888888;
    margin: 0;
}
```

### 标签

```css
.tag {
    display: inline-block;
    background: #004098;
    color: #FFFFFF;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 8px;
    margin-bottom: 8px;
}

.tag.red { background: #E72521; }
.tag.green { background: #10B981; }
.tag.gray { background: #888888; }
```

### 页脚

```css
.footer {
    background: #0B264A;
    color: #FFFFFF;
    padding: 60px 131.67px;
    margin-top: 80px;
}

.footer-content {
    text-align: center;
}

.footer p {
    font-size: 14px;
    opacity: 0.8;
}
```

---

## 响应式设计

### 断点定义

```css
/* 平板 */
@media (max-width: 1024px) {
    :root {
        --spacing-page: 40px;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .toc ul {
        grid-template-columns: 1fr;
    }
}

/* 手机 */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 16px;
    }
    
    .hero h1 {
        font-size: 28px;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .flow-row {
        flex-direction: column;
    }
}
```

---

## HTML结构模板

### 完整页面结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{报告标题}</title>
    <style>
        /* CSS变量定义 */
        :root {
            --color-brand-red: #E72521;
            --color-brand-blue: #004098;
            --color-dark-blue: #0B264A;
            --color-white: #FFFFFF;
            --color-dark-gray: #333333;
            --color-text: #222222;
            --color-gray: #888888;
            --color-light-bg: #EFF4F9;
            --color-light-blue: #E5F8FD;
            --font-family: -apple-system, "system-ui", "Segoe UI", system-ui, 
                           Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, 
                           "PingFang SC", "Microsoft YaHei", 
                           "Helvetica Neue", Helvetica, Arial;
            --spacing-xs: 20px;
            --spacing-sm: 30px;
            --spacing-md: 40px;
            --spacing-lg: 60px;
            --spacing-page: 131.67px;
        }
        
        /* 重置样式 */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        /* 基础样式 */
        body {
            font-family: var(--font-family);
            color: var(--color-text);
            background: var(--color-white);
            line-height: 1.6;
            font-size: 16px;
        }
        
        /* 组件样式... */
    </style>
</head>
<body>
    <!-- 导航 -->
    <header class="header">...</header>
    
    <!-- Hero -->
    <section class="hero">...</section>
    
    <!-- 主内容 -->
    <main class="main-content">
        <nav class="toc">...</nav>
        <div class="stats-grid">...</div>
        <section class="section" id="overview">...</section>
        <!-- 更多章节... -->
    </main>
    
    <!-- 页脚 -->
    <footer class="footer">...</footer>
</body>
</html>
```

---

## 章节内容模板

### 1. 项目概述

```html
<section class="section" id="overview">
    <h2 class="section-title">1. 项目概述</h2>
    
    <h3>1.1 模块定位</h3>
    <p>模块的核心作用和定位描述...</p>
    
    <div class="info-card">
        <h4>🎯 核心能力</h4>
        <p>• 能力1<br>• 能力2<br>...</p>
    </div>
    
    <h3>1.2 技术栈</h3>
    <table class="data-table">
        <thead>
            <tr><th>技术组件</th><th>版本</th><th>用途</th></tr>
        </thead>
        <tbody>
            <tr><td>...</td><td>...</td><td>...</td></tr>
        </tbody>
    </table>
    
    <h3>1.3 术语定义</h3>
    <table class="data-table">
        <thead>
            <tr><th>术语</th><th>定义</th></tr>
        </thead>
        <tbody>
            <tr><td>...</td><td>...</td></tr>
        </tbody>
    </table>
</section>
```

### 2. 系统架构

```html
<section class="section" id="architecture">
    <h2 class="section-title">2. 系统架构</h2>
    
    <h3>2.1 整体架构图</h3>
    <div class="architecture-diagram">
        <div class="flow-container">
            <!-- 架构图内容 -->
        </div>
    </div>
    
    <h3>2.2 模块划分</h3>
    <div class="file-list">
        <div class="file-item">...</div>
    </div>
</section>
```

---

## 工具函数参考

### 代码扫描工具

```python
# 扫描目录结构
def scan_directory(path: str) -> dict:
    """扫描目录，返回文件树结构"""
    pass

# 统计代码行数
def count_lines(files: list) -> dict:
    """统计代码文件行数"""
    pass

# 提取类定义
def extract_classes(file_path: str) -> list:
    """从代码文件中提取类定义"""
    pass

# 提取函数定义
def extract_functions(file_path: str) -> list:
    """从代码文件中提取函数定义"""
    pass
```

### 报告生成工具

```python
# 生成统计卡片
def generate_stat_card(number: str, label: str) -> str:
    """生成统计卡片HTML"""
    return f'''
    <div class="stat-card">
        <div class="stat-number">{number}</div>
        <div class="stat-label">{label}</div>
    </div>
    '''

# 生成信息卡片
def generate_info_card(title: str, content: str, style: str = "") -> str:
    """生成信息卡片HTML"""
    class_name = f"info-card {style}".strip()
    return f'''
    <div class="{class_name}">
        <h4>{title}</h4>
        <p>{content}</p>
    </div>
    '''

# 生成表格
def generate_table(headers: list, rows: list) -> str:
    """生成数据表格HTML"""
    pass
```
