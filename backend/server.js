const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const analysisRouter = require("./routes/analysis");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 确保目录存在
const UPLOAD_DIR = path.join(__dirname, "app", "uploads");
const REPORT_DIR = path.join(__dirname, "app", "reports");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(REPORT_DIR, { recursive: true });

app.use("/api", analysisRouter);

app.listen(PORT, () => {
  console.log(`后端服务已启动: http://localhost:${PORT}`);
});
