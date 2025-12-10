import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, Alert,
  Slider, Grid
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ruLocale from 'date-fns/locale/ru';

const QuantityDialog = ({ 
  open, 
  onClose, 
  material, 
  onSubmit, 
  maxQuantity 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState(null);

  const handleSubmit = () => {
    if (quantity <= 0) {
      setError('Количество должно быть больше 0');
      return;
    }
    
    if (quantity > maxQuantity) {
      setError(`Максимально доступно: ${maxQuantity}`);
      return;
    }

    onSubmit({
      ...material,
      quantity,
      batchNumber: batchNumber || undefined,
      expirationDate: expirationDate || undefined
    });
    handleClose();
  };

  const handleClose = () => {
    setQuantity(1);
    setBatchNumber('');
    setExpirationDate(null);
    setError('');
    onClose();
  };

  const handleSliderChange = (event, newValue) => {
    setQuantity(newValue);
  };

  const handleInputChange = (event) => {
    const value = event.target.value === '' ? 0 : Number(event.target.value);
    setQuantity(value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Укажите количество для материала
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, minWidth: 400 }}>
          {/* Информация о материале */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {material.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Код: {material.code}
            </Typography>
            <Typography variant="body2">
              Доступно на складе: {maxQuantity} {material.unit || 'шт.'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Поле для ввода количества */}
          <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Typography gutterBottom>
                Количество
              </Typography>
              <Slider
                value={typeof quantity === 'number' ? quantity : 0}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
                min={1}
                max={maxQuantity}
                valueLabelDisplay="auto"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Количество"
                type="number"
                value={quantity}
                onChange={handleInputChange}
                InputProps={{
                  inputProps: { 
                    min: 1, 
                    max: maxQuantity,
                    step: 1
                  }
                }}
                fullWidth
                helperText={`Введите число от 1 до ${maxQuantity}`}
              />
            </Grid>
          </Grid>

          {/* Дополнительные поля */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Номер партии"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              fullWidth
              size="small"
              helperText="Необязательное поле"
            />
            
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
              <DatePicker
                label="Срок годности"
                value={expirationDate}
                onChange={(newValue) => setExpirationDate(newValue)}
                slotProps={{ textField: { 
                  size: 'small', 
                  fullWidth: true,
                  helperText: 'Необязательное поле'
                }}}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Отмена
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={quantity <= 0 || quantity > maxQuantity}
        >
          Добавить ({quantity} {material.unit || 'шт.'})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuantityDialog;