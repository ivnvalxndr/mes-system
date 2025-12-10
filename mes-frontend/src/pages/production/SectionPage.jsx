import React, { useState } from 'react';
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle,
  Warning,
} from '@mui/icons-material';

// Компонент карточки трубы
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

// Главный компонент страницы участка
function SectionPage() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  
  // Начальные данные труб
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
  
  const [newPipeDialog, setNewPipeDialog] = useState(false);
  const [newPipe, setNewPipe] = useState({
    name: '',
    code: '',
    diameter: '',
    thickness: '',
    length: '',
    material: '',
    quantity: '',
  });

  // Удалить трубу
  const handleDeletePipe = (pocket, pipeId) => {
    setPipes(prev => ({
      ...prev,
      [pocket]: prev[pocket].filter(pipe => pipe.id !== pipeId)
    }));
  };

  // Добавить новую трубу
  const handleAddPipe = () => {
    const pipeToAdd = {
      id: Date.now(),
      ...newPipe,
      diameter: parseInt(newPipe.diameter) || 0,
      thickness: parseFloat(newPipe.thickness) || 0,
      length: parseFloat(newPipe.length) || 0,
      quantity: parseInt(newPipe.quantity) || 0,
    };
    
    setPipes(prev => ({
      ...prev,
      loading: [...prev.loading, pipeToAdd]
    }));
    
    setNewPipeDialog(false);
    setNewPipe({
      name: '', code: '', diameter: '', thickness: '', length: '', material: '', quantity: ''
    });
  };

  // Переместить трубу из загрузки в выход
  const handleMoveToOutput = () => {
    if (pipes.loading.length === 0) return;
    
    const pipeToMove = pipes.loading[0];
    setPipes(prev => ({
      loading: prev.loading.filter(p => p.id !== pipeToMove.id),
      output: [...prev.output, pipeToMove]
    }));
  };

  // Переместить трубу в брак
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
                onClick={() => setNewPipeDialog(true)}
              >
                Зарегистрировать пакет
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

      {/* ДИАЛОГ ДОБАВЛЕНИЯ ТРУБЫ */}
      <Dialog open={newPipeDialog} onClose={() => setNewPipeDialog(false)}>
        <DialogTitle>Добавить трубу</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Наименование"
              value={newPipe.name}
              onChange={(e) => setNewPipe({...newPipe, name: e.target.value})}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Код"
                value={newPipe.code}
                onChange={(e) => setNewPipe({...newPipe, code: e.target.value})}
                fullWidth
              />
              <TextField
                label="Количество"
                type="number"
                value={newPipe.quantity}
                onChange={(e) => setNewPipe({...newPipe, quantity: e.target.value})}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Диаметр (мм)"
                type="number"
                value={newPipe.diameter}
                onChange={(e) => setNewPipe({...newPipe, diameter: e.target.value})}
                fullWidth
              />
              <TextField
                label="Толщина (мм)"
                type="number"
                value={newPipe.thickness}
                onChange={(e) => setNewPipe({...newPipe, thickness: e.target.value})}
                fullWidth
              />
              <TextField
                label="Длина (м)"
                type="number"
                value={newPipe.length}
                onChange={(e) => setNewPipe({...newPipe, length: e.target.value})}
                fullWidth
              />
            </Box>
            <TextField
              label="Материал"
              value={newPipe.material}
              onChange={(e) => setNewPipe({...newPipe, material: e.target.value})}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPipeDialog(false)}>Отмена</Button>
          <Button onClick={handleAddPipe} variant="contained">Добавить</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SectionPage;