import React from 'react';
import { Tooltip, IconButton, Typography, Box } from '@mui/material';
import { HelpOutline as HelpIcon } from '@mui/icons-material';

const EducationalTooltip = ({ 
  title, 
  content, 
  learnMore = null,
  icon = <HelpIcon />,
  placement = "top"
}) => {
  const tooltipContent = (
    <Box sx={{ maxWidth: 300 }}>
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {content}
      </Typography>
      {learnMore && (
        <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#e3f2fd' }}>
          💡 {learnMore}
        </Typography>
      )}
    </Box>
  );

  return (
    <Tooltip 
      title={tooltipContent} 
      placement={placement}
      arrow
      sx={{
        '& .MuiTooltip-tooltip': {
          backgroundColor: '#1976d2',
          color: 'white',
          fontSize: '0.875rem',
          maxWidth: 320,
          padding: 2
        },
        '& .MuiTooltip-arrow': {
          color: '#1976d2'
        }
      }}
    >
      <IconButton size="small" sx={{ ml: 0.5, color: 'primary.main' }}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default EducationalTooltip;