import axios from 'axios';

// Используйте HTTP для локальной разработки
const API_URL = 'https://localhost:7086/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Экспортируем как именованный экспорт
export const warehouseService = {
  getAvailableMaterials: async () => {
    console.log('=== НАЧАЛО ЗАПРОСА К API ===');
    
    try {
      console.log('Попытка запроса к API...');
      
      // Рабочий endpoint
      const response = await api.get('/material');
      
      console.log('✅ API запрос успешен!');
      console.log('Статус:', response.status);
      console.log('Получено материалов:', response.data?.length || 0);
      console.log('Первый материал:', response.data?.[0]);
      
      // Проверяем и форматируем данные
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('API вернул некорректные данные, используем fallback');
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
      
      // Возвращаем качественные тестовые данные для разработки
      console.log('Использую тестовые данные для разработки');
      
      return [
        { 
          id: 1, 
          name: 'Труба 57×3.5', 
          code: 'TP-001', 
          pcs: 150, 
          unit: { 
            id: 1, 
            name: 'шт.', 
            code: 'PCS' 
          }, 
          description: 'Труба стальная 57×3.5, длина 6м',
          parentId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: 2, 
          name: 'Труба 76×4', 
          code: 'TP-002', 
          pcs: 80, 
          unit: { 
            id: 1, 
            name: 'шт.', 
            code: 'PCS' 
          }, 
          description: 'Труба стальная 76×4, длина 6м',
          parentId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: 3, 
          name: 'Труба 89×4', 
          code: 'TP-003', 
          pcs: 45, 
          unit: { 
            id: 1, 
            name: 'шт.', 
            code: 'PCS' 
          }, 
          description: 'Труба стальная 89×4, длина 6м',
          parentId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: 4, 
          name: 'Труба 108×4', 
          code: 'TP-004', 
          pcs: 30, 
          unit: { 
            id: 1, 
            name: 'шт.', 
            code: 'PCS' 
          }, 
          description: 'Труба стальная 108×4, длина 6м',
          parentId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: 5, 
          name: 'Труба 133×4.5', 
          code: 'TP-005', 
          pcs: 25, 
          unit: { 
            id: 1, 
            name: 'шт.', 
            code: 'PCS' 
          }, 
          description: 'Труба стальная 133×4.5, длина 6м',
          parentId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
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
      // Для разработки возвращаем тестовые данные
      return { 
        success: true, 
        registrationId: `REG-${Date.now()}`,
        message: 'Материал зарегистрирован на участке (тестовый режим)'
      };
    }
  },
  
  updateMaterialUnit: async (materialId, unitId, operationId) => {
    try {
      const response = await api.put(`/materials/${materialId}/update-unit`, {
        unitId,
        operationId,
        updatedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating material unit:', error);
      return { success: true };
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      // Тестовый пользователь для разработки
      return {
        id: 1,
        name: 'Оператор Степанов',
        role: 'operator',
        sectionId: 1
      };
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
      // Для разработки возвращаем успех
      return { 
        success: true, 
        message: 'Материал зарезервирован (тестовый режим)',
        reservationCode: `RES-${Date.now()}`
      };
    }
  },
  
  // Запись шага маршрута материала
  logMaterialRouteStep: async (stepData) => {
    try {
      const response = await api.post('/MaterialRouteSteps', stepData);
      return response.data;
    } catch (error) {
      console.error('Error logging material route step:', error);
      // Для разработки возвращаем успех
      return { 
        success: true, 
        stepId: Date.now(),
        message: 'Шаг маршрута записан (тестовый режим)'
      };
    }
  },

  // Получение истории шагов для материала
  getMaterialRouteSteps: async (materialId) => {
    try {
      const response = await api.get(`/MaterialRouteSteps/material/${materialId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching material route steps:', error);
      return [];
    }
  }
};