import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { analyzeNutrition } from '../utils/nutritionAnalysis';

const NutritionBadge = ({ nutritionData, size = 'medium' }) => {
  if (!nutritionData) return null;

  const analysis = analyzeNutrition(nutritionData);
  
  const getBadgeColor = (grade) => {
    switch (grade) {
      case 'A':
        return { backgroundColor: '#4caf50', color: 'white' };
      case 'B':
        return { backgroundColor: '#8bc34a', color: 'white' };
      case 'C':
        return { backgroundColor: '#ff9800', color: 'white' };
      case 'D':
        return { backgroundColor: '#f44336', color: 'white' };
      default:
        return { backgroundColor: '#757575', color: 'white' };
    }
  };

  const badgeSize = size === 'small' ? '24px' : size === 'large' ? '40px' : '32px';
  const fontSize = size === 'small' ? '0.75rem' : size === 'large' ? '1.25rem' : '1rem';

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1
      }}
    >
      <Box
        sx={{
          width: badgeSize,
          height: badgeSize,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: fontSize,
          ...getBadgeColor(analysis.healthGrade),
          boxShadow: 2
        }}
      >
        {analysis.healthGrade}
      </Box>
      {size !== 'small' && (
        <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 120 }}>
          Nutrition Score: {analysis.healthScore}/100
        </Typography>
      )}
    </Box>
  );
};

export default NutritionBadge;