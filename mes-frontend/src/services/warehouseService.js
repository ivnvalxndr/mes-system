import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const warehouseService = {
  // Получить доступные материалы со склада
  getAvailableMaterials: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/warehouse/materials`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching warehouse materials:', error);
      throw error;
    }
  },

  // Зарезервировать материал на складе
  reserveMaterial: async (materialId, quantity, sectionId) => {
    try {
      const response = await axios.post(`${API_URL}/warehouse/reserve`, {
        materialId,
        quantity,
        sectionId,
        reserveDate: new Date()
      });
      return response.data;
    } catch (error) {
      console.error('Error reserving material:', error);
      throw error;
    }
  },

  // Список типов материалов для фильтров
  getMaterialTypes: async () => {
    try {
      const response = await axios.get(`${API_URL}/warehouse/material-types`);
      return response.data;
    } catch (error) {
      console.error('Error fetching material types:', error);
      throw error;
    }
  }
};