/**
 * PDF 报告生成服务
 */
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// 查找中文字体（优先 .ttf 格式）
function findChineseFont() {
  const fontPaths = [
    "C:/Windows/Fonts/simhei.ttf",
    "C:/Windows/Fonts/simkai.ttf",
    "C:/Windows/Fonts/simsunb.ttf",
  ];
  for (const fp of fontPaths) {
    if (fs.existsSync(fp)) return fp;
  }
  return null;
}

// 渲染 Markdown 文本到 PDF
function renderMarkdown(doc, text) {
  if (!text) {
    doc.fontSize(10.5).fillColor("#999").text("暂无内容");
    return;
  }
  const lines = String(text).split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      doc.moveDown(0.3);
      continue;
    }

    if (trimmed.startsWith("### ")) {
      doc.moveDown(0.5);
      doc.fontSize(13).fillColor("#333").text(trimmed.slice(4));
      doc.moveDown(0.3);
    } else if (trimmed.startsWith("## ")) {
      doc.moveDown(0.8);
      doc.fontSize(15).fillColor("#1565c0").text(trimmed.slice(3));
      doc.moveDown(0.3);
    } else if (trimmed.startsWith("# ")) {
      doc.moveDown(1);
      doc.fontSize(18).fillColor("#1a237e").text(trimmed.slice(2));
      doc.moveDown(0.5);
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const content = trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, "$1");
      doc.fontSize(10.5).fillColor("#444").text(`  \u2022 ${content}`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      const content = trimmed.replace(/\*\*(.*?)\*\*/g, "$1");
      doc.fontSize(10.5).fillColor("#444").text(`  ${content}`);
    } else {
      const content = trimmed.replace(/\*\*(.*?)\*\*/g, "$1");
      doc.fontSize(10.5).fillColor("#444").text(content);
    }
  }
}

function generatePdf(taskId, customerName, assetAnalysis, tradeAnalysis, summary, outputDir) {
  return new Promise((resolve, reject) => {
    try {
      fs.mkdirSync(outputDir, { recursive: true });
      const outputPath = path.join(outputDir, `report_${taskId}.pdf`);

      const doc = new PDFDocument({ size: "A4", margin: 60 });
      const stream = fs.createWriteStream(outputPath);

      // 先绑定事件再 pipe
      stream.on("finish", () => {
        console.log(`PDF 生成成功: ${outputPath}`);
        resolve(outputPath);
      });
      stream.on("error", (err) => {
        console.error("PDF 写入流错误:", err);
        reject(err);
      });

      doc.pipe(stream);

      // 注册中文字体
      const fontPath = findChineseFont();
      if (fontPath) {
        doc.registerFont("Chinese", fontPath);
        doc.font("Chinese");
      }

      const now = new Date();
      const dateStr = `${now.getFullYear()}\u5E74${now.getMonth() + 1}\u6708${now.getDate()}\u65E5`;

      // === 封面 ===
      doc.moveDown(6);
      doc.fontSize(28).fillColor("#1a237e").text("\u5BA2\u6237\u8D44\u4EA7\u5206\u6790\u62A5\u544A", { align: "center" });
      doc.moveDown(1);
      doc.fontSize(14).fillColor("#666").text(`\u5BA2\u6237\uFF1A${customerName}`, { align: "center" });
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor("#999").text(`\u751F\u6210\u65E5\u671F\uFF1A${dateStr}`, { align: "center" });
      doc.moveDown(2);

      // 分隔线
      doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor("#1565c0").lineWidth(1).stroke();
      doc.moveDown(2);

      // === 综合总结 ===
      doc.fontSize(18).fillColor("#1565c0").text("\u4E00\u3001\u62A5\u544A\u603B\u7ED3");
      doc.moveDown(0.5);
      renderMarkdown(doc, summary);

      doc.addPage();

      // === 资产配置分析 ===
      doc.fontSize(18).fillColor("#1565c0").text("\u4E8C\u3001\u8D44\u4EA7\u914D\u7F6E\u5206\u6790");
      doc.moveDown(0.5);
      renderMarkdown(doc, assetAnalysis);

      doc.addPage();

      // === 交易行为分析 ===
      doc.fontSize(18).fillColor("#1565c0").text("\u4E09\u3001\u4EA4\u6613\u884C\u4E3A\u5206\u6790");
      doc.moveDown(0.5);
      renderMarkdown(doc, tradeAnalysis);

      // 免责声明
      doc.moveDown(3);
      doc.fontSize(9).fillColor("#999").text(
        "\u514D\u8D23\u58F0\u660E\uFF1A\u672C\u62A5\u544A\u4EC5\u4F9B\u53C2\u8003\uFF0C\u4E0D\u6784\u6210\u4EFB\u4F55\u6295\u8D44\u5EFA\u8BAE\u3002\u6295\u8D44\u6709\u98CE\u9669\uFF0C\u5165\u5E02\u9700\u8C28\u614E\u3002",
        { align: "center" }
      );

      doc.end();
    } catch (err) {
      console.error("PDF 生成异常:", err);
      reject(err);
    }
  });
}

module.exports = { generatePdf };
