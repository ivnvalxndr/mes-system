import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Factory as FactoryIcon,
  Inventory as InventoryIcon,
  Inventory2 as PackageIcon,
} from '@mui/icons-material';

// Данные участков (синхронизированы с SECTION_MAPPING из SectionPage.jsx)
const sections = [
  { 
    id: 'loading1', 
    name: 'Загрузка труб', 
    description: 'Участок загрузки материалов и труб',
    unitId: 3,
    icon: <InventoryIcon />,
    color: '#f59e0b'
  },
  { 
    id: 'sorting1', 
    name: 'Сортировка', 
    description: 'Стол для сортировки материалов',
    unitId: 7,
    icon: <FactoryIcon />,
    color: '#ef4444'
  },
  { 
    id: 'packing1', 
    name: 'Упаковка', 
    description: 'Единица упаковки продукции',
    unitId: 9,
    icon: <PackageIcon />,
    color: '#84cc16'
  },
];

function ProductionOverview() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Производственные участки
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Управление производственными участками и материалами
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.id}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea 
                onClick={() => navigate(`/production/${section.id}`)}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: `${section.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <Box sx={{ color: section.color }}>
                        {section.icon}
                      </Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {section.name}
                      </Typography>
                      <Chip 
                        label={`Unit ID: ${section.unitId}`}
                        size="small"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="caption" color="primary" sx={{ fontWeight: 'medium' }}>
                      Перейти к участку →
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {sections.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Нет доступных участков
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Производственные участки будут отображаться здесь
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default ProductionOverview;
