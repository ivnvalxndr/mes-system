import axios from 'axios'

// API Gateway URL
const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Интерцептор для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mes_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mes_token')
      localStorage.removeItem('mes_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),  
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
}

// Production API
export const productionAPI = {
  getOrders: () => api.get('/production/orders'),
  createOrder: (order) => api.post('/production/orders', order),
  getOrder: (id) => api.get(`/production/orders/${id}`),
  updateOrderStatus: (id, status) => 
    api.put(`/production/orders/${id}/status`, status),
}

// Materials API
export const materialsAPI = {
  getMaterials: () => api.get('/materials'),
  createMaterial: (material) => api.post('/materials', material),
  addRouteStep: (step) => api.post('/materials/routes', step),
  getMaterialRoute: (id) => api.get(`/materials/${id}/route`),
}

// Units API
export const unitsAPI = {
  getUnits: () => api.get('/units'),
  getUnitStatus: (id) => api.get(`/units/${id}/status`),
  updateUnitStatus: (id, statusData) => 
    api.put(`/units/${id}/status`, statusData),
}

// Reports API
export const reportsAPI = {
  getKPI: () => api.get('/reports/kpi'),
  getProductionStats: (startDate, endDate) => 
    api.get('/reports/production-stats', { params: { startDate, endDate } }),
  getMaterialUsage: () => api.get('/reports/material-usage'),
  getUnitPerformance: () => api.get('/reports/unit-performance'),
}

export default api