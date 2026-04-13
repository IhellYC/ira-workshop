"""PDF 报告生成服务"""

import os
import re
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime


# 注册中文字体 - 尝试多种常见路径
_FONT_REGISTERED = False


def _register_chinese_font():
    global _FONT_REGISTERED
    if _FONT_REGISTERED:
        return

    font_paths = [
        "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/simhei.ttf",
        "C:/Windows/Fonts/simsun.ttc",
        "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
        "/System/Library/Fonts/PingFang.ttc",
    ]

    for fp in font_paths:
        if os.path.exists(fp):
            try:
                pdfmetrics.registerFont(TTFont("ChineseFont", fp))
                _FONT_REGISTERED = True
                return
            except Exception:
                continue

    # Fallback: 使用 Helvetica（中文可能显示异常）
    _FONT_REGISTERED = True


def _get_styles():
    """获取报告样式"""
    _register_chinese_font()
    font_name = "ChineseFont" if _FONT_REGISTERED else "Helvetica"

    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        name="CNTitle",
        fontName=font_name,
        fontSize=22,
        leading=30,
        alignment=1,
        spaceAfter=10,
        textColor=colors.HexColor("#1a237e"),
    ))
    styles.add(ParagraphStyle(
        name="CNSubtitle",
        fontName=font_name,
        fontSize=11,
        leading=16,
        alignment=1,
        spaceAfter=20,
        textColor=colors.grey,
    ))
    styles.add(ParagraphStyle(
        name="CNHeading",
        fontName=font_name,
        fontSize=15,
        leading=22,
        spaceBefore=16,
        spaceAfter=8,
        textColor=colors.HexColor("#1565c0"),
    ))
    styles.add(ParagraphStyle(
        name="CNSubHeading",
        fontName=font_name,
        fontSize=12,
        leading=18,
        spaceBefore=10,
        spaceAfter=6,
        textColor=colors.HexColor("#333333"),
        fontWeight="bold",
    ))
    styles.add(ParagraphStyle(
        name="CNBody",
        fontName=font_name,
        fontSize=10,
        leading=16,
        spaceAfter=6,
        textColor=colors.HexColor("#444444"),
    ))

    return styles


def _markdown_to_flowables(text: str, styles) -> list:
    """将 Markdown 格式的文本转换为 ReportLab flowables"""
    flowables = []
    lines = text.split("\n")

    for line in lines:
        line = line.strip()
        if not line:
            flowables.append(Spacer(1, 4 * mm))
            continue

        # 标题处理
        if line.startswith("### "):
            content = line[4:].strip()
            flowables.append(Paragraph(content, styles["CNSubHeading"]))
        elif line.startswith("## "):
            content = line[3:].strip()
            flowables.append(Paragraph(content, styles["CNHeading"]))
        elif line.startswith("# "):
            content = line[2:].strip()
            flowables.append(Paragraph(content, styles["CNHeading"]))
        elif line.startswith("- ") or line.startswith("* "):
            content = line[2:].strip()
            content = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", content)
            flowables.append(Paragraph(f"  \u2022 {content}", styles["CNBody"]))
        elif re.match(r"^\d+\.\s", line):
            content = re.sub(r"^\d+\.\s", "", line).strip()
            content = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", content)
            num = re.match(r"^(\d+)\.", line).group(1)
            flowables.append(Paragraph(f"  {num}. {content}", styles["CNBody"]))
        else:
            content = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", line)
            flowables.append(Paragraph(content, styles["CNBody"]))

    return flowables


def generate_pdf(
    task_id: str,
    customer_name: str,
    asset_analysis: str,
    trade_analysis: str,
    summary: str,
    output_dir: str,
) -> str:
    """生成 PDF 报告，返回文件路径"""
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"report_{task_id}.pdf")

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=25 * mm,
        bottomMargin=20 * mm,
    )

    styles = _get_styles()
    story = []

    # 封面标题
    story.append(Spacer(1, 30 * mm))
    story.append(Paragraph("客户资产分析报告", styles["CNTitle"]))
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph(f"客户：{customer_name}", styles["CNSubtitle"]))
    story.append(Paragraph(
        f"生成日期：{datetime.now().strftime('%Y年%m月%d日')}",
        styles["CNSubtitle"],
    ))
    story.append(Spacer(1, 10 * mm))

    # 分隔线
    line_data = [[""] ]
    line_table = Table(line_data, colWidths=[170 * mm])
    line_table.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 1, colors.HexColor("#1565c0")),
    ]))
    story.append(line_table)
    story.append(Spacer(1, 10 * mm))

    # 综合总结
    story.append(Paragraph("一、报告总结", styles["CNHeading"]))
    story.extend(_markdown_to_flowables(summary, styles))

    story.append(PageBreak())

    # 资产配置分析
    story.append(Paragraph("二、资产配置分析", styles["CNHeading"]))
    story.extend(_markdown_to_flowables(asset_analysis, styles))

    story.append(PageBreak())

    # 交易行为分析
    story.append(Paragraph("三、交易行为分析", styles["CNHeading"]))
    story.extend(_markdown_to_flowables(trade_analysis, styles))

    # 页脚声明
    story.append(Spacer(1, 20 * mm))
    story.append(Paragraph(
        "免责声明：本报告仅供参考，不构成任何投资建议。投资有风险，入市需谨慎。",
        styles["CNBody"],
    ))

    doc.build(story)
    return output_path
