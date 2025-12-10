// src/pages/production/data/sectionsData.js
export const sectionsData = {
  // УТО участки
  uto1: {
    id: 'uto1',
    name: 'УТО1',
    description: 'Узел транспортного оборудования 1',
    type: 'uto',
    color: '#3b82f6',
    status: 'active',
    capacity: 150,
    currentLoad: 85,
    efficiency: 92,
    
    // Карманы
    loadingPocket: [
      { id: 1, material: 'Труба 57х3.5', code: 'TP-001', quantity: 50, unit: 'шт', status: 'active' },
      { id: 2, material: 'Труба 76х4', code: 'TP-002', quantity: 30, unit: 'шт', status: 'active' },
    ],
    outputPocket: [
      { id: 1, material: 'Готовые узлы', code: 'GN-001', quantity: 15, unit: 'шт', status: 'ready' },
    ],
    defectPocket: [
      { id: 1, material: 'Труба 108х4', code: 'TP-004', quantity: 2, unit: 'шт', reason: 'Коррозия' },
    ],
  },
  
  uto2: {
    id: 'uto2',
    name: 'УТО2',
    description: 'Узел транспортного оборудования 2',
    type: 'uto',
    color: '#10b981',
    status: 'active',
    capacity: 120,
    currentLoad: 78,
    efficiency: 88,
    
    loadingPocket: [
      { id: 1, material: 'Труба 89х4', code: 'TP-003', quantity: 40, unit: 'шт', status: 'active' },
    ],
    outputPocket: [
      { id: 1, material: 'Готовые изделия', code: 'GN-002', quantity: 22, unit: 'шт', status: 'ready' },
    ],
    defectPocket: [
      { id: 1, material: 'Труба 76х4', code: 'TP-002', quantity: 3, unit: 'шт', reason: 'Трещина' },
    ],
  },
};

export const sectionTypes = {
  uto: { name: 'УТО', color: '#3b82f6' },
  loading: { name: 'Загрузка', color: '#f59e0b' },
  sorting: { name: 'Сортировка', color: '#ef4444' },
  packing: { name: 'Упаковка', color: '#84cc16' },
  nmk: { name: 'НМК', color: '#f97316' },
};