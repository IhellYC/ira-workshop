---
name: scan-report
description: Generate professional HTML scan reports for codebase analysis. Use when creating technical documentation, code scanning reports, or when the user requests a formatted report following team standards.
---

# Scan Report Generator

Generate professional HTML reports for codebase scanning tasks, following team styling standards.

## Quick Start

When asked to generate a scan report:

1. **Scan the codebase** using grep_code, search_codebase, or other search tools
2. **Collect and analyze** the findings
3. **Generate HTML report** following the style guide below
4. **Save to appropriate location** (typically `website/` directory)

## Report Structure

Every report must include:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[报告标题]</title>
  <style>
    /* 完整CSS样式 - 见 style-template.md */
  </style>
</head>
<body>
  <div class="page">
    <h1>[报告主标题]</h1>
    <!-- 报告内容 -->
  </div>
</body>
</html>
```

## Key Styling Rules

| Element | Style |
|---------|-------|
| 主色调 | `#004098` (品牌蓝) |
| 正文 | 12pt 微软雅黑, `#000000` |
| 标题 | 蓝色 `#004098`, 加粗 |
| 段落 | 首行缩进 2em, 两端对齐 |
| 表头 | 浅蓝背景 `#E8F0FE` |
| 页面宽度 | 最大 794px (模拟A4纸) |

## Report Content Sections

Typical scan reports include:

1. **文档概述** - 扫描范围、方法、结果统计
2. **详细分析** - 分类展示扫描发现
3. **数据表格** - 使用规范表格样式
4. **代码示例** - 使用 `<pre><code>` 展示
5. **总结建议** - 归纳发现并提出改进建议

## Output Requirements

- 完整HTML结构 (DOCTYPE, html, head, body)
- 样式内联在 `<style>` 标签中
- 内容包裹在 `<div class="page">` 内
- 仅使用 h1-h4 四级标题
- 表格包含 `<thead>` 和 `<tbody>`
- UTF-8 编码确保中文正确显示

## Reference Files

- For complete CSS styles, see [style-template.md](style-template.md)
- For example reports, see [examples.md](examples.md)
