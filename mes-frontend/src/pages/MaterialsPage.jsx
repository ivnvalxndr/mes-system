// src/pages/MaterialsPage.jsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Alert,
  Snackbar,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import MaterialList from '../components/Materials/MaterialList';
import MaterialForm from '../components/Materials/MaterialForm';

function MaterialsPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);

  const handleOpenCreateDialog = () => {
    setSelectedMaterial(null);
    setViewMode(false);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (material) => {
    setSelectedMaterial(material);
    setViewMode(false);
    setOpenDialog(true);
  };

  const handleOpenViewDialog = (material) => {
    setSelectedMaterial(material);
    setViewMode(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMaterial(null);
    setViewMode(false);
  };

  const handleSuccess = () => {
    handleCloseDialog();
    showSnackbar('Операция выполнена успешно!', 'success');
    // Можно добавить здесь обновление списка, если нужно
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Управление материалами
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Создание, редактирование и удаление материалов производства
            </Typography>
          </Box>
          <Tooltip title="Обновить список">
            <IconButton onClick={() => window.location.reload()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Список материалов" />
            <Tab label="Статистика" />
            <Tab label="Архив" />
          </Tabs>
        </Paper>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <TextField
              size="small"
              placeholder="Поиск по коду или названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, opacity: 0.5 }} />,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Режим поиска активен' : 'Введите текст для поиска'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            sx={{ minWidth: 200 }}
          >
            Добавить материал
          </Button>
        </Box>

        <MaterialList 
          searchTerm={searchTerm}
          onEdit={handleOpenEditDialog}
          onView={handleOpenViewDialog}
        />
      </Paper>

      {/* Диалог для создания/редактирования/просмотра */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {viewMode ? 'Просмотр материала' : selectedMaterial ? 'Редактировать материал' : 'Добавить новый материал'}
          {selectedMaterial && (
            <Typography variant="body2" color="text.secondary" fontWeight="normal">
              Код: {selectedMaterial.code}
            </Typography>
          )}
        </DialogTitle>
        
        <DialogContent>
          {viewMode && selectedMaterial ? (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Режим просмотра. Для редактирования нажмите кнопку "Редактировать" в списке.
              </Alert>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Код"
                  value={selectedMaterial.code}
                  InputProps={{ readOnly: true }}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Наименование"
                  value={selectedMaterial.name}
                  InputProps={{ readOnly: true }}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Количество"
                  value={selectedMaterial.quantity}
                  InputProps={{ readOnly: true }}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Цена"
                  value={`${selectedMaterial.price} ₽`}
                  InputProps={{ readOnly: true }}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Единица измерения"
                  value={selectedMaterial.unitName || 'Не указано'}
                  InputProps={{ readOnly: true }}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Описание"
                  value={selectedMaterial.description || 'Нет описания'}
                  InputProps={{ readOnly: true }}
                  multiline
                  rows={3}
                  size="small"
                  fullWidth
                />
              </Box>
            </Box>
          ) : (
            <MaterialForm
              material={selectedMaterial}
              onSuccess={handleSuccess}
              onCancel={handleCloseDialog}
            />
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {!viewMode && (
            <>
              <Button onClick={handleCloseDialog} color="inherit">
                Отмена
              </Button>
              <Button 
                type="submit" 
                form="material-form" 
                variant="contained"
                disabled={false} // Форма сама управляет disabled
              >
                {selectedMaterial ? 'Обновить' : 'Создать'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar для уведомлений */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default MaterialsPage;