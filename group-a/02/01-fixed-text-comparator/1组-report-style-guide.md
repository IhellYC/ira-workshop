# HTML 报告文档样式规范

本规范定义了团队 HTML 报告文档的样式标准。所有由大模型生成的报告类 HTML 文档必须严格遵守此规范，以确保输出风格统一、专业。

---

## 1. 整体页面结构

报告使用单个 HTML 文件存储，模拟 Word 文档排版效果。页面整体为白色背景，内容区域居中，最大宽度 794px（模拟 A4 纸宽度），四周留白。

### 1.1 HTML 基础模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>报告标题</title>
  <style>
    /* 样式见下方各章节定义 */
  </style>
</head>
<body>
  <div class="page">
    <!-- 报告内容 -->
  </div>
</body>
</html>
```

### 1.2 页面容器样式

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f0f2f5;
  font-family: "Microsoft YaHei", "微软雅黑", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-size: 12pt;
  color: #000000;
  line-height: 1.2;
  -webkit-font-smoothing: antialiased;
}

.page {
  max-width: 794px;
  margin: 40px auto;
  padding: 60px 72px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

@media print {
  body {
    background-color: #ffffff;
  }
  .page {
    margin: 0;
    padding: 60px 72px;
    box-shadow: none;
    max-width: none;
  }
}
```

---

## 2. 色彩规范

以南方基金品牌蓝为主色调，用于标题、边框、强调元素等。

| 用途       | 色值      | 说明             |
| ---------- | --------- | ---------------- |
| 主色（蓝） | `#004098` | 南方基金品牌蓝，用于标题、装饰线、强调元素 |
| 辅助蓝     | `#0062CC` | 用于链接、次级强调 |
| 浅蓝背景   | `#E8F0FE` | 用于表格表头背景、提示框背景 |
| 正文黑     | `#000000` | 正文文字         |
| 辅助灰     | `#666666` | 注释、脚注、次要信息 |
| 边框灰     | `#D0D5DD` | 表格边框、分割线 |

```css
:root {
  --color-primary: #004098;
  --color-primary-light: #0062CC;
  --color-primary-bg: #E8F0FE;
  --color-text: #000000;
  --color-text-secondary: #666666;
  --color-border: #D0D5DD;
}
```

---

## 3. 字体规范

| 属性     | 值                                          |
| -------- | ------------------------------------------- |
| 正文字体 | Microsoft YaHei（微软雅黑）                  |
| 正文字号 | 12pt（小四号）                               |
| 正文颜色 | `#000000`（黑色）                            |
| 正文行距 | 1.2 倍（`line-height: 1.2`）                 |
| 字体回退 | `"Microsoft YaHei", "微软雅黑", "PingFang SC", "Helvetica Neue", Arial, sans-serif` |

---

## 4. 标题规范

支持 4 级标题，均使用**蓝色**字体（`#004098`），加粗。各级标题样式如下：

### 4.1 一级标题（H1）

用于报告主标题，居中显示，下方带蓝色装饰线。

```css
h1 {
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 22pt;
  font-weight: bold;
  color: #004098;
  text-align: center;
  margin-top: 0;
  margin-bottom: 8px;
  padding-bottom: 12px;
  border-bottom: 3px solid #004098;
  line-height: 1.4;
}
```

### 4.2 二级标题（H2）

用于报告章节标题，左对齐，左侧带蓝色竖线装饰。

```css
h2 {
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 16pt;
  font-weight: bold;
  color: #004098;
  margin-top: 28px;
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 4px solid #004098;
  line-height: 1.4;
}
```

### 4.3 三级标题（H3）

用于章节内小节标题。

```css
h3 {
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 14pt;
  font-weight: bold;
  color: #004098;
  margin-top: 20px;
  margin-bottom: 8px;
  line-height: 1.4;
}
```

### 4.4 四级标题（H4）

用于最细粒度的小标题。

```css
h4 {
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 12pt;
  font-weight: bold;
  color: #004098;
  margin-top: 16px;
  margin-bottom: 6px;
  line-height: 1.4;
}
```

---

## 5. 段落与正文

```css
p {
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 12pt;
  color: #000000;
  line-height: 1.2;
  margin-top: 0;
  margin-bottom: 10px;
  text-align: justify;
  text-indent: 2em;
}
```

**注意事项：**
- 段落首行缩进 2 个字符（`text-indent: 2em`）
- 两端对齐（`text-align: justify`）
- 段落间距使用 `margin-bottom: 10px`

---

## 6. 列表样式

### 6.1 无序列表

```css
ul {
  margin-top: 6px;
  margin-bottom: 10px;
  padding-left: 2em;
  list-style-type: disc;
}

ul li {
  font-size: 12pt;
  color: #000000;
  line-height: 1.2;
  margin-bottom: 4px;
}
```

### 6.2 有序列表

