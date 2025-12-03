import React, { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Link,
} from '@mui/material'
import { authAPI } from '../services/api'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authAPI.login({ email, password })
      
      localStorage.setItem('mes_token', response.data.token)
      localStorage.setItem('mes_user', JSON.stringify(response.data.user))
      
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          px: 3,
        }}
      >
        <Paper 
          elevation={24} 
          sx={{ 
            p: 4,
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          {/* Логотип и заголовок */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                M
              </Typography>
            </Box>
            
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: '#1976d2',
                mb: 1,
              }}
            >
              MES System
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Production Management
            </Typography>
          </Box>
          
          {/* Ошибки */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'error.main',
              }}
            >
              {error}
            </Alert>
          )}
          
          {/* Форма */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              variant="outlined"
              size="medium"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
              }}
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              variant="outlined"
              size="medium"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 100%)',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 0%, #0d47a1 100%)',
                  boxShadow: '0 6px 25px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      mr: 2,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                  Вход в систему...
                </Box>
              ) : (
                'Войти в систему'
              )}
            </Button>
            
            {/* Тестовые данные */}
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mt: 4,
                backgroundColor: 'rgba(25, 118, 210, 0.05)',
                borderColor: 'rgba(25, 118, 210, 0.2)',
                borderRadius: 2,
              }}
            >
              <Typography 
                variant="caption" 
                color="primary" 
                fontWeight="600" 
                gutterBottom
                display="block"
              >
                Тестовые учетные данные:
              </Typography>
              <Box 
                sx={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.85rem',
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  p: 1.5,
                  borderRadius: 1,
                  border: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <Box sx={{ display: 'flex', mb: 0.5 }}>
                  <Box sx={{ width: 70, color: 'text.secondary' }}>Email:</Box>
                  <Box sx={{ fontWeight: 600 }}>admin@mes.com</Box>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ width: 70, color: 'text.secondary' }}>Пароль:</Box>
                  <Box sx={{ fontWeight: 600 }}>123456</Box>
                </Box>
              </Box>
            </Paper>
            
            {/* Дополнительная информация */}
            <Grid container spacing={1} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  align="center" 
                  display="block"
                  sx={{ opacity: 0.7 }}
                >
                  Система управления производством • v1.0
                </Typography>
              </Grid>
            </Grid>
            
            {/* Ссылка на регистрацию */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Нет аккаунта?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Зарегистрироваться
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  )
}

export default Login