export interface StockProfile {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  currentPrice: number;
  changePercent: number;
  currency: string;
  description: string;
}

export interface FinancialData {
  revenue: number[];
  netIncome: number[];
  eps: number[];
  peRatio: number | null;
  pbRatio: number | null;
  grossMargin: number | null;
  profitMargin: number | null;
  dates: string[];
}

export interface HistoryData {
  dates: string[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
}

export interface TechnicalIndicators {
  dates: string[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
  ma5: (number | null)[];
  ma10: (number | null)[];
  ma20: (number | null)[];
  ma60: (number | null)[];
  macd: number[];
  macdSignal: number[];
  macdHist: number[];
  kdjK: number[];
  kdjD: number[];
  kdjJ: number[];
  rsi: (number | null)[];
  bollUpper: (number | null)[];
  bollMid: (number | null)[];
  bollLower: (number | null)[];
}

export interface NewsItem {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  thumbnail?: string;
  summary?: string;
}
