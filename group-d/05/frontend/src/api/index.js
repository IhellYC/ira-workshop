import axios from 'axios'
import { ElMessage } from 'element-plus'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response?.data?.detail || error.message || '请求失败'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// 基金相关API
export const fundApi = {
  // 获取基金列表
  getList(params = {}) {
    return api.get('/funds/', { params })
  },
  
  // 获取单个基金
  get(id) {
    return api.get(`/funds/${id}`)
  },
  
  // 创建基金
  create(data) {
    return api.post('/funds/', data)
  },
  
  // 更新基金
  update(id, data) {
    return api.put(`/funds/${id}`, data)
  },
  
  // 删除基金
  delete(id) {
    return api.delete(`/funds/${id}`)
  },
  
  // 搜索基金
  search(keyword) {
    return api.get(`/funds/search/${keyword}`)
  },
  
  // 获取基金周报
  getReports(id, params = {}) {
    return api.get(`/funds/${id}/reports`, { params })
  }
}

// 周报相关API
export const reportApi = {
  // 获取周报列表
  getList(params = {}) {
    return api.get('/reports/', { params })
  },
  
  // 获取最新周报
  getLatest(limit = 20) {
    return api.get('/reports/latest', { params: { limit } })
  },
  
  // 获取单个周报
  get(id) {
    return api.get(`/reports/${id}`)
  },
  
  // 创建周报
  create(data) {
    return api.post('/reports/', data)
  },
  
  // 更新周报
  update(id, data) {
    return api.put(`/reports/${id}`, data)
  },
  
  // 删除周报
  delete(id) {
    return api.delete(`/reports/${id}`)
  },
  
  // AI分析周报
  analyze(id) {
    return api.post(`/reports/${id}/analyze`)
  },
  
  // 智能搜索
  search(query, topK = 10) {
    return api.post('/reports/search', { query, top_k: topK })
  },
  
  // 获取仪表盘统计
  getDashboardStats() {
    return api.get('/reports/dashboard/stats')
  }
}

// 健康检查API
export const healthApi = {
  check() {
    return api.get('/health')
  },
  
  detail() {
    return api.get('/health/detail')
  }
}

export default api
