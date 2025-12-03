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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import {
  ArrowBack,
  PersonAdd,
  CheckCircle,
} from '@mui/icons-material'
import { authAPI } from '../services/api'

const Register = () => {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Данные формы
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'Operator',
  })

  const steps = ['Аккаунт', 'Личные данные', 'Подтверждение']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Проверка паролей
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      setLoading(false)
      return
    }

    // Проверка минимальной длины пароля
    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      setLoading(false)
      return
    }

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
      }

      const response = await authAPI.register(userData)
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)

    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              helperText="Будет использоваться для входа в систему"
            />
            <TextField
              fullWidth
              label="Пароль"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              helperText="Минимум 6 символов"
            />
            <TextField
              fullWidth
              label="Подтверждение пароля"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
          </Box>
        )
      
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Имя"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Фамилия"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              select
              label="Роль"
              name="role"
              value={formData.role}
              onChange={handleChange}
              margin="normal"
              disabled={loading}
              SelectProps={{
                native: true,
              }}
            >
              <option value="Operator">Оператор</option>
              <option value="Manager">Менеджер</option>
              <option value="Admin">Администратор</option>
            </TextField>
          </Box>
        )
      
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                backgroundColor: 'rgba(25, 118, 210, 0.05)',
                borderColor: 'rgba(25, 118, 210, 0.2)',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Проверьте введенные данные:
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Email:
                  </Typography>
                  <Typography variant="body2">{formData.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Роль:
                  </Typography>
                  <Typography variant="body2">
                    {formData.role === 'Operator' && 'Оператор'}
                    {formData.role === 'Manager' && 'Менеджер'}
                    {formData.role === 'Admin' && 'Администратор'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Имя:
                  </Typography>
                  <Typography variant="body2">{formData.firstName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Фамилия:
                  </Typography>
                  <Typography variant="body2">{formData.lastName}</Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              После регистрации вы будете перенаправлены на страницу входа.
            </Alert>
          </Box>
        )
      
      default:
        return null
    }
  }

  // Успешная регистрация
  if (success) {
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
        <Box sx={{ width: '100%', maxWidth: 500, px: 3 }}>
          <Paper 
            elevation={24} 
            sx={{ 
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
            }}
          >
            <CheckCircle 
              sx={{ 
                fontSize: 80, 
                color: 'success.main',
                mb: 3,
              }} 
            />
            
            <Typography variant="h5" gutterBottom>
              Регистрация успешна!
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              Аккаунт для <strong>{formData.email}</strong> успешно создан.
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              Перенаправление на страницу входа через 3 секунды...
            </Typography>
            
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              sx={{ mt: 3 }}
            >
              Перейти к входу
            </Button>
          </Paper>
        </Box>
      </Box>
    )
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
      <Box sx={{ width: '100%', maxWidth: 600, px: 3 }}>
        <Paper 
          elevation={24} 
          sx={{ 
            p: 4,
            borderRadius: 3,
          }}
        >
          {/* Кнопка назад на первую страницу */}
          {activeStep === 0 ? (
            <Button
              startIcon={<ArrowBack />}
              component={RouterLink}
              to="/login"
              sx={{ mb: 3 }}
            >
              Назад к входу
            </Button>
          ) : (
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBack}
              disabled={loading}
              sx={{ mb: 3 }}
            >
              Назад
            </Button>
          )}

          {/* Заголовок */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <PersonAdd 
              sx={{ 
                fontSize: 60, 
                color: 'primary.main',
                mb: 2,
              }} 
            />
            
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: 'primary.main',
                mb: 1,
              }}
            >
              Регистрация в MES System
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Создание нового аккаунта
            </Typography>
          </Box>

          {/* Степпер */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Ошибки */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          {/* Форма */}
          <form onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {renderStepContent(activeStep)}

            {/* Кнопки управления */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              {activeStep === 0 ? (
                <Button
                  component={RouterLink}
                  to="/login"
                  disabled={loading}
                >
                  Уже есть аккаунт? Войти
                </Button>
              ) : (
                <Button
                  onClick={handleBack}
                  disabled={loading}
                >
                  Назад
                </Button>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  px: 4,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                {loading ? (
                  'Загрузка...'
                ) : activeStep === steps.length - 1 ? (
                  'Зарегистрироваться'
                ) : (
                  'Далее'
                )}
              </Button>
            </Box>
          </form>

          {/* Информация */}
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              Создавая аккаунт, вы соглашаетесь с условиями использования системы.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default Register