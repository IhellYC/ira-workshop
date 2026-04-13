/**
 * 数据解析服务 - 解析上传的持仓和交易数据文件
 */
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

function parseFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  let data;

  if (ext === ".csv") {
    const workbook = XLSX.readFile(filePath, { type: "file", codepage: 65001 });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(sheet);
  } else {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(sheet);
  }

  return data;
}

const holdingsColumnMap = {
  证券名称: "name", 证券代码: "code", 持仓数量: "quantity",
  成本价: "cost_price", 现价: "current_price", 市值: "market_value",
  资产类别: "asset_type", 行业: "industry", 浮动盈亏: "pnl", 盈亏比例: "pnl_ratio",
};

const tradesColumnMap = {
  证券名称: "name", 证券代码: "code", 交易方向: "direction", 买卖方向: "direction",
  交易数量: "quantity", 成交数量: "quantity", 成交价格: "price", 交易价格: "price",
  成交金额: "amount", 交易金额: "amount", 交易时间: "trade_time",
  成交时间: "trade_time", 交易日期: "trade_time", 手续费: "commission",
};

function renameColumns(rows, columnMap) {
  return rows.map((row) => {
    const newRow = {};
    for (const [key, value] of Object.entries(row)) {
      let mapped = false;
      for (const [cn, en] of Object.entries(columnMap)) {
        if (key.includes(cn)) {
          newRow[en] = value;
          mapped = true;
          break;
        }
      }
      if (!mapped) newRow[key] = value;
    }
    return newRow;
  });
}

function parseHoldings(filePath) {
  let rows = parseFile(filePath);
  rows = renameColumns(rows, holdingsColumnMap);

  // 计算衍生字段
  rows = rows.map((r) => {
    if (!r.market_value && r.quantity && r.current_price) {
      r.market_value = r.quantity * r.current_price;
    }
    if (!r.pnl && r.quantity && r.cost_price && r.current_price) {
      r.pnl = r.quantity * (r.current_price - r.cost_price);
    }
    if (!r.pnl_ratio && r.cost_price && r.current_price) {
      r.pnl_ratio = (((r.current_price - r.cost_price) / r.cost_price) * 100).toFixed(2);
    }
    return r;
  });

  // 格式化为文本
  let text = "## 持仓数据\n\n";
  if (rows.length > 0) {
    const headers = Object.keys(rows[0]);
    text += headers.join(" | ") + "\n";
    text += headers.map(() => "---").join(" | ") + "\n";
    rows.forEach((r) => {
      text += headers.map((h) => r[h] ?? "").join(" | ") + "\n";
    });
    const total = rows.reduce((s, r) => s + (Number(r.market_value) || 0), 0);
    if (total > 0) text += `\n总市值: ${total.toLocaleString()}`;
  }

  return { data: rows, text };
}

function parseTrades(filePath) {
  let rows = parseFile(filePath);
  rows = renameColumns(rows, tradesColumnMap);

  rows = rows.map((r) => {
    if (!r.amount && r.quantity && r.price) {
      r.amount = r.quantity * r.price;
    }
    return r;
  });

  let text = "## 交易记录数据\n\n";
  if (rows.length > 0) {
    const headers = Object.keys(rows[0]);
    text += headers.join(" | ") + "\n";
    text += headers.map(() => "---").join(" | ") + "\n";
    rows.forEach((r) => {
      text += headers.map((h) => r[h] ?? "").join(" | ") + "\n";
    });
    text += `\n总交易笔数: ${rows.length}`;
  }

  return { data: rows, text };
}

module.exports = { parseHoldings, parseTrades };
