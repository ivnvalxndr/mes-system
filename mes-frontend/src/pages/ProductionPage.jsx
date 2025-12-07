import React from 'react';
import { Container, Paper, Typography, Box, Alert } from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';

function ProductionPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Производство
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Управление производственными процессами
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ConstructionIcon sx={{ mr: 2, fontSize: 40, color: 'warning.main' }} />
          <Box>
            <Typography variant="h6">
              Раздел в разработке
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Функциональность управления производством будет добавлена в следующих версиях
            </Typography>
          </Box>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          Запланированные функции:
        </Alert>
        
        <Box sx={{ pl: 2 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
          • Управление производственными заказами
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
          • Планирование производства
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
          • Контроль качества
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
          • Отслеживание выполнения
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default ProductionPage;