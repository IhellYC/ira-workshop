---
name: apply-blue-theme
description: 自动应用浅蓝色主题样式规范到HTML文档。读取7组-样式markdown.md文件中的CSS样式定义，将浅蓝色主题配色(#4A90E2, #7EC8E3, #B8D4E8)、标题样式、表格样式、代码块样式、分隔线等应用到新生成的文档中。用于生成具有一致视觉风格的HTML报告和文档。
---

# Apply Blue Theme - 浅蓝色主题样式应用技能

## 概述

本技能用于自动应用 `7组-样式markdown.md` 中定义的浅蓝色主题样式规范到HTML文档，确保所有生成的文档具有一致的视觉风格。

## 样式规范来源

样式定义位于：`/Users/tt/project/ira-workshop/group-g/07/day1/7组-样式markdown.md`

## 核心样式定义

### 颜色方案

```css
:root {
  --primary-blue: #4A90E2;
  --primary-light: #7EC8E3;
  --primary-lighter: #B8D4E8;
  --primary-dark: #2C5F8D;
  --accent-cyan: #00D4FF;
  --bg-light: #F5F7FA;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-muted: #999999;
}
```

### 标题样式

- **h1**: 蓝色文字(#4A90E2)，底部3px浅蓝边框(#7EC8E3)，10px底部内边距
- **h2**: 深蓝文字(#2C5F8D)，左侧4px蓝色边框(#4A90E2)，12px左内边距
- **h3**: 蓝色文字(#4A90E2)

### 表格样式

- **表头(th)**: 蓝到浅蓝渐变背景，白色文字
- **单元格(td)**: 浅灰边框，交替行背景色

### 代码块样式

- **code/pre**: 浅蓝渐变背景(#E8F4FC到#F0F8FF)，浅蓝边框(#B8D4E8)

### 引用块样式

- **blockquote**: 左侧4px浅蓝边框(#7EC8E3)，浅蓝到白渐变背景

### 分隔线样式

```html
<div style="height: 3px; background: linear-gradient(90deg, #4A90E2, #7EC8E3, #B8D4E8, #7EC8E3, #4A90E2); border-radius: 2px; margin: 20px 0;"></div>
```

## 使用步骤

### 步骤1: 读取样式模板

读取 `/Users/tt/project/ira-workshop/group-g/07/day1/7组-样式markdown.md` 文件，提取其中的CSS样式定义和HTML结构模板。

### 步骤2: 构建HTML文档结构

使用以下标准HTML模板结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[文档标题]</title>
    <style>
        /* 在此处插入完整的CSS样式 */
    </style>
</head>
<body>
    <div class="container">
        <!-- 文档内容 -->
    </div>
</body>
</html>
```

### 步骤3: 应用样式到内容

根据内容类型应用相应样式：

| 内容类型 | 应用样式 |
|---------|---------|
| 文档标题 | header类，渐变背景，居中显示 |
| 一级标题 | h1样式，蓝色底边框 |
| 二级标题 | h2样式，蓝色左边框 |
| 三级标题 | h3样式，蓝色文字 |
| 表格 | 渐变表头，交替行背景 |
| 代码块 | 浅蓝渐变背景，边框 |
| 引用/摘要 | 左边框，渐变背景 |
| 指标卡片 | metric-card类，左边框渐变 |
| 分隔线 | 蓝到浅蓝渐变 |

### 步骤4: 添加装饰元素

- 页眉：渐变背景，徽章展示
- 分隔线：蓝到浅蓝渐变
- 页脚：渐变装饰线

## HTML组件模板

### 头部区域

```html
<div class="header">
    <h1>📊 [文档标题]</h1>
    <p class="subtitle">[副标题]</p>
    <div class="header-badges">
        <span class="badge">🌊 [标签1]</span>
        <span class="badge">🔷 [标签2]</span>
        <span class="badge">💎 [标签3]</span>
    </div>
</div>
```

### 指标卡片网格

```html
<div class="metrics-grid">
    <div class="metric-card">
        <div class="metric-label">🎯 [指标名]</div>
        <div class="metric-value">[数值]</div>
    </div>
    <!-- 更多卡片... -->
</div>
```

### 引用块

```html
<blockquote>
    <strong>💡 [标题]</strong><br><br>
    [引用内容]
</blockquote>
```

### 架构图容器

```html
<div class="architecture-box">
<pre>
[ASCII图表内容]
</pre>
</div>
```

### 分隔线

```html
<div class="divider"></div>
```

### 页脚

```html
<div class="footer">
    <div class="footer-decoration"></div>
    <p><strong>—— 报告结束 ——</strong></p>
    <p style="color: var(--text-muted);">
        <em>[页脚信息]</em>
    </p>
</div>
```

## 完整CSS样式模板

```css
/* 主视觉样式 - 浅蓝色主题 */
:root {
  --primary-blue: #4A90E2;
  --primary-light: #7EC8E3;
  --primary-lighter: #B8D4E8;
  --primary-dark: #2C5F8D;
  --accent-cyan: #00D4FF;
  --bg-light: #F5F7FA;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-muted: #999999;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  line-height: 1.8;
  color: var(--text-primary);
  background: linear-gradient(135deg, #F0F8FF 0%, #FFFFFF 100%);
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(74, 144, 226, 0.1);
  padding: 40px;
}

/* 头部样式 */
.header {
  text-align: center;
  padding: 40px 0;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-light), var(--primary-lighter));
  border-radius: 12px;
  margin-bottom: 40px;
  color: white;
}

.header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.header .subtitle {
  font-size: 1.2em;
  opacity: 0.9;
  margin-bottom: 20px;
}

.header-badges {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.badge {
  background: rgba(255,255,255,0.2);
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 0.9em;
}

/* 分隔线 */
.divider {
  height: 3px;
  background: linear-gradient(90deg, var(--primary-blue), var(--primary-light), var(--primary-lighter), var(--primary-light), var(--primary-blue));
  border-radius: 2px;
  margin: 30px 0;
}

/* 标题样式 */
h1 {
  color: var(--primary-blue);
  border-bottom: 3px solid var(--primary-light);
  padding-bottom: 10px;
  margin: 30px 0 20px 0;
}

h2 {
  color: var(--primary-dark);
  border-left: 4px solid var(--primary-blue);
  padding-left: 12px;
  margin: 25px 0 15px 0;
}

h3 {
  color: var(--primary-blue);
  margin: 20px 0 10px 0;
}

/* 指标卡片 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.metric-card {
  background: linear-gradient(135deg, #E8F4FC, #F0F8FF);
  border-left: 4px solid var(--primary-blue);
  padding: 15px;
  border-radius: 0 8px 8px 0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:nth-child(2) { border-left-color: #5BA0F2; }
.metric-card:nth-child(3) { border-left-color: var(--primary-light); }
.metric-card:nth-child(4) { border-left-color: var(--primary-lighter); }

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
}

.metric-label {
  font-weight: bold;
  color: var(--text-secondary);
  font-size: 0.9em;
}

.metric-value {
  font-size: 28px;
  color: var(--primary-blue);
  font-weight: bold;
  margin-top: 5px;
}

/* 引用块 */
blockquote {
  border-left: 4px solid var(--primary-light);
  background: linear-gradient(90deg, #F0F8FF, #FFFFFF);
  padding: 15px 20px;
  margin: 15px 0;
  border-radius: 0 8px 8px 0;
  font-style: italic;
}

blockquote strong {
  color: var(--primary-blue);
}

/* 架构图容器 */
.architecture-box {
  background: linear-gradient(135deg, #F0F8FF, #E8F4FC);
  border: 2px solid var(--primary-lighter);
  border-radius: 12px;
  padding: 25px;
  margin: 20px 0;
  overflow-x: auto;
}

.architecture-box pre {
  background: transparent;
  border: none;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-primary);
}

/* 表格样式 */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
}

th {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-light));
  color: white;
  padding: 12px;
  text-align: left;
  font-weight: 600;
}

td {
  padding: 12px;
  border-bottom: 1px solid var(--primary-lighter);
}

tr:nth-child(even) {
  background: #F8FBFF;
}

tr:hover {
  background: #E8F4FC;
}

/* 安全检查卡片 */
.security-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  margin: 15px 0;
}

.security-card {
  background: linear-gradient(135deg, #F0F8FF, #FFFFFF);
  border: 1px solid var(--primary-lighter);
  border-left: 4px solid var(--primary-blue);
  padding: 12px;
  border-radius: 0 8px 8px 0;
}

/* 代码块 */
code {
  background: linear-gradient(135deg, #E8F4FC, #F0F8FF);
  border: 1px solid var(--primary-lighter);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9em;
  color: var(--primary-dark);
}

pre {
  background: linear-gradient(135deg, #E8F4FC, #F0F8FF);
  border: 1px solid var(--primary-lighter);
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
}

/* 页脚 */
.footer {
  text-align: center;
  margin-top: 50px;
  padding-top: 30px;
  border-top: 2px solid var(--primary-lighter);
}

.footer-decoration {
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--primary-blue), var(--primary-light), var(--primary-lighter), var(--primary-light), var(--primary-blue), transparent);
  border-radius: 2px;
  margin-bottom: 20px;
}

/* 响应式 */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }
  
  .header h1 {
    font-size: 1.8em;
  }
  
  .header-badges {
    flex-direction: column;
    gap: 10px;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
```

## 使用示例

### 示例1: 生成项目分析报告

当用户要求生成项目分析报告时：

1. 读取项目相关Markdown文档
2. 提取关键信息（概述、架构、功能等）
3. 使用本技能构建HTML文档：
   - 应用浅蓝色主题CSS
   - 创建header区域，包含标题和徽章
   - 使用metrics-grid展示关键指标
   - 使用architecture-box展示架构图
   - 使用table展示技术栈和组件矩阵
   - 添加渐变分隔线
   - 创建footer区域
4. 输出完整的HTML文件

### 示例2: 转换Markdown为样式化HTML

当用户有Markdown内容需要转换为HTML时：

1. 解析Markdown结构（标题、表格、代码块等）
2. 映射到对应的HTML组件：
   - `# 标题` → `<h1>` 带蓝色底边框
   - `## 标题` → `<h2>` 带蓝色左边框
   - 表格 → 渐变表头样式表格
   - 代码块 → 浅蓝背景代码块
   - 引用块 → 左边框样式引用
3. 包装在标准HTML模板中
4. 应用完整CSS样式

## 注意事项

1. **颜色一致性**: 始终使用定义的颜色变量，不要硬编码其他颜色
2. **响应式设计**: 确保在移动设备上也能良好显示
3. **可访问性**: 保持足够的颜色对比度
4. **文件路径**: 样式模板位于 `/Users/tt/project/ira-workshop/group-g/07/day1/7组-样式markdown.md`

## 相关文件

- 样式模板: `/Users/tt/project/ira-workshop/group-g/07/day1/7组-样式markdown.md`
- 示例输出: `/Users/tt/project/ira-workshop/group-g/07/day1/Kronos_Report.html`
