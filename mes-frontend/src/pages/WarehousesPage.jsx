import React from 'react';
import { Container, Paper, Typography, Box, Alert } from '@mui/material';
import { Warehouse as WarehouseIcon } from '@mui/icons-material';

function WarehousesPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Склады
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Управление складскими запасами
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <WarehouseIcon sx={{ mr: 2, fontSize: 40, color: 'info.main' }} />
          <Box>
            <Typography variant="h6">
              Раздел в разработке
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Функциональность управления складами будет добавлена в следующих версиях
            </Typography>
          </Box>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          Запланированные функции:
        </Alert>
        
        <Box sx={{ pl: 2 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
          • Инвентаризация складов
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
          • Управление ячейками хранения
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
          • Приемка и отгрузка материалов
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
          • Отчеты по остаткам
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default WarehousesPage;