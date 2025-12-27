// components/Layout/SidebarWithDropdown.jsx - СОЗДАЙТЕ НОВЫЙ ФАЙЛ
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Divider,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as MaterialsIcon,
  Factory as ProductionIcon,
  Warehouse as WarehouseIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';

const drawerWidth = 240;

function SidebarWithDropdown() {
  const navigate = useNavigate();
  const location = useLocation();
  const [productionOpen, setProductionOpen] = useState(false);

  // Список участков
  const productionSections = [
    { id: 'uto1', name: 'УТО1' },
    { id: 'uto2', name: 'УТО2' },
    { id: 'loading1', name: 'Загрузка 1' },
    { id: 'loading2', name: 'Загрузка 2' },
    { id: 'sorting1', name: 'Сортировка 1' },
    { id: 'sorting2', name: 'Сортировка 2' },
    { id: 'packing1', name: 'Упаковка 1' },
    { id: 'packing2', name: 'Упаковка 2' },
  ];

  // Автоматически открываем если на странице production
  useEffect(() => {
    if (location.pathname.startsWith('/production')) {
      setProductionOpen(true);
    }
  }, [location.pathname]);

  const menuItems = [
    { text: 'Главная', icon: <DashboardIcon />, path: '/' },
    { 
      text: 'Производство', 
      icon: <ProductionIcon />,
      hasSubmenu: true,
    },
    { text: 'Склады', icon: <WarehouseIcon />, path: '/warehouses' },
    { text: 'Настройки', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1e293b',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>MES Система</h2>
        <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.7 }}>
          Material Service
        </p>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
      
      <List>
        {menuItems.map((item) => {
          if (item.text === 'Производство') {
            return (
              <React.Fragment key={item.text}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setProductionOpen(!productionOpen)}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                    {productionOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                
                <Collapse in={productionOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {/* Обзор производства */}
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={location.pathname === '/production'}
                        onClick={() => navigate('/production')}
                        sx={{ pl: 4, py: 1 }}
                      >
                        <ListItemText primary="Обзор производства" />
                      </ListItemButton>
                    </ListItem>
                    
                    {/* Участки */}
                    {productionSections.map((section) => (
                      <ListItem key={section.id} disablePadding>
                        <ListItemButton
                          selected={location.pathname === `/production/${section.id}`}
                          onClick={() => navigate(`/production/${section.id}`)}
                          sx={{ pl: 4, py: 1 }}
                        >
                          <ListItemText primary={section.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}

export default SidebarWithDropdown;