import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем interceptor для JWT токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API для материалов
export const materialApi = {
  getAll: () => api.get('/materials').then(res => res.data),
  getById: (id) => api.get(`/materials/${id}`).then(res => res.data),
  create: (data) => api.post('/materials', data).then(res => res.data),
  update: (id, data) => api.put(`/materials/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/materials/${id}`),
};

// API для единиц измерения
export const unitsApi = {
  getAll: () => api.get('/units').then(res => res.data),
  getById: (id) => api.get(`/units/${id}`).then(res => res.data),
  create: (data) => api.post('/units', data).then(res => res.data),
};

// API для шагов маршрута материалов
export const materialRouteStepsApi = {
  getByMaterialId: (materialId) => 
    api.get(`/materials/${materialId}/materialroutesteps`).then(res => res.data),
  create: (materialId, data) => 
    api.post(`/materials/${materialId}/materialroutesteps`, data).then(res => res.data),
  delete: (materialId, stepId) => 
    api.delete(`/materials/${materialId}/materialroutesteps/${stepId}`),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
  register: (userData) => api.post('/auth/register', userData).then(res => res.data),
};

export default api;