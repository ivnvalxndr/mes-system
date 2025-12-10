import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, TextField, Button,
  InputAdornment, Chip, Box, Typography, IconButton,
  CircularProgress, Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { warehouseService } from '../../services/warehouseService';

const MaterialSelectionDialog = ({ open, onClose, onSelectMaterial, sectionId }) => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    if (open) {
      loadMaterials();
      loadMaterialTypes();
    }
  }, [open, sectionId]);

  useEffect(() => {
    let filtered = materials;
    
    // Фильтр по поиску
    if (search) {
      filtered = filtered.filter(material =>
        material.name?.toLowerCase().includes(search.toLowerCase()) ||
        material.code?.toLowerCase().includes(search.toLowerCase()) ||
        material.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Фильтр по типу
    if (selectedType !== 'all') {
      filtered = filtered.filter(material => material.type === selectedType);
    }
    
    setFilteredMaterials(filtered);
    setPage(0); // Сброс на первую страницу при фильтрации
  }, [search, selectedType, materials]);

  const loadMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await warehouseService.getAvailableMaterials({
        minQuantity: 1, // только с ненулевым количеством
        location: sectionId // опционально для фильтра по участку
      });
      setMaterials(data);
      setFilteredMaterials(data);
    } catch (err) {
      setError('Не удалось загрузить материалы со склада');
      console.error('Error loading materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMaterialTypes = async () => {
    try {
      const types = await warehouseService.getMaterialTypes();
      setMaterialTypes(types);
    } catch (err) {
      console.error('Error loading material types:', err);
    }
  };

  const handleSelect = (material) => {
    onSelectMaterial(material);
  };

  const handleRefresh = () => {
    loadMaterials();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{ sx: { height: '80vh' } }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            Выбор материала со склада
          </Typography>
          <Button 
            onClick={handleRefresh} 
            startIcon={<CheckCircleIcon />}
            variant="outlined"
            size="small"
          >
            Обновить
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Панель фильтров */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              placeholder="Поиск по названию, коду или описанию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              onClick={() => setSearch('')}
              size="small"
            >
              Очистить
            </Button>
          </Box>
          
          {/* Фильтр по типам */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="Все"
              onClick={() => setSelectedType('all')}
              color={selectedType === 'all' ? 'primary' : 'default'}
              size="small"
            />
            {materialTypes.map((type) => (
              <Chip
                key={type}
                label={type}
                onClick={() => setSelectedType(type)}
                color={selectedType === type ? 'primary' : 'default'}
                size="small"
              />
            ))}
          </Box>
        </Box>

        {/* Загрузка или ошибка */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {/* Таблица материалов */}
        {!loading && !error && (
          <TableContainer sx={{ maxHeight: 'calc(80vh - 200px)' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Код</TableCell>
                  <TableCell>Наименование</TableCell>
                  <TableCell>Тип</TableCell>
                  <TableCell>Характеристики</TableCell>
                  <TableCell align="right">Доступно</TableCell>
                  <TableCell>Ед. изм.</TableCell>
                  <TableCell>Местоположение</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMaterials
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((material) => (
                    <TableRow 
                      key={material._id || material.id} 
                      hover
                      sx={{ 
                        opacity: material.quantity > 0 ? 1 : 0.6,
                        cursor: material.quantity > 0 ? 'pointer' : 'default'
                      }}
                    >
                      <TableCell>
                        <Chip 
                          label={material.code} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {material.name}
                        </Typography>
                        {material.description && (
                          <Typography variant="caption" color="text.secondary">
                            {material.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={material.type || 'Не указан'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        {material.specifications && (
                          <Box>
                            {material.specifications.diameter && (
                              <Typography variant="body2">
                                Ø: {material.specifications.diameter}мм
                              </Typography>
                            )}
                            {material.specifications.thickness && (
                              <Typography variant="body2">
                                Толщ.: {material.specifications.thickness}мм
                              </Typography>
                            )}
                            {material.specifications.length && (
                              <Typography variant="body2">
                                Длина: {material.specifications.length}м
                              </Typography>
                            )}
                          </Box>
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
                      </TableCell>
                      <TableCell>{material.unit || 'шт.'}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {material.location || 'Основной склад'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleSelect(material)}
                          disabled={material.quantity <= 0}
                          startIcon={<CheckCircleIcon />}
                        >
                          Выбрать
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Пагинация */}
        {!loading && !error && (
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
            labelRowsPerPage="Строк на странице:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} из ${count}`
            }
          />
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Отмена
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          Найдено материалов: {filteredMaterials.length}
        </Typography>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialSelectionDialog;