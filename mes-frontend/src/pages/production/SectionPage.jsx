import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { warehouseService } from '../../services/warehouseService.js';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Slider
} from '@mui/material';
import {
  ArrowBack,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle,
  Warning,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  Refresh as RefreshIcon,
  History,
  Check as CheckIcon
} from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';

// Компонент карточки трубы с поддержкой выбора
function PipeCard({ pipe, onDelete, isSelected, onSelect }) {
  // Функция для преобразования unitId в название участка
  const getSectionName = (unitId) => {
    // Здесь логика преобразования ID участка в название    
    switch(unitId) {
      case 3:
        return 'Загрузка труб';
      case 7:
        return 'Сортировка';
      case 9:
        return 'Упаковка';
      case 4:
        return 'ОТК';
      case 5:
        return 'НМК';
      default:
        return 'Неизвестный участок';
    }
  };

  // Получаем название участка
  const sectionName = pipe.unitId ? `Участок #${pipe.unitId}` : 'Не указан';

  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        position: 'relative',
        '&:hover': {
          boxShadow: 3
        }
      }}
      onClick={() => onSelect(pipe)}
    >
      {isSelected && (
        <Box sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'primary.main',
          borderRadius: '50%',
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CheckIcon sx={{ color: 'white', fontSize: 16 }} />
        </Box>
      )}
      
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {pipe.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Код: {pipe.code}
            </Typography>
            {/* Добавляем отображение участка в заголовке */}
            <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>
              {sectionName}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(pipe.id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
        
        {pipe.diameter > 0 && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Размер: Ø{pipe.diameter}мм × {pipe.thickness}мм
          </Typography>
        )}
        
        {pipe.length && (
          <Typography variant="body2">
            Длина: {pipe.length}м
          </Typography>
        )}
        
        {pipe.material && (
          <Typography variant="body2">
            Материал: {pipe.material}
          </Typography>
        )}
        
        <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
          {pipe.quantity} {pipe.unit || 'шт.'}
        </Typography>
        
        {/* Информация о регистрации */}
        {pipe.registrationDate && (
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed #ddd' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Поступил: {new Date(pipe.registrationDate).toLocaleDateString()}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Участок: {sectionName} {/* Используем вычисленное название */}
            </Typography>
            {pipe.registeredBy && (
              <Typography variant="caption" color="text.secondary" display="block">
                Принял: {pipe.registeredBy}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ДИАЛОГ ВЫБОРА МАТЕРИАЛОВ СО СКЛАДА
function WarehouseDialog({ open, onClose, onSelectMaterial }) {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  useEffect(() => {
    if (open) {
      fetchMaterials();
    } else {
      setMaterials([]);
      setFilteredMaterials([]);
      setSearch('');
    }
  }, [open]);
  
  const fetchMaterials = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Загрузка материалов...');
      const apiMaterials = await warehouseService.getAvailableMaterials();
      console.log('Сырые данные API:', apiMaterials);
      
      const formattedMaterials = apiMaterials.map(item => {
        const description = item.description || '';
        let specifications = {};
        
        const diameterMatch = description.match(/(\d+)[×x](\d+(?:\.\d+)?)/) || 
                             item.name?.match(/(\d+)[×x](\d+(?:\.\d+)?)/);
        
        const lengthMatch = description.match(/(\d+)\s*м/) || 
                           description.match(/длина\s*[=:]?\s*(\d+)/i);
        
        if (diameterMatch) {
          specifications.diameter = parseInt(diameterMatch[1]);
          specifications.thickness = parseFloat(diameterMatch[2]);
        }
        
        if (lengthMatch) {
          specifications.length = parseInt(lengthMatch[1]);
        }
        
        let unitText = 'шт.';
        if (item.unit) {
          if (typeof item.unit === 'string') {
            unitText = item.unit;
          } else if (typeof item.unit === 'object') {
            unitText = item.unit.name || item.unit.code || 'шт.';
          }
        }
        
        return {
          id: item.id,
          name: item.name,
          code: item.code?.toString() || `MAT-${item.id}`,
          type: item.parentId ? 'Деталь' : 'Материал',
          quantity: item.pcs || item.quantity || 0,
          unit: unitText,
          description: description,
          specifications: specifications,
          rawData: item
        };
      });
      
      console.log('Отформатированные материалы:', formattedMaterials);
      setMaterials(formattedMaterials);
      setFilteredMaterials(formattedMaterials);
      
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setError(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      const filtered = materials.filter(material =>
        material.name.toLowerCase().includes(search.toLowerCase()) ||
        material.code.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredMaterials(filtered);
    } else {
      setFilteredMaterials(materials);
    }
    setPage(0);
  }, [search, materials]);

  const handleSelect = (material) => {
    onSelectMaterial(material);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <InventoryIcon sx={{ mr: 1 }} />
          Выберите материал со склада
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <TextField
            fullWidth
            placeholder="Поиск по названию или коду..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Код</TableCell>
                      <TableCell>Наименование</TableCell>
                      <TableCell>Характеристики</TableCell>
                      <TableCell align="right">Доступно</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredMaterials.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">
                            Материалы не найдены
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMaterials
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((material) => (
                          <TableRow key={material.id} hover>
                            <TableCell>
                              <Chip label={material.code} size="small" />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {material.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {material.type}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {material.specifications?.diameter && (
                                <Typography variant="body2">
                                  Ø {material.specifications.diameter}мм
                                </Typography>
                              )}
                              {material.specifications?.thickness && (
                                <Typography variant="body2">
                                  Толщ.: {material.specifications.thickness}мм
                                </Typography>
                              )}
                              {material.specifications?.length && (
                                <Typography variant="body2">
                                  Длина: {material.specifications.length}м
                                </Typography>
                              )}
                              {!material.specifications?.diameter && material.description && (
                                <Typography variant="caption" color="text.secondary">
                                  {material.description.substring(0, 50)}
                                  {material.description.length > 50 ? '...' : ''}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body1"
                                fontWeight="bold"
                                color={material.quantity > 0 ? 'success.main' : 'error.main'}
                              >
                                {material.quantity}
                              </Typography>
                              <Typography variant="caption">
                                {typeof material.unit === 'string' 
                                  ? material.unit 
                                  : (material.unit?.name || material.unit?.code || 'шт.')}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleSelect(material)}
                                disabled={material.quantity <= 0}
                              >
                                Выбрать
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredMaterials.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button 
          onClick={() => {
            fetchMaterials();
          }} 
          variant="contained"
          startIcon={<RefreshIcon />}
        >
          Обновить список
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ДИАЛОГ УКАЗАНИЯ КОЛИЧЕСТВА
function QuantityDialog({ open, onClose, material, onConfirm }) {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && material) {
      setQuantity(1);
      setError('');
    }
  }, [open, material]);

  const handleSubmit = () => {
    if (quantity <= 0) {
      setError('Количество должно быть больше 0');
      return;
    }
    
    if (quantity > material.quantity) {
      setError(`Максимально доступно: ${material.quantity}`);
      return;
    }

    onConfirm(material, quantity);
    onClose();
  };

  const handleSliderChange = (event, newValue) => {
    setQuantity(newValue);
  };

  const handleInputChange = (event) => {
    const value = Math.max(1, parseInt(event.target.value) || 1);
    setQuantity(Math.min(value, material.quantity));
  };

  if (!material) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Укажите количество</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, minWidth: 300 }}>
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {material.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Код: {material.code}
            </Typography>
            <Typography variant="body2">
              Доступно на складе: {material.quantity} {material.unit}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              Количество: {quantity} {material.unit}
            </Typography>
            <Slider
              value={quantity}
              onChange={handleSliderChange}
              aria-labelledby="quantity-slider"
              min={1}
              max={material.quantity}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Количество"
              type="number"
              value={quantity}
              onChange={handleInputChange}
              InputProps={{
                inputProps: { 
                  min: 1, 
                  max: material.quantity,
                  step: 1
                }
              }}
              fullWidth
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Отмена
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={quantity <= 0 || quantity > material.quantity}
        >
          Добавить ({quantity} шт.)
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ДИАЛОГ ИСТОРИИ ОПЕРАЦИЙ ДЛЯ ВЫБРАННОГО МАТЕРИАЛА
function MaterialHistoryDialog({ open, onClose, material, operations, loading }) {
  // Определяем заголовок в зависимости от наличия данных
  const getOperationTitle = (operationType) => {
    switch(operationType) {
      case 'REGISTRATION': return 'Регистрация на участке';
      case 'MOVE_TO_OUTPUT': return 'Начало обработки';
      case 'MOVE_TO_DEFECT': return 'Перемещение в брак';
      default: return operationType;
    }
  };

  const getOperationColor = (operationType) => {
    switch(operationType) {
      case 'REGISTRATION': return 'primary';
      case 'MOVE_TO_OUTPUT': return 'success';
      case 'MOVE_TO_DEFECT': return 'error';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">История операций</Typography>
            {material && (
              <Typography variant="subtitle1" color="primary">
                {material.name} ({material.code})
                {material.warehouseMaterialId && ` • ID: ${material.warehouseMaterialId}`}
              </Typography>
            )}
          </Box>
          <Chip 
            label={`${operations.length} операций`} 
            size="small" 
            color="primary"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Загрузка истории...</Typography>
          </Box>
        ) : !material ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Материал не выбран
            </Typography>
          </Box>
        ) : operations.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Нет операций для этого материала
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Дата и время</TableCell>
                  <TableCell>Операция</TableCell>
                  <TableCell>Откуда</TableCell>
                  <TableCell>Куда</TableCell>
                  <TableCell>Кол-во</TableCell>
                  <TableCell>Оператор</TableCell>
                  <TableCell>Статус</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {operations.map((op) => (
                  <TableRow key={op.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(op.timestamp).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(op.timestamp).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getOperationTitle(op.operationType)}
                        size="small" 
                        color={getOperationColor(op.operationType)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {op.fromLocation || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {op.toLocation || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {op.quantity || op.pcs || 0} шт.
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {op.operatorName || op.userName || '-'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={op.status === 'success' ? '✅ Успешно' : '❌ Ошибка'}
                        size="small"
                        color={op.status === 'success' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Главный компонент страницы участка
function SectionPage() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  
  // Начальные данные труб
  const USE_MOCK_DATA = false;

  const [pipes, setPipes] = useState(() => {
  if (USE_MOCK_DATA) {
    // Тестовые данные
    return {
      loading: [
        { id: 1, name: 'Труба 57×3.5', code: 'TP-001', diameter: 57, thickness: 3.5, length: 6, material: 'Сталь', quantity: 50 },
        // ... остальные тестовые данные
      ],
      output: [
        { id: 4, name: 'Готовые узлы', code: 'GN-001', diameter: 57, thickness: 3.5, length: 6, material: 'Сталь', quantity: 15 },
      ],
      defect: [
        { id: 5, name: 'Труба 108×4', code: 'TP-004', diameter: 108, thickness: 4, length: 6, material: 'Сталь', quantity: 2 },
      ],
    };
  }
  
  // Реальные данные - пустые массивы
  return {
    loading: [],
    output: [],
    defect: [],
  };
  });
  
   // Функция для получения названия участка по sectionId
  const getSectionDisplayName = (id) => {
    const sectionNames = {
      'loading1': 'Загрузка труб',
      'sorting1': 'Сортировка',
      'packing1': 'Упаковка',
      'nmk1': 'НМК'
    };
    
    return sectionNames[id] || `Участок ${id.toUpperCase()}`;
  };
  
  // Получаем отображаемое название
  const sectionDisplayName = getSectionDisplayName(sectionId);
  
  
  
  const sectionToUnitId = {
  // URL sectionId → unitId в базе
  'loading1': 1,      // Загрузка труб
  'sorting1': 6,      // Сортировка
  'packing1': 3,      // Упаковка
  'nmk1': 5          // НМК
  };

// Получаем unitId текущего участка
const currentUnitId = sectionToUnitId[sectionId] || 0;
console.log('Текущий участок:', sectionId, '→ unitId:', currentUnitId);
  
  useEffect(() => {
  const debugData = async () => {
    const materials = await warehouseService.getAvailableMaterials();
    console.log('Все материалы с API:', materials);
    console.log('Первый материал структура:', materials[0]);
    console.log('Ключи первого материала:', Object.keys(materials[0]));
    console.log('Текущий sectionId:', sectionId);
  };
  debugData();
  }, [sectionId]);
  
  // useEffect ДЛЯ ЗАГРУЗКИ ДАННЫХ УЧАСТКА:
  useEffect(() => {
  const loadSectionData = async () => {
    try {
      const materials = await warehouseService.getAvailableMaterials();
      const currentUnitId = sectionToUnitId[sectionId];
      
      console.log('=== ЗАГРУЗКА ДАННЫХ ДЛЯ УЧАСТКА ===');
      console.log('Текущий участок:', sectionId, '→ unitId:', currentUnitId);
      console.log('Всего материалов с API:', materials.length);
      
      // 1. Проверяем, какие unitId у материалов
      const materialsAnalysis = materials.map(m => ({
        code: m.code,
        unitId: m.unitId,
        hasUnit: !!m.unitId,
        rawUnitId: m.unitId
      }));
      
      console.log('Анализ unitId материалов:', materialsAnalysis);
      
      // 2. Если все unitId null, добавляем тестовые
      const allNull = materials.every(m => m.unitId == null);
      console.log('Все материалы имеют unitId null?:', allNull);
      
      const materialsWithFixedUnitId = materials.map(material => {
      // Если unitId отсутствует, используем текущий участок для разработки
      const fixedUnitId = material.unitId || currentUnitId;
        
        return {
          id: material.id,
          name: material.name,
          code: material.code,
          diameter: 0,
          thickness: 0,
          length: 6,
          material: 'Сталь',
          quantity: material.pcs || 0 || 'шт.',          
          unitId: fixedUnitId,
          warehouseMaterialId: material.id,
          registrationDate: new Date().toISOString(),
          registeredBy: 'Оператор Степанов'
        };
      });
      
      // 3. Фильтруем по текущему участку
      const filteredMaterials = materialsWithFixedUnitId.filter(
        material => material.unitId === currentUnitId
      );
      
      console.log(`На участке ${sectionId} найдено материалов:`, filteredMaterials.length);
      console.log('Отфильтрованные материалы:', filteredMaterials);
      
      // 4. Если нет материалов, добавляем первый для тестирования
      let finalMaterials = filteredMaterials;
      if (filteredMaterials.length === 0 && materialsWithFixedUnitId.length > 0) {
        console.warn('⚠️ На участке нет материалов, показываем тестовый');
        const testMaterial = {
          ...materialsWithFixedUnitId[0],
          id: Date.now(), // Новый ID для теста
          quantity: 10
        };
        finalMaterials = [testMaterial];
      }
      
      // 5. Обновляем состояние
      setPipes({
        loading: finalMaterials,
        output: [],
        defect: []
      });
      
    } catch (error) {
      console.error('Ошибка загрузки данных участка:', error);
    }
  };
  
  loadSectionData();
}, [sectionId]);
  
  
  // Состояния для диалогов
  const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Состояния для регистрации и выбора
  const [currentUser, setCurrentUser] = useState(null);
  const [operationHistory, setOperationHistory] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Состояния для выбранного материала и истории
  const [selectedPipe, setSelectedPipe] = useState(null);
  const [materialHistoryDialogOpen, setMaterialHistoryDialogOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [materialHistory, setMaterialHistory] = useState([]);

  // Загружаем пользователя при монтировании
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await warehouseService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error);
      // Тестовый пользователь для разработки
      setCurrentUser({
        id: 1,
        name: 'Оператор Степанов',
        role: 'operator',
        sectionId: 1
      });
    }
  };
  
  useEffect(() => {
    console.log('=== ОТЛАДКА SECTIONPAGE ===');
    console.log('sectionId:', sectionId);
    console.log('selectedPipe:', selectedPipe);
    console.log('materialHistoryDialogOpen:', materialHistoryDialogOpen);
    console.log('operationHistory:', operationHistory);
  }, [selectedPipe, materialHistoryDialogOpen]);
  
  // Функция для логирования операций в MaterialRouteSteps
  const logOperation = async (operationType, material, quantity, fromLocation, toLocation) => {
		
    console.log('=== НАЧАЛО LOGOPERATION ===');
    console.log('operationType:', operationType);
    console.log('material:', material);
    console.log('material.id:', material?.id);
    console.log('material.warehouseMaterialId:', material?.warehouseMaterialId);	
	
	// Определяем тип шага и unitId
    let stepType = '';
    let notes = '';
    
    switch(operationType) {
      case 'REGISTRATION':
        stepType = 'REGISTRATION_ON_SECTION';
        fromLocation = 'WAREHOUSE';
        toLocation = `SECTION_${sectionId}`;
        notes = `Регистрация материала ${material.name} (${material.code}) на участке ${sectionId}`;
        break;
      case 'MOVE_TO_OUTPUT':
        stepType = 'PROCESSING_START';
        fromLocation = `SECTION_${sectionId}_LOADING`;
        toLocation = `SECTION_${sectionId}_PROCESSING`;
        notes = `Начало обработки материала ${material.name} (${material.code})`;
        break;
      case 'MOVE_TO_DEFECT':
        stepType = 'MOVE_TO_DEFECT';
        fromLocation = `SECTION_${sectionId}_LOADING`;
        toLocation = `SECTION_${sectionId}_DEFECT`;
        notes = `Перемещение материала ${material.name} (${material.code}) в брак`;
        break;
      default:
        stepType = operationType;
        notes = `Операция: ${operationType}`;
    }
    
    // Формируем данные для MaterialRouteSteps
    const routeStepData = {
      materialId: material.id || material.warehouseMaterialId,
      stepType: stepType,
      fromLocation: fromLocation,
      toLocation: toLocation,
      unitId: parseInt(sectionId) || 0,
      operationDate: new Date().toISOString(),
      pcs: quantity || material.quantity || 0,
      mts: 0, // Метры
      tns: 0, // Тонны
      notes: `${notes}. Оператор: ${currentUser?.name || 'Неизвестный'}`
    };
    
    console.log('Отправка шага маршрута в MaterialRouteSteps:', routeStepData);
    
    try {
      // 1. Отправляем на сервер в MaterialRouteSteps
      const result = await warehouseService.logMaterialRouteStep(routeStepData);
      
      console.log('Шаг маршрута сохранен в БД:', result);
      
      // 2. Создаем локальную запись для отображения
      const localOperation = {
        id: Date.now(),
        stepId: result.stepId || result.id || `STEP-${Date.now()}`,
        timestamp: new Date().toISOString(),
        operationType: operationType,
        stepType: stepType,
        materialId: material.id || material.warehouseMaterialId,
        materialName: material.name,
        materialCode: material.code,
        quantity: quantity || material.quantity || 0,
        fromLocation: fromLocation,
        toLocation: toLocation,
        unitId: sectionId,
        operatorId: currentUser?.id || 0,
        operatorName: currentUser?.name || 'Неизвестный оператор',
        status: 'success',
        details: {
          unit: material.unit,
          warehouseMaterialId: material.warehouseMaterialId || material.id,
          serverResponse: result
        }
      };
      
      // 3. Добавляем в локальную историю
      setOperationHistory(prev => [localOperation, ...prev]);
      
      return localOperation;
      
    } catch (error) {
      console.error('Ошибка записи шага маршрута:', error);
      
      // Создаем запись об ошибке
      const errorOperation = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        operationType: operationType,
        stepType: stepType,
        materialId: material.id || material.warehouseMaterialId,
        materialName: material.name,
        materialCode: material.code,
        quantity: quantity || material.quantity || 0,
        fromLocation: fromLocation,
        toLocation: toLocation,
        unitId: sectionId,
        operatorId: currentUser?.id || 0,
        operatorName: currentUser?.name || 'Неизвестный оператор',
        status: 'error',
        error: error.message,
        details: {
          unit: material.unit,
          warehouseMaterialId: material.warehouseMaterialId || material.id
        }
      };
      
      setOperationHistory(prev => [errorOperation, ...prev]);
      
      throw error;
    }
  };

  // Функция загрузки истории из БД
  const loadMaterialHistoryFromDB = async (materialId) => {
    if (!materialId) return [];
    
    setLoadingHistory(true);
    try {
      console.log('Загрузка истории для материала ID:', materialId);
      const steps = await warehouseService.getMaterialRouteSteps(materialId);
      console.log('Получены шаги из БД:', steps);
      
      // Преобразуем шаги из БД в формат для отображения
      const formattedSteps = steps.map(step => ({
        id: step.id,
        stepId: step.id,
        timestamp: step.operationDate,
        operationType: mapStepTypeToOperationType(step.stepType),
        stepType: step.stepType,
        materialId: step.materialId,
        materialName: step.materialName || 'Неизвестно',
        materialCode: step.materialCode || '',
        quantity: step.pcs,
        fromLocation: step.fromLocation,
        toLocation: step.toLocation,
        unitId: step.unitId,
        userId: step.userId || 0,
        userName: step.userName || 'Неизвестно',
        status: 'success',
        notes: step.notes,
        details: {
          mts: step.mts,
          tns: step.tns
        }
      }));
      
      return formattedSteps;
    } catch (error) {
      console.error('Ошибка загрузки истории из БД:', error);
      return [];
    } finally {
      setLoadingHistory(false);
    }
  };

  // Вспомогательная функция для преобразования типов
  const mapStepTypeToOperationType = (stepType) => {
    switch(stepType) {
      case 'REGISTRATION_ON_SECTION': return 'REGISTRATION';
      case 'PROCESSING_START': return 'MOVE_TO_OUTPUT';
      case 'MOVE_TO_DEFECT': return 'MOVE_TO_DEFECT';
      default: return stepType;
    }
  };

  // Открытие диалога истории с загрузкой данных
  const handleOpenMaterialHistory = async () => {
	  console.log('=== handleOpenMaterialHistory ВЫЗВАН ===');
  
	if (!selectedPipe) {
    console.log('ОШИБКА: selectedPipe is null!');
    return;
	}
	//  if (selectedPipe?.warehouseMaterialId) { ПУСТО СМОТРЕТь
    if (selectedPipe?.warehouseMaterialId) {
      setMaterialHistoryDialogOpen(true);
      setLoadingHistory(true);
      
      try {
		console.log('tr1');
        // Загружаем историю из БД
        const dbHistory = await loadMaterialHistoryFromDB(selectedPipe.warehouseMaterialId);
        
        // Объединяем с локальной историей
        const localHistory = operationHistory.filter(op => 
          op.materialId === selectedPipe.warehouseMaterialId
        );
        
        const allHistory = [...dbHistory, ...localHistory]
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setMaterialHistory(allHistory);
      } catch (error) {
        console.error('Ошибка загрузки истории:', error);
        setMaterialHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    }
	console.log('tr2');
  };

  // Удалить трубу
  const handleDeletePipe = async (pocket, pipeId) => {
  try {
    // Находим удаляемый материал
    const pipeToDelete = pipes[pocket].find(pipe => pipe.id === pipeId);
    if (!pipeToDelete) {
      console.error('Материал для удаления не найден');
      return;
    }
    
    console.log('=== УДАЛЕНИЕ МАТЕРИАЛА ===');
    console.log('Материал:', pipeToDelete);
    
    // 1. ОБНОВЛЯЕМ MATERIAL В БД - ПЕРЕМЕЩАЕМ НА ОБЩИЙ СКЛАД (unitId: 11)
    if (pipeToDelete.warehouseMaterialId) {
      console.log('1. Обновляем unitId материала на 11 (общий склад)...');
      
      const updateData = {
        unitId: 11, //перемещаем на общий склад
        code: pipeToDelete.code,
        name: pipeToDelete.name,
        pcs: pipeToDelete.quantity || 0
      };
      
      try {
        await warehouseService.updateMaterial(pipeToDelete.warehouseMaterialId, updateData);
        console.log('✅ Material обновлен в БД (unitId: 11)');
      } catch (error) {
        console.error('❌ Ошибка обновления material в БД:', error);
      }
    }
    
    // 2. ЗАПИСЫВАЕМ В MATERIAL ROUTE STEPS - ОПЕРАЦИЯ УДАЛЕНИЯ
    console.log('2. Записываем шаг удаления в историю...');
    
    const routeStepData = {
  materialId: pipeToDelete.warehouseMaterialId || pipeToDelete.id,
  stepType: 'Return',
  fromLocation: `SECTION_${sectionId}_${pocket.toUpperCase()}`,
  toLocation: 'WAREHOUSE_GENERAL',
  unitId: 11,
  operationDate: new Date().toISOString(),
  pcs: pipeToDelete.quantity,
  mts: 0,
  tns: 0,
  notes: `Материал ${pipeToDelete.name} (${pipeToDelete.code}) удален с участка ${sectionId}`
};
    
    try {
      await warehouseService.logMaterialRouteStep(routeStepData);
      console.log('✅ Шаг удаления записан в историю');
    } catch (error) {
      console.error('❌ Ошибка записи шага удаления:', error);
    }
    
    // 3. УДАЛЯЕМ ИЗ ЛОКАЛЬНОГО СОСТОЯНИЯ
    console.log('3. Удаляем из локального состояния...');
    
    // Снимаем выделение если нужно
    if (selectedPipe?.id === pipeId) {
      setSelectedPipe(null);
    }
    
    // Удаляем из соответствующего кармана
    setPipes(prev => ({
      ...prev,
      [pocket]: prev[pocket].filter(pipe => pipe.id !== pipeId)
    }));
    
    // 4. УВЕДОМЛЕНИЕ ПОЛЬЗОВАТЕЛЮ
    setSnackbar({
      open: true,
      message: `✅ Материал "${pipeToDelete.name}" удален с участка и перемещен на общий склад`,
      severity: 'success'
    });
    
    console.log('=== УДАЛЕНИЕ ЗАВЕРШЕНО ===');
    
  } catch (error) {
    console.error('Общая ошибка при удалении:', error);
    setSnackbar({
      open: true,
      message: `❌ Ошибка при удалении: ${error.message}`,
      severity: 'error'
    });
  }
};

  // Выбор трубы
  const handleSelectPipe = (pipe) => {
    setSelectedPipe(selectedPipe?.id === pipe.id ? null : pipe);
  };

  // Открыть диалог выбора материалов со склада
  const handleOpenWarehouseDialog = () => {
    setWarehouseDialogOpen(true);
  };

  // Выбор материала из склада
  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    setWarehouseDialogOpen(false);
    setQuantityDialogOpen(true);
  };

 
 // Добавление материала со склада
 const handleAddFromWarehouse = async (material, quantity) => {
  setIsRegistering(true);
  
  try {
    console.log('=== РЕГИСТРАЦИЯ МАТЕРИАЛА ===');
    console.log('Материал для регистрации:', material);
    
    // 1. ОБНОВЛЯЕМ UNIT МАТЕРИАЛА В БД
    console.log('1. Обновляем unit материала...');
    
    // Определяем unitId (преобразуем "loading1" в число)
    const unitIdValue = parseInt(sectionId.replace('loading', '')) || 1;
    
    const updateData = {
      code: material.code,           // Обязательное поле
      name: material.name,           // Обязательное поле
      description: material.description || '',
      parentId: material.parentId || null,
      unitId: unitIdValue,           // ← ВАЖНО: устанавливаем участок!
      pcs: quantity,                 // Количество на участке
      mts: 0,
      tns: 0
    };
    
    console.log('Данные для обновления материала:', updateData);
    
    const updateResult = await warehouseService.updateMaterial(
      material.id,
      updateData
    );
    
    console.log('Результат обновления материала:', updateResult);
    
    // 2. ЗАПИСЫВАЕМ В MATERIAL ROUTE STEPS
    console.log('2. Записываем шаг маршрута...');
    
    const routeStepData = {
      materialId: material.id,
      stepType: 'Registration',
      fromLocation: 'WAREHOUSE',
      toLocation: `SECTION_${sectionId}`,
      unitId: unitIdValue,
      operationDate: new Date().toISOString(),
      pcs: quantity,
      mts: 0,
      tns: 0,
      notes: `Материал ${material.name} (${material.code}) зарегистрирован на участке ${sectionId}. Количество: ${quantity} шт.`
    };
    
    console.log('Данные для MaterialRouteSteps:', routeStepData);
    
    const routeStepResult = await warehouseService.logMaterialRouteStep(routeStepData);
    console.log('Результат записи шага:', routeStepResult);
    
    // 3. СОЗДАЕМ ЛОКАЛЬНЫЙ ОБЪЕКТ
    const newPipe = {
      id: Date.now(),
      name: material.name,
      code: material.code,
      diameter: 0,
      thickness: 0,
      length: 6,
      material: 'Сталь',
      quantity: quantity,
      warehouseMaterialId: material.id,
      unit: typeof material.unit === 'string' 
        ? material.unit 
        : (material.unit?.name || material.unit?.code || 'шт.'),
      currentUnit: sectionId,
      unitId: unitIdValue,  // Сохраняем числовой ID участка
      registrationId: routeStepResult.id || `REG-${Date.now()}`,
      registeredBy: currentUser?.name || 'Неизвестный',
      registrationDate: new Date().toISOString(),
      // Сохраняем оригинальные данные
      originalMaterialData: material
    };
    
    console.log('Создан локальный объект:', newPipe);
    
    // 4. ДОБАВЛЯЕМ В ЗАГРУЗОЧНЫЙ КАРМАН
    setPipes(prev => ({
      ...prev,
      loading: [...prev.loading, newPipe]
    }));
    
    // 5. ВЫБИРАЕМ МАТЕРИАЛ
    setSelectedPipe(newPipe);
    
    // 6. УВЕДОМЛЕНИЕ
    setSnackbar({
      open: true,
      message: `✅ Материал "${material.name}" зарегистрирован на участке ${sectionId}`,
      severity: 'success'
    });
    
    console.log('=== РЕГИСТРАЦИЯ ЗАВЕРШЕНА ===');
    
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    
    // ДАЖЕ ЕСЛИ API НЕ РАБОТАЕТ - добавляем локально
    const newPipe = {
      id: Date.now(),
      name: material.name,
      code: material.code,
      quantity: quantity,
      warehouseMaterialId: material.id,
      currentUnit: sectionId,
      unitId: parseInt(sectionId.replace('loading', '')) || 1,
      registrationDate: new Date().toISOString()
    };
    
    setPipes(prev => ({
      ...prev,
      loading: [...prev.loading, newPipe]
    }));
    
    setSelectedPipe(newPipe);
    
    setSnackbar({
      open: true,
      message: `⚠️ Материал добавлен (без обновления в БД)`,
      severity: 'warning'
    });
  } finally {
    setIsRegistering(false);
  }
};

  // Переместить трубу из загрузки в выход
  const handleMoveToOutput = async () => {
    if (pipes.loading.length === 0) return;
    
    const pipeToMove = pipes.loading[0];
    
    try {
      // 1. Логируем операцию в MaterialRouteSteps
      await logOperation('MOVE_TO_OUTPUT', pipeToMove, pipeToMove.quantity, 
        `SECTION_${sectionId}_LOADING`, `SECTION_${sectionId}_PROCESSING`);
      
      // 2. Обновляем локальное состояние
      setPipes(prev => ({
        loading: prev.loading.filter(p => p.id !== pipeToMove.id),
        output: [...prev.output, pipeToMove]
      }));
      
      // 3. Снимаем выделение если нужно
      if (selectedPipe?.id === pipeToMove.id) {
        setSelectedPipe(null);
      }
      
      // 4. Уведомление
      setSnackbar({
        open: true,
        message: `✅ Материал "${pipeToMove.name}" перемещен на обработку`,
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Ошибка перемещения на обработку:', error);
      setSnackbar({
        open: true,
        message: `❌ Ошибка: ${error.message}`,
        severity: 'error'
      });
    }
  };

  // Переместить трубу в брак
  const handleMoveToDefect = async () => {
    if (pipes.loading.length === 0) return;
    
    const pipeToMove = pipes.loading[0];
    
    try {
      // 1. Логируем операцию в MaterialRouteSteps
      await logOperation('MOVE_TO_DEFECT', pipeToMove, pipeToMove.quantity,
        `SECTION_${sectionId}_LOADING`, `SECTION_${sectionId}_DEFECT`);
      
      // 2. Обновляем локальное состояние
      setPipes(prev => ({
        loading: prev.loading.filter(p => p.id !== pipeToMove.id),
        defect: [...prev.defect, pipeToMove]
      }));
      
      // 3. Снимаем выделение если нужно
      if (selectedPipe?.id === pipeToMove.id) {
        setSelectedPipe(null);
      }
      
      // 4. Уведомление
      setSnackbar({
        open: true,
        message: `⚠️ Материал "${pipeToMove.name}" перемещен в брак`,
        severity: 'warning'
      });
      
    } catch (error) {
      console.error('Ошибка перемещения в брак:', error);
      setSnackbar({
        open: true,
        message: `❌ Ошибка: ${error.message}`,
        severity: 'error'
      });
    }
  };
  
  // Кнопка обновить
  const refreshSectionData = async () => {
  try {
    console.log('🔄 Обновление данных участка...');
    
    const materials = await warehouseService.getAvailableMaterials();
    const currentUnitId = sectionToUnitId[sectionId];
    
    console.log('Получено материалов:', materials.length);
    
    // Форматируем и фильтруем материалы
    const processedMaterials = materials
      .map(material => {
        const unitId = material.unitId || currentUnitId;
        return {
          id: material.id,
          name: material.name,
          code: material.code,
          diameter: 0,
          thickness: 0,
          length: 6,
          material: 'Сталь',
          quantity: material.pcs || 'шт.',          
          unitId: unitId,
          warehouseMaterialId: material.id,
          registrationDate: new Date().toISOString(),
          registeredBy: 'Оператор Степанов'
        };
      })
      .filter(material => 
        material.unitId === currentUnitId && 
        material.unitId !== 11 // Исключаем общий склад
      );
    
    // Обновляем состояние
    setPipes({
      loading: processedMaterials,
      output: [],
      defect: []
    });
    
    // Уведомление
    setSnackbar({
      open: true,
      message: `✅ Данные обновлены. Найдено материалов: ${processedMaterials.length}`,
      severity: 'success'
    });
    
    console.log('Обновлено материалов на участке:', processedMaterials.length);
    
  } catch (error) {
    console.error('Ошибка обновления данных:', error);
    setSnackbar({
      open: true,
      message: `❌ Ошибка обновления: ${error.message}`,
      severity: 'error'
    });
  }
};

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Заголовок с кнопками */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/production')}
        >
          Назад
        </Button>
        
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ flex: 1 }}>
  {sectionDisplayName.toUpperCase()}
</Typography>
        
		
		<Button 
		variant="outlined"
		startIcon={<RefreshIcon />}
		onClick={refreshSectionData}
		sx={{ ml: 2 }}
		>
		Обновить данные
		</Button>
		
        <Button 
		variant="outlined"
		startIcon={<History />}
		onClick={() => {
		console.log('=== КЛИК ПО КНОПКЕ ИСТОРИИ ===');
		console.log('selectedPipe перед вызовом:', selectedPipe);
		console.log('materialHistoryDialogOpen перед вызовом:', materialHistoryDialogOpen);
		handleOpenMaterialHistory();
		console.log('materialHistoryDialogOpen после вызова:', materialHistoryDialogOpen);
	}}
		disabled={!selectedPipe}
		>
		История материала
		{selectedPipe && ` (${selectedPipe.name})`}
		</Button>
        
        {currentUser && (
          <Chip 
            label={`Оператор: ${currentUser.name}`}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {/* Статус выбранного материала */}
      {selectedPipe && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => setSelectedPipe(null)}
            >
              Снять выделение
            </Button>
          }
        >
          <strong>Выбран материал:</strong> {selectedPipe.name} ({selectedPipe.code})
          {selectedPipe.warehouseMaterialId && ` • ID склада: ${selectedPipe.warehouseMaterialId}`}
          {selectedPipe.quantity && ` • Количество: ${selectedPipe.quantity} ${selectedPipe.unit || 'шт.'}`}
        </Alert>
      )}

      {/* ОСНОВНОЙ МАКЕТ С КАРМАНАМИ */}
      <Grid container spacing={3}>
        
        {/* ЛЕВАЯ ЧАСТЬ: ЗАГРУЗОЧНЫЙ КАРМАН (30% ширины) */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
              ЗАГРУЗОЧНЫЙ КАРМАН
            </Typography>
            
            {/* Индикатор регистрации */}
            {isRegistering && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  Регистрация материала...
                </Typography>
              </Box>
            )}
            
            {/* ГРИД труб */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {pipes.loading.map((pipe) => (
                <Grid item xs={12} key={pipe.id}>
                  <PipeCard 
                    pipe={pipe} 
                    onDelete={(id) => handleDeletePipe('loading', id)}
                    isSelected={selectedPipe?.id === pipe.id}
                    onSelect={handleSelectPipe}
                  />
                </Grid>
              ))}
            </Grid>
            
            {/* КНОПКИ под гридом */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleOpenWarehouseDialog}
                disabled={isRegistering}
              >
                Зарегистрировать пакет
              </Button>
              <Button 
                variant="outlined"
                onClick={handleMoveToOutput}
                disabled={pipes.loading.length === 0 || isRegistering}
              >
                Начать обработку
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                onClick={handleMoveToDefect}
                disabled={pipes.loading.length === 0 || isRegistering}
              >
                Завершить обработку
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* ПРАВАЯ ЧАСТЬ (70% ширины) */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3} direction="column">
            
            {/* ВЕРХ ПРАВОЙ ЧАСТИ: ВЫХОДНОЙ КАРМАН */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="success">
                    ВЫХОДНОЙ КАРМАН
                  </Typography>
                </Box>
                
                {/* ГРИД труб */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {pipes.output.map((pipe) => (
                    <Grid item xs={12} sm={6} md={4} key={pipe.id}>
                      <PipeCard 
                        pipe={pipe} 
                        onDelete={(id) => handleDeletePipe('output', id)}
                        isSelected={selectedPipe?.id === pipe.id}
                        onSelect={handleSelectPipe}
                      />
                    </Grid>
                  ))}
                </Grid>
                
                {/* КНОПКИ под гридом */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="success">
                    Отгрузить
                  </Button>
                  <Button variant="outlined">
                    Переупаковать
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* НИЗ ПРАВОЙ ЧАСТИ: КАРМАН БРАКА */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: '#fff5f5' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Warning color="error" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="error">
                    КАРМАН БРАКА
                  </Typography>
                </Box>
                
                {/* ГРИД труб */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {pipes.defect.map((pipe) => (
                    <Grid item xs={12} sm={6} md={4} key={pipe.id}>
                      <PipeCard 
                        pipe={pipe} 
                        onDelete={(id) => handleDeletePipe('defect', id)}
                        isSelected={selectedPipe?.id === pipe.id}
                        onSelect={handleSelectPipe}
                      />
                    </Grid>
                  ))}
                </Grid>
                
                {/* КНОПКИ под гридом */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="error">
                    Списать
                  </Button>
                  <Button variant="outlined">
                    На доработку
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
	  	 

      {/* ДИАЛОГ ВЫБОРА МАТЕРИАЛОВ СО СКЛАДА */}
      <WarehouseDialog
        open={warehouseDialogOpen}
        onClose={() => setWarehouseDialogOpen(false)}
        onSelectMaterial={handleMaterialSelect}
      />

      {/* ДИАЛОГ УКАЗАНИЯ КОЛИЧЕСТВА */}
      <QuantityDialog
        open={quantityDialogOpen}
        onClose={() => setQuantityDialogOpen(false)}
        material={selectedMaterial}
        onConfirm={handleAddFromWarehouse}
      />

      {/* ДИАЛОГ ИСТОРИИ ОПЕРАЦИЙ ДЛЯ ВЫБРАННОГО МАТЕРИАЛА */}
      <MaterialHistoryDialog
        open={materialHistoryDialogOpen}
        onClose={() => {
          setMaterialHistoryDialogOpen(false);
          setMaterialHistory([]);
        }}
        material={selectedPipe}
        operations={materialHistory}
        loading={loadingHistory}
      />

      {/* УВЕДОМЛЕНИЯ */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default SectionPage;