```css
ol {
  margin-top: 6px;
  margin-bottom: 10px;
  padding-left: 2em;
  list-style-type: decimal;
}

ol li {
  font-size: 12pt;
  color: #000000;
  line-height: 1.2;
  margin-bottom: 4px;
}
```

---

## 7. 表格样式

表格使用蓝色系配色，表头为浅蓝背景，边框使用灰色实线。

```css
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  margin-bottom: 16px;
  font-size: 12pt;
}

table th {
  background-color: #E8F0FE;
  color: #004098;
  font-weight: bold;
  text-align: center;
  padding: 8px 12px;
  border: 1px solid #D0D5DD;
  font-size: 12pt;
}

table td {
  padding: 8px 12px;
  border: 1px solid #D0D5DD;
  text-align: left;
  color: #000000;
  font-size: 12pt;
  line-height: 1.2;
}

table tr:nth-child(even) {
  background-color: #F8FAFC;
}
```

---

## 8. 其他元素样式

### 8.1 强调文本

```css
strong, b {
  font-weight: bold;
  color: #000000;
}

em, i {
  font-style: italic;
}
```

### 8.2 链接

```css
a {
  color: #0062CC;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
```

### 8.3 引用块

用于引用说明、备注等场景。

```css
blockquote {
  margin: 12px 0;
  padding: 12px 16px;
  background-color: #E8F0FE;
  border-left: 4px solid #004098;
  color: #333333;
  font-size: 12pt;
  line-height: 1.2;
}

blockquote p {
  text-indent: 0;
  margin-bottom: 0;
}
```

### 8.4 水平分割线

```css
hr {
  border: none;
  border-top: 1px solid #D0D5DD;
  margin: 20px 0;
}
```

### 8.5 图片

```css
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 12px auto;
}

.img-caption {
  text-align: center;
  font-size: 10pt;
  color: #666666;
  margin-top: 4px;
  margin-bottom: 12px;
}
```

---

## 9. 报告封面（可选）

如需封面页，使用以下结构：

```html
<div class="cover">
  <div class="cover-title">报告主标题</div>
  <div class="cover-subtitle">副标题或报告编号</div>
  <div class="cover-info">
    <p>编制单位：XXX</p>
    <p>编制日期：XXXX年XX月XX日</p>
  </div>
</div>
```

```css
.cover {
  text-align: center;
  padding: 120px 0 80px;
  page-break-after: always;
}

.cover-title {
  font-size: 28pt;
  font-weight: bold;
  color: #004098;
  margin-bottom: 16px;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
}

.cover-subtitle {
  font-size: 16pt;
  color: #004098;
  margin-bottom: 60px;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
}

.cover-info {
  font-size: 12pt;
  color: #333333;
  line-height: 2;
}

.cover-info p {
  text-indent: 0;
  text-align: center;
}
```

---

## 10. 完整 CSS 汇总

以下为可直接嵌入 HTML `<style>` 标签的完整样式代码：

```css
:root {
  --color-primary: #004098;
  --color-primary-light: #0062CC;
  --color-primary-bg: #E8F0FE;
  --color-text: #000000;
  --color-text-secondary: #666666;
  --color-border: #D0D5DD;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f0f2f5;
  font-family: "Microsoft YaHei", "微软雅黑", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-size: 12pt;
  color: var(--color-text);
  line-height: 1.2;
  -webkit-font-smoothing: antialiased;
}

.page {
  max-width: 794px;
  margin: 40px auto;
  padding: 60px 72px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* 标题 */
h1 {
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 22pt;
  font-weight: bold;
  color: var(--color-primary);
  text-align: center;
  margin-top: 0;
  margin-bottom: 8px;
  padding-bottom: 12px;
  border-bottom: 3px solid var(--color-primary);
  line-height: 1.4;
}

h2 {
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 16pt;
  font-weight: bold;
  color: var(--color-primary);
  margin-top: 28px;
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 4px solid var(--color-primary);
  line-height: 1.4;
}

h3 {
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 14pt;
  font-weight: bold;
  color: var(--color-primary);
  margin-top: 20px;
  margin-bottom: 8px;
  line-height: 1.4;
}

h4 {
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 12pt;
  font-weight: bold;
  color: var(--color-primary);
  margin-top: 16px;
  margin-bottom: 6px;
  line-height: 1.4;
}

/* 段落 */
p {
  font-size: 12pt;
  color: var(--color-text);
  line-height: 1.2;
  margin-top: 0;
  margin-bottom: 10px;
  text-align: justify;
  text-indent: 2em;
}

/* 列表 */
ul, ol {
  margin-top: 6px;
  margin-bottom: 10px;
  padding-left: 2em;
}

ul { list-style-type: disc; }
ol { list-style-type: decimal; }

ul li, ol li {
  font-size: 12pt;
  color: var(--color-text);
  line-height: 1.2;
  margin-bottom: 4px;
}

/* 表格 */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  margin-bottom: 16px;
  font-size: 12pt;
}

table th {
  background-color: var(--color-primary-bg);
  color: var(--color-primary);
  font-weight: bold;
  text-align: center;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
}

table td {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  text-align: left;
  color: var(--color-text);
  line-height: 1.2;
}

table tr:nth-child(even) {
  background-color: #F8FAFC;
}

/* 强调 */
strong, b { font-weight: bold; }
em, i { font-style: italic; }

/* 链接 */
a {
  color: var(--color-primary-light);
  text-decoration: none;
}
a:hover { text-decoration: underline; }

/* 引用块 */
blockquote {
  margin: 12px 0;
  padding: 12px 16px;
  background-color: var(--color-primary-bg);
  border-left: 4px solid var(--color-primary);
  color: #333333;
  font-size: 12pt;
  line-height: 1.2;
}

blockquote p {
  text-indent: 0;
  margin-bottom: 0;
}

/* 分割线 */
hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 20px 0;
}

/* 图片 */
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 12px auto;
}

.img-caption {
  text-align: center;
  font-size: 10pt;
  color: var(--color-text-secondary);
  margin-top: 4px;
  margin-bottom: 12px;
}

/* 封面 */
.cover {
  text-align: center;
  padding: 120px 0 80px;
  page-break-after: always;
}

.cover-title {
  font-size: 28pt;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 16px;
}

.cover-subtitle {
  font-size: 16pt;
  color: var(--color-primary);
  margin-bottom: 60px;
}

.cover-info {
  font-size: 12pt;
  color: #333333;
  line-height: 2;
}

.cover-info p {
  text-indent: 0;
  text-align: center;
}

/* 打印适配 */
@media print {
  body { background-color: #ffffff; }
  .page {
    margin: 0;
    padding: 60px 72px;
    box-shadow: none;
    max-width: none;
  }
}
```

