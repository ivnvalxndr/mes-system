import React from 'react'
import { Outlet } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
} from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'

const Layout = () => {
  const user = JSON.parse(localStorage.getItem('mes_user') || '{}')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MES Production System
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Typography variant="body1">
              {user.email || 'Пользователь'}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ py: 2, bgcolor: 'grey.100' }}>
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} MES System
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default Layout