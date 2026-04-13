/**
 * 分析相关 API 路由
 */
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { parseHoldings, parseTrades } = require("../services/dataParser");
const { runFullAnalysis } = require("../services/analyzer");
const { generatePdf } = require("../services/pdfGenerator");

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "..", "app", "uploads");
const REPORT_DIR = path.join(__dirname, "..", "app", "reports");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(REPORT_DIR, { recursive: true });

// multer 配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const taskId = req._taskId || uuidv4().slice(0, 8);
    req._taskId = taskId;
    const prefix = file.fieldname === "holdings_file" ? "holdings" : "trades";
    const ext = path.extname(file.originalname);
    cb(null, `${taskId}_${prefix}${ext}`);
  },
});
const upload = multer({ storage });

// 内存存储任务状态
const tasks = {};

// POST /api/upload
router.post(
  "/upload",
  upload.fields([
    { name: "holdings_file", maxCount: 1 },
    { name: "trades_file", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const taskId = req._taskId || uuidv4().slice(0, 8);
      const customerName = req.body.customer_name || "客户";

      if (!req.files || !req.files.holdings_file) {
        return res.status(400).json({ detail: "请上传持仓数据文件" });
      }

      const holdingsPath = req.files.holdings_file[0].path;
      const { data: holdingsData, text: holdingsText } = parseHoldings(holdingsPath);
      const holdingsPreview = holdingsData.slice(0, 10);

      let tradesPreview = null;
      let tradesText = "";
      let tradesPath = null;
      if (req.files.trades_file) {
        tradesPath = req.files.trades_file[0].path;
        const { data: tradesData, text: tText } = parseTrades(tradesPath);
        tradesPreview = tradesData.slice(0, 10);
        tradesText = tText;
      }

      tasks[taskId] = {
        task_id: taskId,
        customer_name: customerName,
        status: "pending",
        holdings_path: holdingsPath,
        trades_path: tradesPath,
        holdings_text: holdingsText,
        trades_text: tradesText,
        result: null,
        pdf_path: null,
      };

      res.json({
        task_id: taskId,
        customer_name: customerName,
        holdings_preview: holdingsPreview,
        trades_preview: tradesPreview,
        message: "文件上传成功",
      });
    } catch (err) {
      console.error("上传失败:", err);
      res.status(400).json({ detail: `文件解析失败: ${err.message}` });
    }
  }
);

// POST /api/analyze
router.post("/analyze", async (req, res) => {
  const taskId = req.body.task_id;
  try {
    const task = tasks[taskId];
    if (!task) return res.status(404).json({ detail: "任务不存在" });

    if (req.body.customer_name) task.customer_name = req.body.customer_name;
    task.status = "analyzing";

    const holdingsText = task.holdings_text;
    const tradesText = task.trades_text || "暂无交易记录数据";

    const result = await runFullAnalysis(holdingsText, tradesText, task.customer_name);

    console.log("分析结果:", {
      asset_len: result.asset_analysis?.length || 0,
      trade_len: result.trade_analysis?.length || 0,
      summary_len: result.summary?.length || 0,
    });

    const pdfPath = await generatePdf(
      taskId,
      task.customer_name,
      result.asset_analysis,
      result.trade_analysis,
      result.summary,
      REPORT_DIR
    );

    task.status = "completed";
    task.result = result;
    task.pdf_path = pdfPath;

    res.json({
      task_id: taskId,
      status: "completed",
      asset_analysis: result.asset_analysis,
      trade_analysis: result.trade_analysis,
      summary: result.summary,
    });
  } catch (err) {
    console.error("分析失败:", err);
    if (taskId && tasks[taskId]) tasks[taskId].status = "failed";
    res.status(500).json({ detail: `分析失败: ${err.message}` });
  }
});

// GET /api/report/:taskId/pdf
router.get("/report/:taskId/pdf", (req, res) => {
  const task = tasks[req.params.taskId];
  if (!task) return res.status(404).json({ detail: "任务不存在" });
  if (!task.pdf_path || !fs.existsSync(task.pdf_path)) {
    return res.status(404).json({ detail: "报告尚未生成" });
  }

  const filename = encodeURIComponent(`资产分析报告_${task.customer_name}_${task.task_id}.pdf`);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${filename}`);
  fs.createReadStream(task.pdf_path).pipe(res);
});

// POST /api/analyze/:taskId/regenerate
router.post("/analyze/:taskId/regenerate", async (req, res) => {
  try {
    const task = tasks[req.params.taskId];
    if (!task) return res.status(404).json({ detail: "任务不存在" });

    const feedback = req.body.feedback;
    if (!feedback) return res.status(400).json({ detail: "请提供反馈意见" });

    task.status = "analyzing";

    const holdingsText = task.holdings_text;
    const tradesText = task.trades_text || "暂无交易记录数据";

    const result = await runFullAnalysis(holdingsText, tradesText, task.customer_name, feedback);

    const pdfPath = await generatePdf(
      req.params.taskId,
      task.customer_name,
      result.asset_analysis,
      result.trade_analysis,
      result.summary,
      REPORT_DIR
    );

    task.status = "completed";
    task.result = result;
    task.pdf_path = pdfPath;

    res.json({
      task_id: req.params.taskId,
      status: "completed",
      asset_analysis: result.asset_analysis,
      trade_analysis: result.trade_analysis,
      summary: result.summary,
    });
  } catch (err) {
    console.error("重新生成失败:", err);
    res.status(500).json({ detail: `重新生成失败: ${err.message}` });
  }
});

// GET /api/task/:taskId
router.get("/task/:taskId", (req, res) => {
  const task = tasks[req.params.taskId];
  if (!task) return res.status(404).json({ detail: "任务不存在" });

  const response = {
    task_id: task.task_id,
    status: task.status,
    customer_name: task.customer_name,
  };
  if (task.result) Object.assign(response, task.result);
  res.json(response);
});

module.exports = router;
