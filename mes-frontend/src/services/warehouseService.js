import axios from 'axios';

const API_URL = 'https://localhost:7086/api';
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const warehouseService = {
  getAvailableMaterials: async () => {
    console.log('=== НАЧАЛО ЗАПРОСА К API ===');
    
    try {
      console.log('Попытка запроса к API...');
      const response = await api.get('/material');
      
      console.log('✅ API запрос успешен!');
      console.log('Статус:', response.status);
      console.log('Получено материалов:', response.data?.length || 0);
      console.log('Первый материал:', response.data?.[0]);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Некорректный формат данных от API');
      }
      
      return response.data;
      
    } catch (error) {
      console.error('=== ОШИБКА API ===');
      console.error('Сообщение:', error.message);
      console.error('URL:', error.config?.url);
      console.error('Метод:', error.config?.method);
      console.error('Статус:', error.response?.status);
      console.error('Данные ошибки:', error.response?.data);
      
      // Пробрасываем ошибку дальше вместо возврата тестовых данных
      throw new Error(`Ошибка загрузки материалов: ${error.message}`);
    } finally {
      console.log('=== ЗАВЕРШЕНИЕ ЗАПРОСА ===');
    }
  },

  registerMaterialOnSection: async (materialId, quantity, sectionId, userId) => {
    try {
      const response = await api.post('/warehouse/material-registration', {
        materialId,
        quantity,
        sectionId,
        userId,
        registrationDate: new Date().toISOString(),
        status: 'registered'
      });
      return response.data;
    } catch (error) {
      console.error('Error registering material:', error);
      throw error; // Пробрасываем реальную ошибку
    }
  },
  
  updateMaterial: async (materialId, updateData) => {
    try {
	  console.log('📤 Данные для обновления материала:', updateData);
      console.log('📋 Строковый JSON:', JSON.stringify(updateData, null, 2));
      console.log('🔢 Material ID:', materialId);	
	  
      const response = await api.put(`/Material/${materialId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating material:', error);
      throw error; // Пробрасываем реальную ошибку
    }
  },
  
  getCurrentUser: async () => {
    throw new Error('Метод getCurrentUser временно отключен');
	try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error; // Пробрасываем реальную ошибку
    }
  },
  
  getMaterialById: async (id) => {
    try {
      const response = await api.get(`/materials/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching material ${id}:`, error);
      throw error;
    }
  },

  reserveMaterial: async (materialId, quantity, sectionId) => {
    try {
      const response = await api.post(`/warehouse/materials/${materialId}/reserve`, {
        quantity,
        sectionId
      });
      return response.data;
    } catch (error) {
      console.error('Error reserving material:', error);
      throw error; // Пробрасываем реальную ошибку
    }
  },
  
  logMaterialRouteStep: async (stepData) => {
    try {
      console.log('Отправляем шаг маршрута:', stepData);
	  console.log('📤 Данные для шага маршрута:', stepData);
      console.log('📋 Строковый JSON:', JSON.stringify(stepData, null, 2));      
      const response = await api.post('/MaterialRouteSteps', stepData);
      return response.data;
    } catch (error) {
      console.error('Ошибка записи шага:', error);
      throw error; // Пробрасываем реальную ошибку
    }
  },

  getMaterialRouteSteps: async (materialId) => {
    try {
      const response = await api.get(`/MaterialRouteSteps/material/${materialId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching material route steps:', error);
      throw error; // Пробрасываем реальную ошибку
    }
  }
};