import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Компонент карточки трубы (остается без изменений)
function PipeCard({ pipe, onDelete }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {pipe.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Код: {pipe.code}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => onDelete(pipe.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography variant="body2" sx={{ mt: 1 }}>
          Диаметр: {pipe.diameter}мм × {pipe.thickness}мм
        </Typography>
        <Typography variant="body2">
          Длина: {pipe.length}м
        </Typography>
        <Typography variant="body2">
          Материал: {pipe.material}
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
          {pipe.quantity} шт.
        </Typography>
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

  // Mock данные для склада (замените на реальный API)
  const mockWarehouseMaterials = [
    { id: 101, name: 'Труба 57×3.5', code: 'TP-001', type: 'Труба', quantity: 150, unit: 'шт.', specifications: { diameter: 57, thickness: 3.5, length: 6 } },
    { id: 102, name: 'Труба 76×4', code: 'TP-002', type: 'Труба', quantity: 80, unit: 'шт.', specifications: { diameter: 76, thickness: 4, length: 6 } },
    { id: 103, name: 'Труба 89×4', code: 'TP-003', type: 'Труба', quantity: 45, unit: 'шт.', specifications: { diameter: 89, thickness: 4, length: 6 } },
    { id: 104, name: 'Труба 108×4', code: 'TP-004', type: 'Труба', quantity: 30, unit: 'шт.', specifications: { diameter: 108, thickness: 4, length: 6 } },
    { id: 105, name: 'Труба 133×4.5', code: 'TP-005', type: 'Труба', quantity: 25, unit: 'шт.', specifications: { diameter: 133, thickness: 4.5, length: 6 } },
    { id: 106, name: 'Уголок 50×50×5', code: 'UG-001', type: 'Металлопрокат', quantity: 120, unit: 'шт.', specifications: { width: 50, height: 50, thickness: 5, length: 6 } },
    { id: 107, name: 'Лист стальной 2мм', code: 'LS-001', type: 'Лист', quantity: 25, unit: 'лист', specifications: { thickness: 2, width: 1500, length: 3000 } },
  ];

  // Загрузка материалов при открытии диалога
  useEffect(() => {
    if (open) {
      setLoading(true);
      // Имитация загрузки с API
      setTimeout(() => {
        setMaterials(mockWarehouseMaterials);
        setFilteredMaterials(mockWarehouseMaterials);
        setLoading(false);
      }, 500);
    }
  }, [open]);

  // Фильтрация по поиску
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
          onClick={onClose} 
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

// Главный компонент страницы участка
function SectionPage() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  
  // Начальные данные труб (остаются)
  const [pipes, setPipes] = useState({
    loading: [
      { id: 1, name: 'Труба 57×3.5', code: 'TP-001', diameter: 57, thickness: 3.5, length: 6, material: 'Сталь', quantity: 50 },
      { id: 2, name: 'Труба 76×4', code: 'TP-002', diameter: 76, thickness: 4, length: 6, material: 'Сталь', quantity: 30 },
      { id: 3, name: 'Труба 89×4', code: 'TP-003', diameter: 89, thickness: 4, length: 6, material: 'Сталь', quantity: 20 },
    ],
    output: [
      { id: 4, name: 'Готовые узлы', code: 'GN-001', diameter: 57, thickness: 3.5, length: 6, material: 'Сталь', quantity: 15 },
    ],
    defect: [
      { id: 5, name: 'Труба 108×4', code: 'TP-004', diameter: 108, thickness: 4, length: 6, material: 'Сталь', quantity: 2 },
    ],
  });
  
  // Новые состояния для диалогов склада
  const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Удалить трубу (остается без изменений)
  const handleDeletePipe = (pocket, pipeId) => {
    setPipes(prev => ({
      ...prev,
      [pocket]: prev[pocket].filter(pipe => pipe.id !== pipeId)
    }));
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
  const handleAddFromWarehouse = (material, quantity) => {
    // Создаем новую трубу на основе материала со склада
    const newPipe = {
      id: Date.now(),
      name: material.name,
      code: material.code,
      diameter: material.specifications?.diameter || 0,
      thickness: material.specifications?.thickness || 0,
      length: material.specifications?.length || 0,
      material: material.type || 'Сталь',
      quantity: quantity
    };
    
    // Добавляем в загрузочный карман
    setPipes(prev => ({
      ...prev,
      loading: [...prev.loading, newPipe]
    }));
    
    // Показываем уведомление
    setSnackbar({
      open: true,
      message: `Добавлено ${quantity} шт. "${material.name}"`,
      severity: 'success'
    });
  };

  // Переместить трубу из загрузки в выход (остается)
  const handleMoveToOutput = () => {
    if (pipes.loading.length === 0) return;
    
    const pipeToMove = pipes.loading[0];
    setPipes(prev => ({
      loading: prev.loading.filter(p => p.id !== pipeToMove.id),
      output: [...prev.output, pipeToMove]
    }));
  };

  // Переместить трубу в брак (остается)
  const handleMoveToDefect = () => {
    if (pipes.loading.length === 0) return;
    
    const pipeToMove = pipes.loading[0];
    setPipes(prev => ({
      loading: prev.loading.filter(p => p.id !== pipeToMove.id),
      defect: [...prev.defect, pipeToMove]
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/production')}
          sx={{ mb: 2 }}
        >
          Назад
        </Button>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {sectionId.toUpperCase()}
        </Typography>
      </Box>

      {/* ОСНОВНОЙ МАКЕТ С КАРМАНАМИ */}
      <Grid container spacing={3}>
        
        {/* ЛЕВАЯ ЧАСТЬ: ЗАГРУЗОЧНЫЙ КАРМАН (30% ширины) */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
              ЗАГРУЗОЧНЫЙ КАРМАН
            </Typography>
            
            {/* ГРИД труб */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {pipes.loading.map((pipe) => (
                <Grid item xs={12} key={pipe.id}>
                  <PipeCard 
                    pipe={pipe} 
                    onDelete={(id) => handleDeletePipe('loading', id)} 
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
              >
                Добавить со склада
              </Button>
              <Button 
                variant="outlined"
                onClick={handleMoveToOutput}
                disabled={pipes.loading.length === 0}
              >
                Начать обработку
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                onClick={handleMoveToDefect}
                disabled={pipes.loading.length === 0}
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