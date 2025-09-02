import React from 'react';
import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';

const NutritionQualityIndicator = ({ label, value, max, unit = '', color = 'primary', showProgress = true }) => {
  const numericValue = parseFloat(value) || 0;
  const percentage = Math.min((numericValue / max) * 100, 100);
  
  const getColorByPercentage = (percent) => {
    if (percent <= 30) return '#4caf50'; // Green - low
    if (percent <= 60) return '#ff9800'; // Orange - medium
    return '#f44336'; // Red - high
  };

  const progressColor = color === 'auto' ? getColorByPercentage(percentage) : undefined;

  return (
    <Box sx={{ mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Typography variant="body2" fontWeight="medium">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {numericValue}{unit}
        </Typography>
      </Box>
      
      {showProgress && (
        <Tooltip title={`${percentage.toFixed(0)}% of recommended maximum`}>
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#f0f0f0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: progressColor || `${color}.main`,
                borderRadius: 4,
              },
            }}
          />
        </Tooltip>
      )}
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        Max recommended: {max}{unit}
      </Typography>
    </Box>
  );
};

export default NutritionQualityIndicator;