---

## 11. 使用示例

以下是一个完整的报告 HTML 示例，展示所有样式的实际效果：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2024年度业务分析报告</title>
  <style>
    /* 粘贴第10章的完整CSS */
  </style>
</head>
<body>
  <div class="page">

    <h1>2024年度业务分析报告</h1>

    <h2>一、总体概述</h2>
    <p>本报告对2024年度各项业务指标进行了全面回顾与分析，涵盖市场表现、产品运营、客户服务等核心维度。</p>

    <h3>1.1 市场环境</h3>
    <p>2024年，国内资本市场在多重因素影响下呈现结构性行情，各类资产表现分化明显。</p>

    <h4>1.1.1 宏观经济形势</h4>
    <p>GDP增速保持在合理区间，货币政策维持稳健基调，财政政策积极发力。</p>

    <h2>二、核心数据</h2>

    <table>
      <thead>
        <tr>
          <th>指标</th>
          <th>2023年</th>
          <th>2024年</th>
          <th>同比变化</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>管理规模（亿元）</td>
          <td>8,500</td>
          <td>9,200</td>
          <td>+8.2%</td>
        </tr>
        <tr>
          <td>客户数量（万户）</td>
          <td>1,200</td>
          <td>1,450</td>
          <td>+20.8%</td>
        </tr>
      </tbody>
    </table>

    <h2>三、总结与展望</h2>
    <p>总体来看，2024年各项业务指标稳中有进，为后续发展奠定了坚实基础。</p>

    <blockquote>
      <p>注：本报告数据截至2024年12月31日，部分数据为初步统计结果。</p>
    </blockquote>

  </div>
</body>
</html>
```

---

## 12. 生成规则（供大模型遵循）

大模型在生成 HTML 报告时，必须遵守以下规则：

1. **必须输出完整 HTML**：包含 `<!DOCTYPE html>`、`<html>`、`<head>`、`<body>` 等完整结构。
2. **样式内联**：所有 CSS 写在 `<head>` 内的 `<style>` 标签中，不引用外部样式文件。
3. **使用 `.page` 容器**：所有正文内容包裹在 `<div class="page">` 内。
4. **标题使用 h1-h4**：不使用 h5、h6，严格限制为 4 级标题。
5. **颜色一致性**：标题一律使用 `#004098`，正文一律使用 `#000000`。
6. **字体一致性**：全文使用微软雅黑字体族。
7. **段落格式**：正文段落使用 `<p>` 标签，首行缩进 2em，两端对齐。
8. **表格规范**：表格必须包含 `<thead>` 和 `<tbody>`，表头使用 `<th>`。
9. **图片规范**：图片后紧跟 `<div class="img-caption">` 标注图片说明。
10. **不使用行内样式**：除非有特殊需求，所有样式通过 CSS class 控制。
11. **编码为 UTF-8**：确保中文正确显示。
12. **打印友好**：保留 `@media print` 规则，确保打印效果良好。
