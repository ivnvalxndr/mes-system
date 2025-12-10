// pages/production/ProductionOverview.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Chip,
} from '@mui/material';
import {
  Forklift as UTOIcon,
  Upload as LoadingIcon,
  Sort as SortingIcon,
} from '@mui/icons-material';

// Простые данные для теста
const sections = [
  { id: 'uto1', name: 'УТО1', description: 'Узел транспортного оборудования 1', icon: <UTOIcons />, color: '#3b82f6' },
  { id: 'uto2', name: 'УТО2', description: 'Узел транспортного оборудования 2', icon: <UTOIcons />, color: '#10b981' },
  { id: 'loading1', name: 'Загрузка 1', description: 'Участок загрузки материалов 1', icon: <LoadingIcon />, color: '#f59e0b' },
  { id: 'loading2', name: 'Загрузка 2', description: 'Участок загрузки материалов 2', icon: <LoadingIcon />, color: '#8b5cf6' },
  { id: 'sorting1', name: 'Сортировка 1', description: 'Стол для сортировки материалов 1', icon: <SortingIcon />, color: '#ef4444' },
  { id: 'sorting2', name: 'Сортировка 2', description: 'Стол для сортировки материалов 2', icon: <SortingIcon />, color: '#06b6d4' },
];

function ProductionOverview() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Производственные участки
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Выберите участок для просмотра
      </Typography>

      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={section.id}>
            <Card>
              <CardActionArea 
                onClick={() => navigate(`/production/${section.id}`)}
                sx={{ p: 2 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 2, 
                      bgcolor: `${section.color}15`,
                      color: section.color,
                      mr: 2 
                    }}>
                      {section.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {section.name}
                      </Typography>
                      <Chip label="Активен" size="small" color="success" />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ProductionOverview;