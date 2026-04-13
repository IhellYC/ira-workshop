import axios from 'axios';
import type {
  StockProfile,
  FinancialData,
  HistoryData,
  TechnicalIndicators,
  NewsItem,
} from '../types';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProfile(raw: any): StockProfile {
  return {
    symbol: raw.symbol,
    name: raw.name,
    sector: raw.sector,
    industry: raw.industry,
    marketCap: raw.market_cap ?? raw.marketCap ?? 0,
    currentPrice: raw.current_price ?? raw.currentPrice ?? 0,
    changePercent: raw.change_percent ?? raw.changePercent ?? 0,
    currency: raw.currency,
    description: raw.description,
  };
}

function mapFinancials(raw: any): FinancialData {
  return {
    revenue: raw.revenue,
    netIncome: raw.net_income ?? raw.netIncome ?? [],
    eps: raw.eps,
    peRatio: raw.pe_ratio ?? raw.peRatio ?? null,
    pbRatio: raw.pb_ratio ?? raw.pbRatio ?? null,
    grossMargin: raw.gross_margin ?? raw.grossMargin ?? null,
    profitMargin: raw.profit_margin ?? raw.profitMargin ?? null,
    dates: raw.dates,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getStockProfile(symbol: string): Promise<StockProfile> {
  const { data } = await apiClient.get(`/stock/${symbol}/profile`);
  return mapProfile(data);
}

export async function getFinancials(symbol: string): Promise<FinancialData> {
  const { data } = await apiClient.get(`/stock/${symbol}/financials`);
  return mapFinancials(data);
}

export async function getHistory(symbol: string, period?: string): Promise<HistoryData> {
  const { data } = await apiClient.get<HistoryData>(`/stock/${symbol}/history`, {
    params: period ? { period } : undefined,
  });
  return data;
}

export async function getTechnicalIndicators(symbol: string, period?: string): Promise<TechnicalIndicators> {
  const { data } = await apiClient.get<TechnicalIndicators>(`/technical/${symbol}/indicators`, {
    params: period ? { period } : undefined,
  });
  return data;
}

export async function getStockNews(symbol: string): Promise<NewsItem[]> {
  const { data } = await apiClient.get<{ items: NewsItem[] }>(`/news/${symbol}`);
  return data.items;
}

export async function getMarketNews(): Promise<NewsItem[]> {
  const { data } = await apiClient.get<{ items: NewsItem[] }>('/news/market');
  return data.items;
}
