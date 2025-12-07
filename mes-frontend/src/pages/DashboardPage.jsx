import React from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

function DashboardPage() {
  const stats = [
    { title: 'Всего материалов', value: '156', icon: <InventoryIcon />, color: '#1976d2' },
    { title: 'В производстве', value: '23', icon: <TrendingUpIcon />, color: '#2e7d32' },
    { title: 'Низкий запас', value: '8', icon: <WarningIcon />, color: '#ed6c02' },
    { title: 'Доступно', value: '125', icon: <CheckCircleIcon />, color: '#0288d1' },
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
                  value={75} 
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

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Последние материалы
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Здесь будет таблица с последними добавленными материалами
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Статус запасов
            </Typography>
            <Typography variant="body2" color="text.secondary">
              График будет отображать уровень запасов материалов
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Быстрые действия
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Кнопки для быстрого доступа к часто используемым функциям
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardPage;