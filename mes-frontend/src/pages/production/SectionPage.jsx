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
  Check as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon 
} from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';

// Маппинг участков
const SECTION_MAPPING = {
  'loading1': { 
    unitId: 3, 
    outputUnitId: 12, 
    defectUnitId: 13, // Карман брака для загрузки
    name: 'Загрузка труб',
    nextSection: 'sorting1'  // Следующий участок
  },
  'sorting1': { 
    unitId: 7, 
    outputUnitId: 13, 
    defectUnitId: 991, // Карман брака для сортировки
    name: 'Сортировка',
    nextSection: 'packing1'
  },
  'packing1': { 
    unitId: 9, 
    outputUnitId: 14, 
    defectUnitId: 992, // Карман брака для упаковки
    finishedGoodsUnitId: 15, // Склад готовой продукции
    name: 'Упаковка',
    nextSection: null  // Последний участок
  }
};


const getSectionDisplayName = (sectionId) => {
  return SECTION_MAPPING[sectionId]?.name || `Участок ${sectionId}`;
};


// Функция для получения русского названия типа операции
const getOperationTypeTitle = (operationType) => {
  const typeMapping = {
    'Receipt': 'Поступление',
    'Registration': 'Регистрация', 
    'Transfer': 'Перемещение',
    'Consumption': 'Расход',
    'Return': 'Возврат',
    'WriteOff': 'Списание'
  };
  return typeMapping[operationType] || operationType;
};

