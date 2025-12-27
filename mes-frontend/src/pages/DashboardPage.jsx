import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Warehouse as WarehouseIcon,
  Factory as FactoryIcon
} from '@mui/icons-material';
import { warehouseService } from '../services/warehouseService';

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const allMaterials = await warehouseService.getAvailableMaterials();
      setMaterials(allMaterials);
      
      // Calculate real statistics
      const totalMaterials = allMaterials.length;
      const inProduction = allMaterials.filter(m => 
        m.unitId === 12 || m.unitId === 13 || m.unitId === 14 // Выходные карманы
      ).length;
      const lowStock = allMaterials.filter(m => 
        (m.pcs || m.quantity || 0) < 10 // Низкий запас менее 10 единиц
      ).length;
      const available = allMaterials.filter(m => 
        m.unitId === 11 // Общий склад
      ).length;

      setStats([
        { 
          title: 'Всего материалов', 
          value: totalMaterials.toString(), 
          icon: <InventoryIcon />, 
          color: '#1976d2',
          progress: totalMaterials > 0 ? (available / totalMaterials) * 100 : 0
        },
        { 
          title: 'В производстве', 
          value: inProduction.toString(), 
          icon: <FactoryIcon />, 
          color: '#2e7d32',
          progress: totalMaterials > 0 ? (inProduction / totalMaterials) * 100 : 0
        },
        { 
          title: 'Низкий запас', 
          value: lowStock.toString(), 
          icon: <WarningIcon />, 
          color: '#ed6c02',
          progress: totalMaterials > 0 ? (lowStock / totalMaterials) * 100 : 0
        },
        { 
          title: 'Доступно', 
          value: available.toString(), 
          icon: <CheckCircleIcon />, 
          color: '#0288d1',
          progress: totalMaterials > 0 ? (available / totalMaterials) * 100 : 0
        },
      ]);
    } catch (err) {
      console.error('Ошибка загрузки данных дашборда:', err);
      setError(`Ошибка загрузки: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  // Get recent materials (last 5)
  const recentMaterials = materials
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Calculate warehouse distribution
  const warehouseDistribution = [
    { name: 'Общий склад', count: materials.filter(m => m.unitId === 11).length, color: '#1976d2' },
    { name: 'Склад брака', count: materials.filter(m => m.unitId === 14).length, color: '#d32f2f' },
    { name: 'Склад готовой продукции', count: materials.filter(m => m.unitId === 15).length, color: '#2e7d32' },
    { name: 'В производстве', count: materials.filter(m => [12, 13].includes(m.unitId)).length, color: '#ed6c02' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Панель управления MES
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Обзор системы управления материалами
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    backgroundColor: `${stat.color}20`,
                    borderRadius: '50%',
                    p: 1,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {React.cloneElement(stat.icon, { sx: { color: stat.color } })}
                  </Box>
                  <Box>
                    <Typography variant="h6" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stat.progress || 0} 
                  sx={{ 
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: `${stat.color}20`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: stat.color
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Left Side - Warehouse Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Распределение по складам
            </Typography>
            <Box sx={{ mt: 2 }}>
              {warehouseDistribution.map((warehouse) => (
                <Box key={warehouse.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {warehouse.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {warehouse.count} материалов
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={materials.length > 0 ? (warehouse.count / materials.length) * 100 : 0}
                    sx={{ 
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: warehouse.color
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Right Side - Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Быстрые действия
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Управление складами:</strong> Просмотр и управление материалами на всех складах
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • <strong>Производство:</strong> Отслеживание материалов на производственных участках
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • <strong>Настройки:</strong> Конфигурация системы и управление пользователями
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardPage;