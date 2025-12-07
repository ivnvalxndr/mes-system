// src/components/Materials/MaterialForm.jsx
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { materialApi, unitsApi } from '../../services/api';

function MaterialForm({ material = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    code: material?.code || '',
    name: material?.name || '',
    description: material?.description || '',
    quantity: material?.quantity || 0,
    price: material?.price || 0,
    unitId: material?.unitId || '',
  });

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Загружаем единицы измерения при монтировании
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setUnitsLoading(true);
        const data = await unitsApi.getAll();
        setUnits(data);
        
        // Если создаем новый материал и есть единицы, выбираем первую
        if (!material && data.length > 0 && !formData.unitId) {
          setFormData(prev => ({ ...prev, unitId: data[0].id }));
        }
      } catch (err) {
        setError('Не удалось загрузить единицы измерения');
        console.error('Error fetching units:', err);
      } finally {
        setUnitsLoading(false);
      }
    };

    fetchUnits();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (material) {
        // Обновляем существующий материал
        const updateData = {};
        if (formData.name !== material.name) updateData.name = formData.name;
        if (formData.description !== material.description) updateData.description = formData.description;
        if (formData.quantity !== material.quantity) updateData.quantity = formData.quantity;
        if (formData.price !== material.price) updateData.price = formData.price;
        if (formData.unitId !== material.unitId) updateData.unitId = formData.unitId;

        await materialApi.update(material.id, updateData);
        setSuccess('Материал успешно обновлен!');
      } else {
        // Создаем новый материал
        await materialApi.create(formData);
        setSuccess('Материал успешно создан!');
      }
      
      // Даем время увидеть сообщение об успехе
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Ошибка при сохранении';
      setError(errorMessage);
      console.error('Error saving material:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Код материала *"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            size="small"
            disabled={!!material} // Код нельзя менять при редактировании
            placeholder="Например: PIPE-001"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Наименование *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            size="small"
            placeholder="Например: Труба стальная 20x2"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Количество *"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
            size="small"
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Цена *"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            size="small"
            InputProps={{ 
              inputProps: { min: 0, step: 0.01 },
              endAdornment: '₽'
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Единица измерения *</InputLabel>
            <Select
              label="Единица измерения *"
              name="unitId"
              value={formData.unitId}
              onChange={handleChange}
              required
              disabled={unitsLoading}
            >
              {unitsLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Загрузка...
                </MenuItem>
              ) : (
                units.map(unit => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.name} ({unit.code})
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Описание"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            size="small"
            placeholder="Подробное описание материала..."
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 1 }}>
            <Button 
              variant="outlined" 
              onClick={onCancel}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button 
              variant="contained" 
              type="submit"
              disabled={loading || unitsLoading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Сохранение...' : material ? 'Обновить' : 'Создать'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MaterialForm;