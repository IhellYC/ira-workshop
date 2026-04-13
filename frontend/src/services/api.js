import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 300000, // 5分钟超时，分析可能耗时较长
});

export async function uploadFiles(holdingsFile, tradesFile, customerName) {
  const formData = new FormData();
  formData.append('holdings_file', holdingsFile);
  if (tradesFile) {
    formData.append('trades_file', tradesFile);
  }
  formData.append('customer_name', customerName || '客户');
  const res = await api.post('/upload', formData);
  return res.data;
}

export async function startAnalysis(taskId, customerName) {
  const res = await api.post('/analyze', { task_id: taskId, customer_name: customerName });
  return res.data;
}

export async function regenerateAnalysis(taskId, feedback) {
  const res = await api.post(`/analyze/${taskId}/regenerate`, { feedback });
  return res.data;
}

export function getPdfDownloadUrl(taskId) {
  return `${API_BASE}/report/${taskId}/pdf`;
}

export async function getTaskStatus(taskId) {
  const res = await api.get(`/task/${taskId}`);
  return res.data;
}

export default api;
