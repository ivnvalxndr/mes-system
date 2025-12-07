// src/components/Materials/MaterialList.jsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { materialApi } from '../../services/api';

function MaterialList({ searchTerm, onEdit, onView }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, materialId: null });

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await materialApi.getAll();
      setMaterials(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Ошибка при загрузке материалов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.materialId) return;

    try {
      await materialApi.delete(deleteDialog.materialId);
      setMaterials(materials.filter(m => m.id !== deleteDialog.materialId));
      setDeleteDialog({ open: false, materialId: null });
    } catch (err) {
      alert('Ошибка при удалении материала: ' + (err.response?.data?.message || err.message));
    }
  };

  const openDeleteDialog = (materialId) => {
    setDeleteDialog({ open: true, materialId });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, materialId: null });
  };

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchMaterials}>
              Повторить
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Код</TableCell>
              <TableCell>Наименование</TableCell>
              <TableCell>Ед. изм.</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Шагов маршрута</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMaterials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {searchTerm ? 'Материалы не найдены' : 'Материалы отсутствуют'}
                </TableCell>
              </TableRow>
            ) : (
              filteredMaterials.map((material) => (
                <TableRow key={material.id} hover>
                  <TableCell>
                    <Chip label={material.code} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {material.name}
                      </Typography>
                      {material.description && (
                        <Typography variant="body2" color="text.secondary">
                          {material.description}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={material.unitName || 'Н/Д'} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {material.quantity.toLocaleString('ru-RU')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                      }).format(material.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={material.routeSteps?.length || 0} 
                      size="small" 
                      color="secondary"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      title="Просмотр"
                      onClick={() => onView && onView(material)}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      title="Редактировать"
                      onClick={() => onEdit && onEdit(material)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      title="Удалить" 
                      color="error"
                      onClick={() => openDeleteDialog(material.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить этот материал? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Отмена</Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MaterialList;