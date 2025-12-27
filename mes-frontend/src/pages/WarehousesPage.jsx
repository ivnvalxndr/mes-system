import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Button,
  IconButton,
} from '@mui/material';
import {
  Warehouse as WarehouseIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { warehouseService } from '../services/warehouseService';

// Константы для складов
const GENERAL_WAREHOUSE_ID = 11;
const DEFECT_WAREHOUSE_ID = 14;
const FINISHED_GOODS_WAREHOUSE_ID = 15;

function WarehouseTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`warehouse-tabpanel-${index}`}
      aria-labelledby={`warehouse-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function WarehousePage() {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [generalMaterials, setGeneralMaterials] = useState([]);
  const [defectMaterials, setDefectMaterials] = useState([]);
  const [finishedGoodsMaterials, setFinishedGoodsMaterials] = useState([]);
  const [filteredGeneral, setFilteredGeneral] = useState([]);
  const [filteredDefect, setFilteredDefect] = useState([]);
  const [filteredFinishedGoods, setFilteredFinishedGoods] = useState([]);
  const [searchGeneral, setSearchGeneral] = useState('');
  const [searchDefect, setSearchDefect] = useState('');
  const [searchFinishedGoods, setSearchFinishedGoods] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Обработка hash для переключения вкладок
  useEffect(() => {
    const hash = location.hash || window.location.hash;
    if (hash === '#general' || hash === '' || !hash) {
      setTabValue(0);
    } else if (hash === '#defect') {
      setTabValue(1);
    } else if (hash === '#finished-goods') {
      setTabValue(2);
    }
  }, [location.hash]);

  useEffect(() => {
    loadMaterials();
  }, []);

  useEffect(() => {
    // Фильтрация материалов общего склада
    if (searchGeneral) {
      const filtered = generalMaterials.filter(
        (material) =>
          material.name?.toLowerCase().includes(searchGeneral.toLowerCase()) ||
          material.code?.toLowerCase().includes(searchGeneral.toLowerCase())
      );
      setFilteredGeneral(filtered);
    } else {
      setFilteredGeneral(generalMaterials);
    }
  }, [searchGeneral, generalMaterials]);

  useEffect(() => {
    // Фильтрация материалов склада брака
    if (searchDefect) {
      const filtered = defectMaterials.filter(
        (material) =>
          material.name?.toLowerCase().includes(searchDefect.toLowerCase()) ||
          material.code?.toLowerCase().includes(searchDefect.toLowerCase())
      );
      setFilteredDefect(filtered);
    } else {
      setFilteredDefect(defectMaterials);
    }
  }, [searchDefect, defectMaterials]);

  useEffect(() => {
    // Фильтрация материалов склада готовой продукции
    if (searchFinishedGoods) {
      const filtered = finishedGoodsMaterials.filter(
        (material) =>
          material.name?.toLowerCase().includes(searchFinishedGoods.toLowerCase()) ||
          material.code?.toLowerCase().includes(searchFinishedGoods.toLowerCase())
      );
      setFilteredFinishedGoods(filtered);
    } else {
      setFilteredFinishedGoods(finishedGoodsMaterials);
    }
  }, [searchFinishedGoods, finishedGoodsMaterials]);

  const loadMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const allMaterials = await warehouseService.getAvailableMaterials();
      
      // Фильтруем материалы по unit_id
      const general = allMaterials.filter(
        (item) => item.unitId === GENERAL_WAREHOUSE_ID
      );
      const defect = allMaterials.filter(
        (item) => item.unitId === DEFECT_WAREHOUSE_ID
      );
      const finishedGoods = allMaterials.filter(
        (item) => item.unitId === FINISHED_GOODS_WAREHOUSE_ID
      );

      // Форматируем материалы
      const formatMaterial = (item) => ({
        id: item.id,
        name: item.name,
        code: item.code || `MAT-${item.id}`,
        quantity: item.pcs || item.quantity || 0,
        unit: typeof item.unit === 'string' ? item.unit : (item.unit?.name || 'шт.'),
        description: item.description || '',
        unitId: item.unitId,
      });

      setGeneralMaterials(general.map(formatMaterial));
      setDefectMaterials(defect.map(formatMaterial));
      setFinishedGoodsMaterials(finishedGoods.map(formatMaterial));
      setFilteredGeneral(general.map(formatMaterial));
      setFilteredDefect(defect.map(formatMaterial));
      setFilteredFinishedGoods(finishedGoods.map(formatMaterial));
    } catch (err) {
      console.error('Ошибка загрузки материалов:', err);
      setError(`Ошибка загрузки: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Обновляем hash в URL
    let hash;
    if (newValue === 0) {
      hash = '#general';
    } else if (newValue === 1) {
      hash = '#defect';
    } else if (newValue === 2) {
      hash = '#finished-goods';
    }
    window.location.hash = hash;
  };

  const renderMaterialsTable = (materials, emptyMessage) => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (materials.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography color="text.secondary">{emptyMessage}</Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Код</TableCell>
              <TableCell>Наименование</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell align="right">Количество</TableCell>
              <TableCell>Ед. изм.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id} hover>
                <TableCell>
                  <Chip label={material.code} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {material.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {material.description || '-'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" fontWeight="bold">
                    {material.quantity.toLocaleString('ru-RU')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{material.unit}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WarehouseIcon sx={{ mr: 2, fontSize: 40, color: 'info.main' }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Склады
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Управление складскими запасами
        </Typography>
      </Box>

      {/* Ошибка */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Статистика */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Общий склад
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {generalMaterials.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {generalMaterials.reduce((sum, m) => sum + m.quantity, 0).toLocaleString('ru-RU')} единиц
                  </Typography>
                </Box>
                <WarehouseIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#fff5f5' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Склад брака
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="error">
                    {defectMaterials.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {defectMaterials.reduce((sum, m) => sum + m.quantity, 0).toLocaleString('ru-RU')} единиц
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 48, color: 'error.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#f0f8ff' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Склад готовой продукции
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success">
                    {finishedGoodsMaterials.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {finishedGoodsMaterials.reduce((sum, m) => sum + m.quantity, 0).toLocaleString('ru-RU')} единиц
                  </Typography>
                </Box>
                <WarehouseIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Вкладки */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="warehouse tabs">
            <Tab label={`Общий склад (Unit ${GENERAL_WAREHOUSE_ID})`} />
            <Tab label={`Склад брака (Unit ${DEFECT_WAREHOUSE_ID})`} />
            <Tab label={`Склад готовой продукции (Unit ${FINISHED_GOODS_WAREHOUSE_ID})`} />
          </Tabs>
          <IconButton onClick={loadMaterials} disabled={loading} title="Обновить данные">
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* Вкладка Общий склад */}
        <WarehouseTabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Поиск по названию или коду..."
              value={searchGeneral}
              onChange={(e) => setSearchGeneral(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {renderMaterialsTable(
              filteredGeneral,
              'На общем складе нет материалов'
            )}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Всего материалов: {filteredGeneral.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Общее количество: {filteredGeneral.reduce((sum, m) => sum + m.quantity, 0).toLocaleString('ru-RU')} единиц
              </Typography>
            </Box>
          </Box>
        </WarehouseTabPanel>

        {/* Вкладка Склад брака */}
        <WarehouseTabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Поиск по названию или коду..."
              value={searchDefect}
              onChange={(e) => setSearchDefect(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {renderMaterialsTable(
              filteredDefect,
              'На складе брака нет материалов'
            )}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Всего материалов: {filteredDefect.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Общее количество: {filteredDefect.reduce((sum, m) => sum + m.quantity, 0).toLocaleString('ru-RU')} единиц
              </Typography>
            </Box>
          </Box>
        </WarehouseTabPanel>

        {/* Вкладка Склад готовой продукции */}
        <WarehouseTabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Поиск по названию или коду..."
              value={searchFinishedGoods}
              onChange={(e) => setSearchFinishedGoods(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {renderMaterialsTable(
              filteredFinishedGoods,
              'На складе готовой продукции нет материалов'
            )}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Всего материалов: {filteredFinishedGoods.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Общее количество: {filteredFinishedGoods.reduce((sum, m) => sum + m.quantity, 0).toLocaleString('ru-RU')} единиц
              </Typography>
            </Box>
          </Box>
        </WarehouseTabPanel>
      </Paper>
    </Container>
  );
}

export default WarehousePage;