// Компонент карточки материала
function MaterialCard({ material, onDelete, isSelected, onSelect }) {
  const getSectionName = (unitId) => {
    const sections = {
      3: 'Загрузка труб',
      7: 'Сортировка',
      9: 'Упаковка',
      12: 'Выходной карман (Загрузка)',
      13: 'Выходной карман (Сортировка)',
      14: 'Выходной карман (Упаковка)',
      11: 'Общий склад',
      15: 'Склад готовой продукции',
      19: 'Склад брака',
      20: 'Склад готовой продукции',
      990: 'Брак (Загрузка)',
      991: 'Брак (Сортировка)',
      992: 'Брак (Упаковка)'
    };
    return sections[unitId] || `Участок #${unitId}`;
  };

  const sectionName = material.unitId ? getSectionName(material.unitId) : 'Не указан';

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
      onClick={() => onSelect(material)}
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
              {material.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Код: {material.code}
            </Typography>
            <Typography 
              variant="caption" 
              color={material.unitId >= 990 ? 'error' : 'primary'} 
              sx={{ display: 'block', mt: 0.5 }}
            >
              {sectionName}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(material.id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
        
        {material.diameter > 0 && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Размер: Ø{material.diameter}мм × {material.thickness}мм
          </Typography>
        )}
        
        {material.length && (
          <Typography variant="body2">
            Длина: {material.length}м
          </Typography>
        )}
        
        {material.materialType && (
          <Typography variant="body2">
            Материал: {material.materialType}
          </Typography>
        )}
        
        <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
          {material.quantity} {material.unit || 'шт.'}
        </Typography>
        
        {material.registrationDate && (
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed #ddd' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Поступил: {new Date(material.registrationDate).toLocaleDateString()}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Участок: {sectionName}
            </Typography>
            {material.registeredBy && (
              <Typography variant="caption" color="text.secondary" display="block">
                Принял: {material.registeredBy}
              </Typography>
            )}
          </Box>
        )}
        
        {/* Для кармана брака показываем статус */}
        {material.unitId >= 990 && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography variant="caption" color="error.dark" fontWeight="bold">
              ⚠️ БРАК
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ДИАЛОГ ВЫБОРА МАТЕРИАЛОВ СО СКЛАДА
function WarehouseDialog({ open, onClose, onSelectMaterial, currentUnitId }) {
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
      const apiMaterials = await warehouseService.getAvailableMaterials();
      
      // Фильтруем материалы на общем складе (unitId: 11) или без unitId
      const availableMaterials = apiMaterials.filter(item => 
        !item.unitId || item.unitId === 11
      );
      
      const formattedMaterials = availableMaterials.map(item => ({
        id: item.id,
        name: item.name,
        code: item.code?.toString() || `MAT-${item.id}`,
        type: item.parentId ? 'Деталь' : 'Материал',
        quantity: item.pcs || item.quantity || 0,
        unit: typeof item.unit === 'string' ? item.unit : (item.unit?.name || 'шт.'),
        description: item.description || '',
        warehouseMaterialId: item.id,
        currentUnitId: item.unitId || 11
      }));
      
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
        material.name?.toLowerCase().includes(search.toLowerCase()) ||
        material.code?.toLowerCase().includes(search.toLowerCase())
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
                      <TableCell>Описание</TableCell>
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
                              <Typography variant="body2" color="text.secondary">
                                {material.description?.substring(0, 60)}
                                {material.description?.length > 60 ? '...' : ''}
                              </Typography>
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
                                {material.unit}
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
          onClick={fetchMaterials} 
          variant="contained"
          startIcon={<RefreshIcon />}
        >
          Обновить
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

// ДИАЛОГ ИСТОРИИ ОПЕРАЦИЙ
function MaterialHistoryDialog({ open, onClose, material, operations, loading }) {
  const getOperationColor = (operationType) => {
    switch(operationType) {
      case 'Receipt': return 'primary';
      case 'Registration': return 'success';
      case 'Transfer': return 'info';
      case 'Consumption': return 'warning';
      case 'Return': return 'secondary';
      case 'WriteOff': return 'error';
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
                        {new Date(op.timestamp || op.operationDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(op.timestamp || op.operationDate).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getOperationTypeTitle(op.operationType || op.stepType)}
                        size="small" 
                        color={getOperationColor(op.operationType || op.stepType)}
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
                        label={op.status === 'success' || !op.status ? '✅ Успешно' : '❌ Ошибка'}
                        size="small"
                        color={op.status === 'success' || !op.status ? 'success' : 'error'}
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
  
 // Получаем настройки участка
  const sectionConfig = SECTION_MAPPING[sectionId] || { 
    unitId: 0, 
    outputUnitId: 12, 
    defectUnitId: 990, 
    name: `Участок ${sectionId}`,
    nextSection: null
  };
  
  const { 
    unitId: currentUnitId, 
    outputUnitId, 
    defectUnitId, 
    name: sectionDisplayName,
    nextSection 
  } = sectionConfig;
  
  // Состояние материалов по карманам
  const [materials, setMaterials] = useState({
    loading: [],   // Материалы на текущем участке
    output: [],    // Материалы в выходном кармане
    defect: []     // Бракованные материалы
  });
  
  // Состояния UI
  const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedPipe, setSelectedPipe] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Состояния для истории операций
  const [materialHistoryDialogOpen, setMaterialHistoryDialogOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [materialHistory, setMaterialHistory] = useState([]);

  // Загружаем пользователя
  useEffect(() => {
    fetchCurrentUser();
    loadSectionMaterials();
  }, [sectionId]);

  const fetchCurrentUser = async () => {
    try {
      const user = await warehouseService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error);
      setCurrentUser({
        id: 1,
        name: 'Александр Иванов',
        role: 'operator'
      });
    }
  };
  
  // Функция для проверки, где находится выбранный материал
const getSelectedMaterialLocation = () => {
  if (!selectedPipe) return null;
  
  if (materials.loading.some(m => m.id === selectedPipe.id)) {
    return 'loading';
  } else if (materials.output.some(m => m.id === selectedPipe.id)) {
    return 'output';
  } else if (materials.defect.some(m => m.id === selectedPipe.id)) {
    return 'defect';
  }
  return null;
};

  // ЗАГРУЗКА МАТЕРИАЛОВ УЧАСТКА
  const loadSectionMaterials = async () => {
    setLoading(true);
    try {
      console.log('Загрузка материалов для участка:', sectionId, 'unitId:', currentUnitId);
      
      const allMaterials = await warehouseService.getAvailableMaterials();
      
      console.log('Все материалы с API:', allMaterials.length);
      
      // Распределяем материалы по карманам
      const loadingMaterials = allMaterials.filter(m => m.unitId === currentUnitId);
      const outputMaterials = allMaterials.filter(m => m.unitId === outputUnitId);
      const defectMaterials = allMaterials.filter(m => m.unitId === defectUnitId);
      
      // Форматируем материалы
      const formatMaterial = (item) => ({
        id: item.id,
        name: item.name,
        code: item.code || `MAT-${item.id}`,
        quantity: item.pcs || item.quantity || 0,
        unit: typeof item.unit === 'string' ? item.unit : (item.unit?.name || 'шт.'),
        diameter: item.diameter || 0,
        thickness: item.thickness || 0,
        length: item.length || 6,
        materialType: item.materialType || 'Сталь',
        unitId: item.unitId,
        warehouseMaterialId: item.id,
        registrationDate: item.createdAt || new Date().toISOString(),
        registeredBy: item.createdBy || currentUser?.name
      });
      
      setMaterials({
        loading: loadingMaterials.map(formatMaterial),
        output: outputMaterials.map(formatMaterial),
        defect: defectMaterials.map(formatMaterial)
      });
      
      console.log('Загружено материалов:', {
        loading: loadingMaterials.length,
        output: outputMaterials.length,
        defect: defectMaterials.length
      });
      
    } catch (error) {
      console.error('Ошибка загрузки материалов:', error);
      setSnackbar({
        open: true,
        message: `Ошибка загрузки материалов: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // ЗАГРУЗКА ИСТОРИИ ОПЕРАЦИЙ ДЛЯ МАТЕРИАЛА
  const loadMaterialHistory = async (materialId) => {
    if (!materialId) return [];
    
    setLoadingHistory(true);
    try {
      console.log('Загрузка истории для материала ID:', materialId);
      
      // Пробуем загрузить историю из БД
      const steps = await warehouseService.getMaterialRouteSteps(materialId);
      console.log('Получены шаги из БД:', steps.length);
      
      // Форматируем шаги для отображения
      const formattedSteps = steps.map(step => ({
        id: step.id || `step-${Date.now()}-${Math.random()}`,
        stepId: step.id,
        timestamp: step.operationDate || step.timestamp || new Date().toISOString(),
        operationType: step.stepType,
        stepType: step.stepType,
        materialId: step.materialId,
        materialName: step.materialName || 'Неизвестно',
        materialCode: step.materialCode || '',
        quantity: step.pcs || step.quantity || 0,
        fromLocation: step.fromLocation,
        toLocation: step.toLocation,
        unitId: step.unitId,
        userId: step.userId || 0,
        userName: step.userName || 'Александр Иванов',
        status: 'success',
        notes: step.notes
      }));
      
      return formattedSteps;
    } catch (error) {
      console.error('Ошибка загрузки истории из БД:', error);
      // Возвращаем пустой массив если нет истории
      return [];
    } finally {
      setLoadingHistory(false);
    }
  };

  // ОТКРЫТИЕ ДИАЛОГА ИСТОРИИ
  const handleOpenMaterialHistory = async () => {
    if (!selectedPipe) {
      setSnackbar({
        open: true,
        message: 'Сначала выберите материал',
        severity: 'warning'
      });
      return;
    }
    
    setMaterialHistoryDialogOpen(true);
    setLoadingHistory(true);
    
    try {
      // Загружаем историю операций
      const history = await loadMaterialHistory(selectedPipe.warehouseMaterialId || selectedPipe.id);
      setMaterialHistory(history);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
      setMaterialHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // ОБНОВИТЬ ДАННЫЕ
  const refreshSectionData = async () => {
    await loadSectionMaterials();
    setSnackbar({
      open: true,
      message: 'Данные успешно обновлены',
      severity: 'success'
    });
  };

  // ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ЗАПИСИ ШАГА МАРШРУТА
  const logMaterialStep = async (material, stepType, fromLocation, toLocation, quantity) => {
    try {
      const stepData = {
        materialId: material.warehouseMaterialId || material.id,
        stepType: stepType,
        fromLocation: fromLocation,
        toLocation: toLocation,
        unitId: currentUnitId,
        operationDate: new Date().toISOString(),
        pcs: quantity || material.quantity || 0,
        mts: 0,
        tns: 0,
        notes: `Операция: ${stepType}. Материал: ${material.name} (${material.code})`
      };

      console.log('Отправка шага маршрута:', stepData);
      return await warehouseService.logMaterialRouteStep(stepData);
    } catch (error) {
      console.error('Ошибка записи шага маршрута:', error);
      // Если API не работает, все равно продолжаем
      return { success: false, error: error.message };
    }
  };

  // ДОБАВИТЬ МАТЕРИАЛ СО СКЛАДА
  const handleAddFromWarehouse = async (material, quantity) => {
    setIsRegistering(true);
    
    try {
      
	  const sectionName = SECTION_MAPPING[sectionId]?.name || `участка ${sectionId}`;
	  console.log('sectionName: ', sectionName);	  
	  
	  console.log('Регистрация материала:', material.name, 'количество:', quantity);
      
      // 1. Обновляем материал в БД
      const updateData = {
        unitId: currentUnitId,
        pcs: quantity,
        code: material.code,
        name: material.name
      };
      
      let updateResult = {};
      try {
        updateResult = await warehouseService.updateMaterial(material.id, updateData);
        console.log('Материал обновлен:', updateResult);
      } catch (updateError) {
        console.warn('Не удалось обновить материал в БД, продолжаем локально:', updateError);
      }
      
      // 2. Пытаемся записать в историю (но не блокируем основную логику при ошибке)
      try {
        await logMaterialStep(
          material,
          'Registration',
          'Общий склад (Unit 11)',
          `${sectionName}`,
          quantity
        );
      } catch (historyError) {
        console.warn('Не удалось записать в историю, продолжаем:', historyError);
      }
      
      // 3. Добавляем в локальное состояние (даже если API не работает)
      const newMaterial = {
        id: material.id,
        name: material.name,
        code: material.code,
        quantity: quantity,
        unit: material.unit,
        unitId: currentUnitId,
        warehouseMaterialId: material.id,
        registrationDate: new Date().toISOString(),
        registeredBy: currentUser?.name
      };
      
      setMaterials(prev => ({
        ...prev,
        loading: [...prev.loading, newMaterial]
      }));
      
      setSelectedPipe(newMaterial);
      
      setSnackbar({
        open: true,
        message: `Материал "${material.name}" успешно зарегистрирован`,
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      setSnackbar({
        open: true,
        message: `Ошибка регистрации: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // УДАЛИТЬ МАТЕРИАЛ
  const handleDeleteMaterial = async (pocket, materialId) => {
    try {
      const materialToDelete = materials[pocket].find(m => m.id === materialId);
      if (!materialToDelete) return;
      
      console.log('Удаление материала:', materialToDelete.name);
      
      // 1. Перемещаем на общий склад (unitId: 11)
      if (materialToDelete.warehouseMaterialId) {
        try {
          const updateData = {
            unitId: 11,
            code: materialToDelete.code,
            name: materialToDelete.name,
            pcs: materialToDelete.quantity
          };
          
          await warehouseService.updateMaterial(materialToDelete.warehouseMaterialId, updateData);
        } catch (updateError) {
          console.warn('Не удалось обновить материал в БД:', updateError);
        }
      }
      
      // 2. Записываем в историю
      try {
        await logMaterialStep(
          materialToDelete,
          'RETURN_TO_WAREHOUSE',
          `Участок ${sectionName}`,
          'Общий склад',
          materialToDelete.quantity
        );
      } catch (historyError) {
        console.warn('Не удалось записать в историю:', historyError);
      }
      
      // 3. Удаляем из локального состояния
      setMaterials(prev => ({
        ...prev,
        [pocket]: prev[pocket].filter(m => m.id !== materialId)
      }));
      
      // Снимаем выделение если нужно
      if (selectedPipe?.id === materialId) {
        setSelectedPipe(null);
      }
      
      setSnackbar({
        open: true,
        message: `Материал "${materialToDelete.name}" удален`,
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Ошибка удаления:', error);
      setSnackbar({
        open: true,
        message: `Ошибка удаления: ${error.message}`,
        severity: 'error'
      });
    }
  };

  // ПЕРЕМЕСТИТЬ НА ОБРАБОТКУ
  const handleMoveToOutput = async () => {
    if (!selectedPipe) {
      setSnackbar({
        open: true,
        message: 'Выберите материал для обработки',
        severity: 'warning'
      });
      return;
    }
    
    try {
      console.log('Перемещение на обработку:', selectedPipe.name);
      const sectionName = SECTION_MAPPING[sectionId]?.name || `участка ${sectionId}`;
      // 1. Обновляем материал в БД
      if (selectedPipe.warehouseMaterialId) {
        try {
          const updateData = {
            unitId: outputUnitId,
            code: selectedPipe.code,
            name: selectedPipe.name,
            pcs: selectedPipe.quantity
          };
          
          await warehouseService.updateMaterial(selectedPipe.warehouseMaterialId, updateData);
        } catch (updateError) {
          console.warn('Не удалось обновить материал в БД:', updateError);
        }
      }
      
      // 2. Записываем в историю
      try {
        await logMaterialStep(
          selectedPipe,
          'Transfer',
          `${sectionName} Загрузочный карман`,
          `${sectionName} Выходной карман`,
          selectedPipe.quantity
        );
      } catch (historyError) {
        console.warn('Не удалось записать в историю:', historyError);
      }
      
      // 3. Обновляем локальное состояние
      const updatedMaterial = {
        ...selectedPipe,
        unitId: outputUnitId
      };
      
      setMaterials(prev => ({
        loading: prev.loading.filter(m => m.id !== selectedPipe.id),
        output: [...prev.output, updatedMaterial],
        defect: prev.defect
      }));
      
      setSelectedPipe(null);
      
      setSnackbar({
        open: true,
        message: `Материал "${selectedPipe.name}" передан на обработку`,
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Ошибка перемещения:', error);
      setSnackbar({
        open: true,
        message: `Ошибка перемещения: ${error.message}`,
        severity: 'error'
      });
    }
  };

  // ПЕРЕМЕСТИТЬ В БРАК
  const handleMoveToDefect = async () => {
    if (!selectedPipe) {
      setSnackbar({
        open: true,
        message: 'Выберите материал для перемещения в брак',
        severity: 'warning'
      });
      return;
    }
    
    try {
	  const sectionName = SECTION_MAPPING[sectionId]?.name || `участка ${sectionId}`;
      
	  // Определяем unitId для брака 
      const defectUnitId = sectionConfig.defectUnitId;
      
      // 1. Обновляем материал в БД
      if (selectedPipe.warehouseMaterialId) {
        try {
          const updateData = {
            unitId: defectUnitId,
            code: selectedPipe.code,
            name: selectedPipe.name,
            pcs: selectedPipe.quantity
          };
          
          await warehouseService.updateMaterial(selectedPipe.warehouseMaterialId, updateData);
        } catch (updateError) {
          console.warn('Не удалось обновить материал в БД:', updateError);
        }
      }
      
      // 2. Записываем в историю
      try {
        await logMaterialStep(
          selectedPipe,
          'WriteOff',
          `${sectionName} Выходной карман`,
          `${sectionName} Карман брака`,
          selectedPipe.quantity
        );
      } catch (historyError) {
        console.warn('Не удалось записать в историю:', historyError);
      }
      
      // 3. Обновляем локальное состояние
      const updatedMaterial = {
        ...selectedPipe,
        unitId: defectUnitId
      };
      
      setMaterials(prev => ({
        loading: prev.loading.filter(m => m.id !== selectedPipe.id),
        output: prev.output,
        defect: [...prev.defect, updatedMaterial]
      }));
      
      setSelectedPipe(null);
      
      setSnackbar({
        open: true,
        message: `Материал "${selectedPipe.name}" перемещен в брак`,
        severity: 'warning'
      });
      
    } catch (error) {
      console.error('Ошибка перемещения в брак:', error);
      setSnackbar({
        open: true,
        message: `Ошибка: ${error.message}`,
        severity: 'error'
      });
    }
  };
  
  // ПЕРЕМЕСТИТЬ НА СЛЕДУЮЩИЙ УЧАСТОК
const handleMoveToNextSection = async (material) => {
  if (!nextSection) {
    setSnackbar({
      open: true,
      message: 'Это последний участок в цепочке',
      severity: 'warning'
    });
    return;
  }

  try {
    console.log('Перемещение на следующий участок:', material.name, '→', nextSection);
    const sectionName = SECTION_MAPPING[sectionId]?.name || `участка ${sectionId}`;
	const nextSectionName = SECTION_MAPPING[nextSection]?.name || `участка ${sectionId}`;
    const nextSectionConfig = SECTION_MAPPING[nextSection];
    if (!nextSectionConfig) {
      throw new Error('Следующий участок не найден');
    }

    // 1. Обновляем материал в БД
    if (material.warehouseMaterialId) {
      try {
        const updateData = {
          unitId: nextSectionConfig.unitId,
          code: material.code,
          name: material.name,
          pcs: material.quantity
        };
        
        await warehouseService.updateMaterial(material.warehouseMaterialId, updateData);
      } catch (updateError) {
        console.warn('Не удалось обновить материал в БД:', updateError);
      }
    }
    
    // 2. Записываем в историю
    try {
      await logMaterialStep(
        material,
        'Transfer',
        `${sectionName} Выходной карман`,
        `${nextSectionName} Загрузочный карман`,
        material.quantity
      );
    } catch (historyError) {
      console.warn('Не удалось записать в историю:', historyError);
    }
    
    // 3. Удаляем из локального состояния текущего участка
    setMaterials(prev => ({
      ...prev,
      output: prev.output.filter(m => m.id !== material.id)
    }));
    
    // 4. Если выделен этот материал, снимаем выделение
    if (selectedPipe?.id === material.id) {
      setSelectedPipe(null);
    }
    
    setSnackbar({
      open: true,
      message: `Материал "${material.name}" перемещен на участок ${nextSectionConfig.name}`,
      severity: 'success'
    });
    
  } catch (error) {
    console.error('Ошибка перемещения на следующий участок:', error);
    setSnackbar({
      open: true,
      message: `Ошибка: ${error.message}`,
      severity: 'error'
    });
  }
};

// ПЕРЕМЕСТИТЬ В БРАК ИЗ ВЫХОДНОГО КАРМАНА
const handleMoveToDefectFromOutput = async (material) => {
  try {
    const defectUnitId = sectionConfig.defectUnitId;
    const sectionName = SECTION_MAPPING[sectionId]?.name || `участка ${sectionId}`;
    console.log('Перемещение в брак из выходного кармана:', material.name);
    
    // 1. Обновляем материал в БД
    if (material.warehouseMaterialId) {
      try {
        const updateData = {
          unitId: defectUnitId,
          code: material.code,
          name: material.name,
          pcs: material.quantity
        };
        
        await warehouseService.updateMaterial(material.warehouseMaterialId, updateData);
      } catch (updateError) {
        console.warn('Не удалось обновить материал в БД:', updateError);
      }
    }
    
    // 2. Записываем в историю
    try {
      await logMaterialStep(
          selectedPipe,
          'WriteOff',
          `${sectionName} Выходной карман`,
          `${sectionName} Карман брака`,
          selectedPipe.quantity
        );
    } catch (historyError) {
      console.warn('Не удалось записать в историю:', historyError);
    }
    
    // 3. Обновляем локальное состояние
    const updatedMaterial = {
      ...material,
      unitId: defectUnitId
    };
    
    setMaterials(prev => ({
      loading: prev.loading,
      output: prev.output.filter(m => m.id !== material.id),
      defect: [...prev.defect, updatedMaterial]
    }));
    
    // 4. Если выделен этот материал, снимаем выделение
    if (selectedPipe?.id === material.id) {
      setSelectedPipe(null);
    }
    
    setSnackbar({
      open: true,
      message: `Материал "${material.name}" перемещен в брак`,
      severity: 'warning'
    });
    
  } catch (error) {
    console.error('Ошибка перемещения в брак:', error);
    setSnackbar({
      open: true,
      message: `Ошибка: ${error.message}`,
      severity: 'error'
    });
  }
};

// ПЕРЕМЕСТИТЬ НА СКЛАД БРАКА (UNITID-19) ПРИ СПИСАНИИ
const handleWriteOffToDefectWarehouse = async () => {
  if (!selectedPipe) {
    setSnackbar({
      open: true,
      message: 'Выберите материал для списания',
      severity: 'warning'
    });
    return;
  }
  
  // Проверяем, что выбранный материал в кармане брака
  const isInDefect = materials.defect.some(m => m.id === selectedPipe.id);
  if (!isInDefect) {
    setSnackbar({
      open: true,
      message: 'Выбранный материал не находится в кармане брака',
      severity: 'warning'
    });
    return;
  }
  
  try {
    const sectionName = SECTION_MAPPING[sectionId]?.name || `участка ${sectionId}`;
    console.log('Списание материала на склад брака:', selectedPipe.name);
    
    // 1. Обновляем материал в БД - перемещаем на склад брака (UNITID-19)
    if (selectedPipe.warehouseMaterialId) {
      try {
        const updateData = {
          unitId: 14, // Склад брака
          code: selectedPipe.code,
          name: selectedPipe.name,
          pcs: selectedPipe.quantity
        };
        
        await warehouseService.updateMaterial(selectedPipe.warehouseMaterialId, updateData);
      } catch (updateError) {
        console.warn('Не удалось обновить материал в БД:', updateError);
      }
    }
    
    // 2. Записываем в историю
    try {
      await logMaterialStep(
        selectedPipe,
        'WriteOff',
        `${sectionName} Карман брака`,
        'Склад брака',
        selectedPipe.quantity
      );
    } catch (historyError) {
      console.warn('Не удалось записать в историю:', historyError);
    }
    
    // 3. Обновляем локальное состояние - удаляем из кармана брака
    setMaterials(prev => ({
      loading: prev.loading,
      output: prev.output,
      defect: prev.defect.filter(m => m.id !== selectedPipe.id)
    }));
    
    // 4. Снимаем выделение
    setSelectedPipe(null);
    
    setSnackbar({
      open: true,
      message: `Материал "${selectedPipe.name}" списан на склад брака`,
      severity: 'success'
    });
    
  } catch (error) {
    console.error('Ошибка списания на склад брака:', error);
    setSnackbar({
      open: true,
      message: `Ошибка: ${error.message}`,
      severity: 'error'
    });
  }
};

// ПЕРЕМЕСТИТЬ НА СКЛАД ГОТОВОЙ ПРОДУКЦИИ (UNITID-15)
const handleMoveToFinishedGoods = async () => {
  if (!selectedPipe) {
    setSnackbar({
      open: true,
      message: 'Выберите материал для перемещения',
      severity: 'warning'
    });
    return;
  }
  
  // Проверяем, что выбранный материал в выходном кармане
  const isInOutput = materials.output.some(m => m.id === selectedPipe.id);
  if (!isInOutput) {
    setSnackbar({
      open: true,
      message: 'Выбранный материал не находится в выходном кармане',
      severity: 'warning'
    });
    return;
  }
  
  // Проверяем, что это участок упаковки (у него есть finishedGoodsUnitId)
  if (!sectionConfig.finishedGoodsUnitId) {
    setSnackbar({
      open: true,
      message: 'На этом участке нет склада готовой продукции',
      severity: 'warning'
    });
    return;
  }
  
  try {
    const sectionName = SECTION_MAPPING[sectionId]?.name || `участка ${sectionId}`;
    console.log('Перемещение на склад готовой продукции:', selectedPipe.name);
    
    // 1. Обновляем материал в БД - перемещаем на склад готовой продукции (UNITID-15)
    if (selectedPipe.warehouseMaterialId) {
      try {
        const updateData = {
          unitId: sectionConfig.finishedGoodsUnitId, // 15
          code: selectedPipe.code,
          name: selectedPipe.name,
          pcs: selectedPipe.quantity
        };
        
        await warehouseService.updateMaterial(selectedPipe.warehouseMaterialId, updateData);
      } catch (updateError) {
        console.warn('Не удалось обновить материал в БД:', updateError);
      }
    }
    
    // 2. Записываем в историю
    try {
      await logMaterialStep(
        selectedPipe,
        'Transfer',
        `${sectionName} Выходной карман`,
        'Склад готовой продукции',
        selectedPipe.quantity
      );
    } catch (historyError) {
      console.warn('Не удалось записать в историю:', historyError);
    }
    
    // 3. Обновляем локальное состояние - удаляем из выходного кармана
    setMaterials(prev => ({
      loading: prev.loading,
      output: prev.output.filter(m => m.id !== selectedPipe.id),
      defect: prev.defect
    }));
    
    // 4. Снимаем выделение
    setSelectedPipe(null);
    
    setSnackbar({
      open: true,
      message: `Материал "${selectedPipe.name}" перемещен на склад готовой продукции`,
      severity: 'success'
    });
    
  } catch (error) {
    console.error('Ошибка перемещения на склад готовой продукции:', error);
    setSnackbar({
      open: true,
      message: `Ошибка: ${error.message}`,
      severity: 'error'
    });
  }
};

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/production')}>
          Назад
        </Button>
        
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ flex: 1 }}>
          {sectionDisplayName.toUpperCase()}
        </Typography>
        
        <Button 
          variant="outlined"
          startIcon={<History />}
          onClick={handleOpenMaterialHistory}
          disabled={!selectedPipe}
          sx={{ ml: 2 }}
        >
          История материала
          {selectedPipe && ` (${selectedPipe.name})`}
        </Button>
        
        <Button 
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={refreshSectionData}
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Обновить'}
        </Button>
        
        {currentUser && (
          <Chip 
            label={`Оператор: ${currentUser.name}`}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {/* Индикатор выбранного материала */}
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
          {selectedPipe.warehouseMaterialId && ` • ID: ${selectedPipe.warehouseMaterialId}`}
          {selectedPipe.quantity && ` • Количество: ${selectedPipe.quantity} ${selectedPipe.unit}`}
        </Alert>
      )}

      {/* ОСНОВНОЙ МАКЕТ */}
      <Grid container spacing={3}>
        
        {/* ЛЕВАЯ ЧАСТЬ: ЗАГРУЗОЧНЫЙ КАРМАН */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
              ЗАГРУЗОЧНЫЙ КАРМАН
              <Chip 
                label={`${materials.loading.length} материалов`}
                size="small"
                sx={{ ml: 2 }}
              />
            </Typography>
            
            {isRegistering && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress />
                <Typography variant="caption" color="text.secondary">
                  Регистрация материала...
                </Typography>
              </Box>
            )}
            
            {/* Материалы в загрузочном кармане */}
            <Grid container spacing={2} sx={{ mb: 3, maxHeight: 500, overflow: 'auto' }}>
              {materials.loading.length === 0 ? (
                <Grid item xs={12}>
                  <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography color="text.secondary">
                      Нет материалов на участке
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                materials.loading.map((material) => (
                  <Grid item xs={12} key={material.id}>
                    <MaterialCard
					  material={material}
					  onDelete={(id) => handleDeleteMaterial('loading', id)}
					  isSelected={selectedPipe?.id === material.id}
					  onSelect={setSelectedPipe}
					  sectionType="loading"
					  onMoveToNextSection={handleMoveToOutput} // Существующая функция
					  onMoveToDefect={handleMoveToDefect} // Существующая функция
					/>
                  </Grid>
                ))
              )}
            </Grid>
            
            {/* Кнопки управления */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			  <Button 
				variant="contained" 
				startIcon={<AddIcon />}
				onClick={() => setWarehouseDialogOpen(true)}
				disabled={isRegistering}
			  >
				Зарегистрировать пакет
			  </Button>
              {selectedPipe && getSelectedMaterialLocation() === 'loading' && (
    <>
      <Button 
        variant="contained"
        color="primary"
        startIcon={<ArrowForwardIcon />}
        onClick={() => handleMoveToOutput()}
        disabled={isRegistering}
        fullWidth
      >
        Начать обработку "{selectedPipe.name}"
      </Button>
      <Button 
        variant="outlined" 
        color="error"
        startIcon={<CloseIcon />}
        onClick={() => handleMoveToDefect()}
        disabled={isRegistering}
        fullWidth
      >
        Переместить "{selectedPipe.name}" в брак
      </Button>
    </>
  )}
</Box>
          </Paper>
        </Grid>

        {/* ПРАВАЯ ЧАСТЬ */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3} direction="column">
            
            {/* ВЫХОДНОЙ КАРМАН */}
            <Grid item xs={12}>
  <Paper sx={{ p: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <CheckCircle color="success" sx={{ mr: 1 }} />
      <Typography variant="h6" fontWeight="bold" color="success">
        ВЫХОДНОЙ КАРМАН
        <Chip 
          label={`${materials.output.length} материалов`}
          size="small"
          sx={{ ml: 2 }}
        />
        {nextSection && (
          <Chip 
            label={`Далее: ${SECTION_MAPPING[nextSection]?.name || nextSection}`}
            size="small"
            color="info"
            sx={{ ml: 1 }}
          />
        )}
      </Typography>
    </Box>
    
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {materials.output.length === 0 ? (
        <Grid item xs={12}>
          <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography color="text.secondary">
              Нет материалов в выходном кармане
            </Typography>
          </Box>
        </Grid>
      ) : (
        materials.output.map((material) => (
          <Grid item xs={12} sm={6} md={4} key={material.id}>
            <MaterialCard
              material={material}
              onDelete={(id) => handleDeleteMaterial('output', id)}
              isSelected={selectedPipe?.id === material.id}
              onSelect={setSelectedPipe}
            />
          </Grid>
        ))
      )}
    </Grid>
  </Paper>
</Grid>

{/* Кнопки управления для выходного кармана */}
<Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
  {sectionConfig.finishedGoodsUnitId && (
    <Button 
      variant="contained" 
      color="primary"
      startIcon={<ArrowForwardIcon />}
      onClick={() => {
        if (!selectedPipe) {
          setSnackbar({
            open: true,
            message: 'Выберите материал для перемещения',
            severity: 'warning'
          });
          return;
        }
        // Проверяем, что выбранный материал в выходном кармане
        const isInOutput = materials.output.some(m => m.id === selectedPipe.id);
        if (!isInOutput) {
          setSnackbar({
            open: true,
            message: 'Выбранный материал не находится в выходном кармане',
            severity: 'warning'
          });
          return;
        }
        handleMoveToFinishedGoods();
      }}
      disabled={!selectedPipe || getSelectedMaterialLocation() !== 'output'}
      sx={{ flex: 1 }}
    >
      На склад готовой продукции
    </Button>
  )}
  {nextSection && (
    <Button 
      variant="contained" 
      color="success"
      startIcon={<ArrowForwardIcon />}
      onClick={() => {
        if (!selectedPipe) {
          setSnackbar({
            open: true,
            message: 'Выберите материал для перемещения',
            severity: 'warning'
          });
          return;
        }
        // Проверяем, что выбранный материал в выходном кармане
        const isInOutput = materials.output.some(m => m.id === selectedPipe.id);
        if (!isInOutput) {
          setSnackbar({
            open: true,
            message: 'Выбранный материал не находится в выходном кармане',
            severity: 'warning'
          });
          return;
        }
        handleMoveToNextSection(selectedPipe);
      }}
      disabled={!selectedPipe || !nextSection || getSelectedMaterialLocation() !== 'output'}
      sx={{ flex: 1 }}
    >
      Переместить на следующий участок
    </Button>
  )}
  <Button 
    variant="outlined" 
    color="error"
    startIcon={<CloseIcon />}
    onClick={() => {
      if (!selectedPipe) {
        setSnackbar({
          open: true,
          message: 'Выберите материал для перемещения в брак',
          severity: 'warning'
        });
        return;
      }
      // Проверяем, что выбранный материал в выходном кармане
      const isInOutput = materials.output.some(m => m.id === selectedPipe.id);
      if (!isInOutput) {
        setSnackbar({
          open: true,
          message: 'Выбранный материал не находится в выходном кармане',
          severity: 'warning'
        });
        return;
      }
      handleMoveToDefectFromOutput(selectedPipe);
    }}
    disabled={!selectedPipe || getSelectedMaterialLocation() !== 'output'}
    sx={{ flex: 1 }}
  >
    Переместить в брак
  </Button>
</Box>

            {/* КАРМАН БРАКА */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: '#fff5f5' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Warning color="error" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="error">
                    КАРМАН БРАКА
                    <Chip 
                      label={`${materials.defect.length} материалов`}
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Typography>
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {materials.defect.length === 0 ? (
                    <Grid item xs={12}>
                      <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#fff0f0', borderRadius: 1 }}>
                        <Typography color="text.secondary">
                          Бракованных материалов нет
                        </Typography>
                      </Box>
                    </Grid>
                  ) : (
                    materials.defect.map((material) => (
                      <Grid item xs={12} sm={6} md={4} key={material.id}>
                        <MaterialCard
                          material={material}
                          onDelete={(id) => handleDeleteMaterial('defect', id)}
                          isSelected={selectedPipe?.id === material.id}
                          onSelect={setSelectedPipe}
                          sectionType="defect"						 
                        />
                      </Grid>
                    ))
                  )}
                </Grid>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="error"
                    onClick={handleWriteOffToDefectWarehouse}
                    disabled={!selectedPipe || getSelectedMaterialLocation() !== 'defect'}
                  >
                    Списать
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
        onSelectMaterial={(material) => {
          setSelectedMaterial(material);
          setQuantityDialogOpen(true);
        }}
        currentUnitId={currentUnitId}
      />

      {/* ДИАЛОГ УКАЗАНИЯ КОЛИЧЕСТВА */}
      <QuantityDialog
        open={quantityDialogOpen}
        onClose={() => setQuantityDialogOpen(false)}
        material={selectedMaterial}
        onConfirm={handleAddFromWarehouse}
      />

      {/* ДИАЛОГ ИСТОРИИ ОПЕРАЦИЙ */}
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