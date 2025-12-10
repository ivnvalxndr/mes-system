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
} from '@mui/material';

// Данные участков
const sections = [
  { id: 'uto1', name: 'УТО1', description: 'Узел транспортного оборудования 1' },
  { id: 'uto2', name: 'УТО2', description: 'Узел транспортного оборудования 2' },
  { id: 'loading1', name: 'Загрузка 1', description: 'Участок загрузки материалов 1' },
  { id: 'loading2', name: 'Загрузка 2', description: 'Участок загрузки материалов 2' },
];

function ProductionOverview() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Производственные участки
      </Typography>
      
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/production/${section.id}`)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {section.name}
                  </Typography>
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