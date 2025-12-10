// pages/production/SectionPage.jsx
import React from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

function SectionPage() {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  // Простые данные для теста
  const sectionData = {
    uto1: {
      name: 'УТО1',
      description: 'Узел транспортного оборудования 1',
      loading: [
        { id: 1, material: 'Труба 57х3.5', quantity: 50, unit: 'шт' },
        { id: 2, material: 'Труба 76х4', quantity: 30, unit: 'шт' },
      ],
      output: [
        { id: 1, material: 'Готовые узлы', quantity: 15, unit: 'шт' },
      ],
      defects: [
        { id: 1, material: 'Труба 108х4', quantity: 2, reason: 'Коррозия' },
      ],
    },
  };

  const section = sectionData[sectionId] || sectionData.uto1;

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
        <Typography variant="h4" fontWeight="bold">
          {section.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {section.description}
        </Typography>
      </Box>

      {/* Основной макет */}
      <Grid container spacing={3}>
        {/* Загрузочный карман (30%) */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Загрузочный карман
            </Typography>
            {section.loading.map((item) => (
              <Card key={item.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography fontWeight="bold">{item.material}</Typography>
                  <Typography>
                    {item.quantity} {item.unit}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        {/* Правая часть (70%) */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {/* Выходной карман */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom color="success">
                  Выходной карман
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Материал</TableCell>
                        <TableCell align="right">Количество</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {section.output.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.material}</TableCell>
                          <TableCell align="right">
                            {item.quantity} {item.unit}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Карман брака */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: '#fee2e2' }}>
                <Typography variant="h6" gutterBottom color="error">
                  Карман брака
                </Typography>
                <Grid container spacing={2}>
                  {section.defects.map((item) => (
                    <Grid item xs={12} md={6} key={item.id}>
                      <Card>
                        <CardContent>
                          <Typography fontWeight="bold" color="error">
                            {item.material}
                          </Typography>
                          <Typography>
                            {item.quantity} ед. • {item.reason}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SectionPage;