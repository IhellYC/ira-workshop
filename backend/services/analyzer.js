/**
 * 分析引擎 - 调用 Anthropic 兼容 API 进行资产分析
 */
const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

const SKILLS_DIR = path.join(__dirname, "..", "app", "skills");

const API_KEY = "sk-cp-Ky8-iKvBLG2Ot8YEIEKhn0_OeqEgedkr7JljIl36E5NIQeM8sA6Bku3gDBjNrLa4XimgzQHFoSnTdDNwYIlPZcYcVFx_tK4NA-Xp9WAQF94i5ihJORjDebg";
const BASE_URL = "https://api.minimaxi.com/anthropic";
const MODEL = "MiniMax-M2.7";

function loadSkill(skillName) {
  const filePath = path.join(SKILLS_DIR, `${skillName}.md`);
  return fs.readFileSync(filePath, "utf-8");
}

function getClient() {
  return new Anthropic({
    apiKey: API_KEY,
    baseURL: BASE_URL,
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callLLM(systemPrompt, userPrompt, maxRetries = 10) {
  const client = getClient();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          { role: "user", content: userPrompt },
        ],
      });
      console.log("API 响应结构:", JSON.stringify({
        stopReason: response.stop_reason,
        hasContent: !!response.content,
        contentLength: response.content?.length,
        contentTypes: response.content?.map(c => c.type),
      }));
      
      // MiniMax 返回的是 thinking 类型，需要查找 text 类型的内容
      const textContent = response.content?.find(c => c.type === "text");
      const result = textContent?.text;
      
      if (!result || result.trim().length === 0) {
        console.log(`API 返回空内容，内容类型: ${response.content?.map(c => c.type).join(", ")}`);
        throw new Error("API 返回空内容");
      }
      return result;
    } catch (err) {
      const status = err.status || err.statusCode || (err.error && err.error.status);
      const isRetryable = status === 529 || status === 503 || status === 429 || err.message === "API 返回空内容";
      if (isRetryable && attempt < maxRetries) {
        // 基础间隔5秒，加随机抖动，最长60秒
        const baseDelay = 5000 * Math.pow(1.5, attempt - 1);
        const jitter = Math.random() * 3000;
        const delay = Math.min(baseDelay + jitter, 60000);
        console.log(`第${attempt}/${maxRetries}次重试，${(delay / 1000).toFixed(1)}秒后重试... 原因: ${err.message || status}`);
        await sleep(delay);
      } else {
        throw err;
      }
    }
  }
  throw new Error("大模型 API 调用失败，已达最大重试次数");
}

async function analyzeAssets(holdingsText, feedback) {
  const skill = loadSkill("asset_analysis");
  let userPrompt = `请分析以下客户持仓数据：\n\n${holdingsText}`;
  if (feedback) {
    userPrompt += `\n\n客户经理反馈意见（请据此调整分析）：\n${feedback}`;
  }
  return callLLM(skill, userPrompt);
}

async function analyzeTrades(tradesText, feedback) {
  const skill = loadSkill("trade_behavior");
  let userPrompt = `请分析以下客户交易记录：\n\n${tradesText}`;
  if (feedback) {
    userPrompt += `\n\n客户经理反馈意见（请据此调整分析）：\n${feedback}`;
  }
  return callLLM(skill, userPrompt);
}

async function generateSummary(assetAnalysis, tradeAnalysis, customerName, feedback) {
  const skill = loadSkill("report_template");
  let userPrompt =
    `客户名称：${customerName}\n\n` +
    `## 资产配置分析结果\n\n${assetAnalysis}\n\n` +
    `## 交易行为分析结果\n\n${tradeAnalysis}`;
  if (feedback) {
    userPrompt += `\n\n客户经理反馈意见（请据此调整报告）：\n${feedback}`;
  }
  return callLLM(skill, userPrompt);
}

async function runFullAnalysis(holdingsText, tradesText, customerName = "客户", feedback = null) {
  const assetResult = await analyzeAssets(holdingsText, feedback);
  const tradeResult = await analyzeTrades(tradesText, feedback);
  const summary = await generateSummary(assetResult, tradeResult, customerName, feedback);

  return {
    asset_analysis: assetResult,
    trade_analysis: tradeResult,
    summary,
  };
}

module.exports = { runFullAnalysis };
