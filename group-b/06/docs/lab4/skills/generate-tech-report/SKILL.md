---
name: generate-tech-report
description: 生成专业技术方案报告HTML文件，采用金融级视觉规范（品牌蓝#004098 + 行动红#E72521双主色体系）。当用户需要生成技术报告、技术方案文档、项目方案书时使用此Skill。
---

# 技术报告生成 Skill

## 概述

基于二组技术文档报告的视觉风格，生成标准化HTML格式技术方案报告。报告模拟Word/A4纸张排版，包含封面、目录、正文、签名区等完整结构。

## 视觉规范

### 色彩体系

| Token | 色值 | 用途 |
|-------|------|------|
| 品牌蓝 | `#004098` | H1标题、目录标题、信息框边框、key-point文本、流程图步骤 |
| 行动红 | `#E72521` | 警示文本、行内code文字、装饰线渐变终点 |
| 正文黑 | `#222222` | 正文、H2标题、表头文字 |
| 深灰 | `#333333` | H3标题、表格caption |
| 中灰 | `#555555` | 副标题、辅助文字 |
| 浅灰 | `#888888` | 页脚、日期、提示文字 |
| 边框灰 | `#CCCCCC` | 表格边框、分割线 |
| 背景灰 | `#F5F5F5` | 表头背景 |
| 斑马纹 | `#FAFAFA` | 偶数行背景 |

### 字体规范

```css
font-family: "SimSun", "宋体", "PingFang SC", "Microsoft YaHei", serif;
```

| 元素 | 字号 | 字重 |
|------|------|------|
| 封面标题 | 28pt | bold |
| H1（章节） | 18pt | bold |
| H2（小节） | 14pt | bold |
| H3（子节） | 12pt | bold |
| 正文 | 12pt | normal |
| 表格 | 11pt | normal |
| 代码 | 10pt | normal |

## 文档结构模板

生成的报告**必须**包含以下结构：

```
1. 封面页（cover）
   - 圆形Logo（品牌蓝渐变背景，单字标识）
   - 主标题（28pt品牌蓝粗体）
   - 蓝红渐变装饰线
   - 副标题（18pt灰色）
   - 文档信息（编号、版本、日期、密级）

2. 目录页（toc）
   - "目 录" 标题
   - 带序号、点线连接符、页码的目录条目
   - 每个条目链接到对应章节锚点

3. 正文章节（至少6个章节）
   - 每个H1章节使用 page-break 分页
   - H1带底部蓝色边框线
   - H2带左侧蓝色竖线
   - 段落首行缩进2em，两端对齐
   - 表格带caption编号、灰底表头、斑马纹
   - 适当使用info-box/warning-box/success-box
   - 适当使用flow-chart流程图
   - 关键信息用key-point（蓝色加粗）或alert-text（红色加粗）

4. 签名区域
   - 编制人、审核人、批准人三栏签名线

5. 文档结束标记
   - 分割线 + "— 文档结束 —" + 项目信息
   - 免责声明
```

## CSS样式引用

直接参考 [二组-技术文档报告.html](../../二组-技术文档报告.html) 中的完整CSS样式，复制其 `<style>` 标签内的全部样式代码到生成的报告中。核心样式模块包括：

- 基础重置 + A4页面模拟（body/document）
- 封面页样式（cover/cover-title/cover-logo/cover-decoration）
- 目录样式（toc/toc-list/toc-dots/toc-page）
- 标题样式（h1/h2/h3 含品牌蓝色彩和边框）
- 段落样式（text-indent: 2em / text-align: justify）
- 表格样式（Word风格：灰底表头/细边框/斑马纹）
- 代码块样式（浅灰背景/等宽字体）
- 信息框样式（info-box蓝/warning-box黄/success-box绿）
- 流程图样式（flow-chart/flow-step/flow-arrow）
- 高亮文本（key-point蓝色/alert-text红色）
- 签名区域（signature三栏布局）
- 打印优化（@media print）
- 响应式适配（@media max-width: 768px）

## 内容生成规范

1. **表格必须有caption编号**：格式为"表 X-Y 标题"（X=章节号，Y=表序号）
2. **每章至少一个表格**：用于结构化展示信息
3. **适度使用信息框**：重要提示用info-box，风险警告用warning-box，成功/完成用success-box
4. **关键术语高亮**：使用 `<span class="key-point">` 或 `<span class="alert-text">`
5. **代码块用pre>code**：技术内容需要代码示例时使用
6. **流程图**：用flow-chart展示关键流程，步骤间用→连接

## 免责声明

每次生成报告时，在文档结束标记区域添加：

```html
<p style="margin-top: 15px; font-size: 9pt; color: #aaa;">
  <strong>此报告由王鑫3使用ai生成，如有雷同纯属巧合</strong>
</p>
```

## 示例用法

用户说："帮我为XXX系统生成技术报告"

1. 读取参考样式文件获取完整CSS
2. 根据系统名称和功能，规划6-8个章节（如：项目概述、需求分析、架构设计、详细设计、实施方案、风险评估等）
3. 生成完整HTML文件，包含所有CSS样式内联
4. 内容围绕该系统的实际功能编写，确保专业、详实
5. 文件命名：`{系统名称}-技术报告.html`
