// src/pages/production/SectionCard.jsx
import React from 'react';
import { Card, CardContent, CardActionArea, Typography, Box, Chip, LinearProgress } from '@mui/material';
import { Forklift as UTOIcon } from '@mui/icons-material';

function SectionCard({ section, onClick }) {
  return (
    <Card sx={{ height: '100%', transition: 'transform 0.2s' }}>
      <CardActionArea onClick={onClick} sx={{ height: '100%', p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: `${section.color}15`,
              color: section.color,
              mr: 2 
            }}>
              <UTOIcons />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {section.name}
              </Typography>
              <Chip
                label={section.status === 'active' ? 'Активен' : 'Внимание'}
                size="small"
                color={section.status === 'active' ? 'success' : 'warning'}
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {section.description}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption">Загрузка:</Typography>
            <Typography variant="caption" fontWeight="bold">
              {section.currentLoad}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={section.currentLoad} 
            sx={{ height: 6, borderRadius: 3 }}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default SectionCard;