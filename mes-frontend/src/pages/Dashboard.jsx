import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Tooltip,
  Divider,
} from '@mui/material'
import {
  Factory,
  Inventory,
  Build,
  Assessment,
  TrendingUp,
  TrendingDown,
  Refresh,
  Add,
  Warning,
  CheckCircle,
  Schedule,
  BarChart,
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

// API импорты
import { 
  productionAPI, 
  materialsAPI, 
  unitsAPI, 
  reportsAPI 
} from '../services/api'

const Dashboard = () => {
  // Запросы данных
  const { data: kpiData, isLoading: kpiLoading, refetch: refetchKPI } = useQuery({
    queryKey: ['kpi'],
    queryFn: reportsAPI.getKPI,
  })

  const { data: productionData, isLoading: productionLoading } = useQuery({
    queryKey: ['production-orders'],
    queryFn: productionAPI.getOrders,
  })

  const { data: materialsData, isLoading: materialsLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: materialsAPI.getMaterials,
  })

  const { data: unitsData, isLoading: unitsLoading } = useQuery({
    queryKey: ['units'],
    queryFn: unitsAPI.getUnits,
  })

  const isLoading = kpiLoading || productionLoading || materialsLoading || unitsLoading

  // Быстрые действия
  const quickActions = [
    { title: 'Новый заказ', icon: <Add />, color: '#1976d2', path: '/production/new' },
    { title: 'Добавить материал', icon: <Inventory />, color: '#2e7d32', path: '/materials/new' },
    { title: 'Обновить оборудование', icon: <Build />, color: '#ed6c02', path: '/units' },
    { title: 'Создать отчет', icon: <Assessment />, color: '#9c27b0', path: '/reports/new' },
  ]

  // Статистика карточек
  const statsCards = [
    { 
      title: 'Производство', 
      icon: <Factory />, 
      color: '#1976d2', 
      endpoint: '/production',
      data: {
        total: productionData?.data?.length || 0,
        completed: productionData?.data?.filter(o => o.status === 'Completed')?.length || 0,
        inProgress: productionData?.data?.filter(o => o.status === 'InProgress')?.length || 0,
      }
    },
    { 
      title: 'Материалы', 
      icon: <Inventory />, 
      color: '#2e7d32', 
      endpoint: '/materials',
      data: {
        total: materialsData?.data?.length || 0,
        lowStock: materialsData?.data?.filter(m => m.quantity <= m.minQuantity)?.length || 0,
        inProduction: materialsData?.data?.filter(m => m.status === 'InProduction')?.length || 0,
      }
    },
    { 
      title: 'Оборудование', 
      icon: <Build />, 
      color: '#ed6c02', 
      endpoint: '/units',
      data: {
        total: unitsData?.data?.length || 0,
        available: unitsData?.data?.filter(u => u.status === 'Available')?.length || 0,
        inUse: unitsData?.data?.filter(u => u.status === 'InUse')?.length || 0,
      }
    },
    { 
      title: 'Эффективность (OEE)', 
      icon: <Assessment />, 
      color: '#9c27b0', 
      endpoint: '/reports',
      data: {
        value: kpiData?.data?.oee || 0,
        trend: kpiData?.data?.oee > 80 ? 'up' : 'down',
      }
    },
  ]

  // Последние заказы
  const recentOrders = productionData?.data?.slice(0, 5) || []

  // Материалы с низким запасом
  const lowStockMaterials = materialsData?.data?.filter(m => m.quantity <= m.minQuantity) || []

  // Оборудование в работе
  const unitsInUse = unitsData?.data?.filter(u => u.status === 'InUse') || []

  // Функция для получения цвета статуса
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'success'
      case 'InProgress': return 'warning'
      case 'Draft': return 'default'
      case 'Planned': return 'info'
      case 'Cancelled': return 'error'
      default: return 'default'
    }
  }

  // Функция для получения текста статуса
  const getStatusText = (status) => {
    const statusMap = {
      'Completed': 'Завершен',
      'InProgress': 'В работе',
      'Draft': 'Черновик',
      'Planned': 'Запланирован',
      'Cancelled': 'Отменен',
    }
    return statusMap[status] || status
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      {/* Заголовок и обновление */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Панель управления MES
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />}
          onClick={() => {
            refetchKPI()
          }}
        >
          Обновить
        </Button>
      </Box>

      {/* Быстрые действия */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {quickActions.map((action) => (
          <Grid item xs={6} sm={3} key={action.title}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
                transition: 'all 0.3s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                bgcolor: action.color,
                color: 'white'
              }}
              component={Link}
              to={action.path}
            >
              <Box sx={{ fontSize: 40, mb: 1 }}>
                {action.icon}
              </Box>
              <Typography variant="body1" align="center">
                {action.title}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Статистические карточки */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 },
                height: '100%'
              }}
              component={Link}
              to={stat.endpoint}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ color: stat.color, mr: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h6">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>

                {stat.title === 'Эффективность (OEE)' ? (
                  <>
                    <Typography variant="h3" sx={{ color: stat.color, textAlign: 'center', my: 2 }}>
                      {stat.data.value.toFixed(1)}%
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {stat.data.trend === 'up' ? (
                        <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                      ) : (
                        <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
                      )}
                      <Typography variant="body2" color="textSecondary">
                        {stat.data.trend === 'up' ? 'Выше цели' : 'Ниже цели'}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant="h4" sx={{ textAlign: 'center', my: 1 }}>
                      {stat.data.total}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center">
                      Всего
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      {stat.title === 'Производство' && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Завершено:</Typography>
                            <Chip label={stat.data.completed} size="small" color="success" />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">В работе:</Typography>
                            <Chip label={stat.data.inProgress} size="small" color="warning" />
                          </Box>
                        </>
                      )}
                      
                      {stat.title === 'Материалы' && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Низкий запас:</Typography>
                            <Chip 
                              label={stat.data.lowStock} 
                              size="small" 
                              color={stat.data.lowStock > 0 ? "error" : "default"}
                              icon={stat.data.lowStock > 0 ? <Warning /> : undefined}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">В производстве:</Typography>
                            <Chip label={stat.data.inProduction} size="small" color="info" />
                          </Box>
                        </>
                      )}
                      
                      {stat.title === 'Оборудование' && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Доступно:</Typography>
                            <Chip label={stat.data.available} size="small" color="success" />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">В работе:</Typography>
                            <Chip label={stat.data.inUse} size="small" color="warning" />
                          </Box>
                        </>
                      )}
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Два столбца: Последние заказы и предупреждения */}
      <Grid container spacing={3}>
        {/* Последние производственные заказы */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Последние производственные заказы
              </Typography>
              <Button 
                size="small" 
                component={Link}
                to="/production"
              >
                Все заказы →
              </Button>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>№ Заказа</TableCell>
                    <TableCell>Продукт</TableCell>
                    <TableCell>Количество</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Дата создания</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow 
                      key={order.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => window.location.href = `/production/${order.id}`}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {order.orderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell>{order.quantity} шт.</TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusText(order.status)} 
                          size="small"
                          color={getStatusColor(order.status)}
                        />
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.createdAt), 'dd.MM.yyyy', { locale: ru })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {recentOrders.length === 0 && (
              <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 4 }}>
                Нет производственных заказов
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Предупреждения и KPI */}
        <Grid item xs={12} md={4}>
          {/* Предупреждения о низком запасе */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Warning color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Низкий запас материалов
              </Typography>
            </Box>
            
            {lowStockMaterials.length > 0 ? (
              <Box>
                {lowStockMaterials.slice(0, 3).map((material) => (
                  <Box key={material.id} sx={{ mb: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {material.name}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Текущий: {material.quantity} / Минимум: {material.minQuantity} {material.unit}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(material.quantity / material.minQuantity) * 100} 
                      color="warning"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                ))}
                
                {lowStockMaterials.length > 3 && (
                  <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
                    и еще {lowStockMaterials.length - 3} материалов
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
                Все материалы в норме
              </Typography>
            )}
            
            <Button 
              fullWidth 
              variant="outlined" 
              size="small"
              component={Link}
              to="/materials"
              sx={{ mt: 2 }}
            >
              Управление материалами
            </Button>
          </Paper>

          {/* KPI панель */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChart color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Ключевые показатели
              </Typography>
            </Box>
            
            {kpiData?.data ? (
              <Box>
                {[
                  { label: 'Общая эффективность (OEE)', value: kpiData.data.oee, color: '#1976d2' },
                  { label: 'Эффективность производства', value: kpiData.data.productionEfficiency, color: '#2e7d32' },
                  { label: 'Качество продукции', value: kpiData.data.qualityRate, color: '#9c27b0' },
                  { label: 'Использование материалов', value: kpiData.data.materialUsageEfficiency, color: '#ed6c02' },
                ].map((kpi) => (
                  <Box key={kpi.label} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{kpi.label}</Typography>
                      <Typography variant="body2" fontWeight="bold">{kpi.value?.toFixed(1) || 0}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={kpi.value || 0} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: `${kpi.color}20`,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: kpi.color
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
                Данные KPI не загружены
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Оборудование в работе */}
      {unitsInUse.length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Оборудование в работе
          </Typography>
          <Grid container spacing={2}>
            {unitsInUse.slice(0, 4).map((unit) => (
              <Grid item xs={12} sm={6} md={3} key={unit.id}>
                <Card sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Build color="warning" sx={{ mr: 1 }} />
                    <Typography variant="body1" fontWeight="bold">
                      {unit.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {unit.model}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Chip 
                      label={`Загрузка: ${unit.currentLoad || 0}%`} 
                      size="small"
                      color="info"
                    />
                    <Chip 
                      label="В работе" 
                      size="small"
                      color="warning"
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Container>
  )
}

export default Dashboard