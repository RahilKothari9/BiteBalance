import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Eco as EcoIcon,
  LocalFlorist as SpringIcon,
  WbSunny as SummerIcon,
  Nature as FallIcon,
  AcUnit as WinterIcon
} from '@mui/icons-material';
import { 
  getCurrentSeason, 
  getSeasonalIngredients, 
  suggestSeasonalAlternatives,
  getSeasonalEatingTips 
} from '../data/seasonalIngredients';

const SeasonalRecommendations = ({ currentIngredients = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const currentSeason = getCurrentSeason();
  const seasonalIngredients = getSeasonalIngredients();
  const seasonalAlternatives = suggestSeasonalAlternatives(currentIngredients);
  const seasonalTips = getSeasonalEatingTips();

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getSeasonIcon = (season) => {
    switch (season) {
      case 'spring':
        return <SpringIcon sx={{ color: '#4caf50' }} />;
      case 'summer':
        return <SummerIcon sx={{ color: '#ff9800' }} />;
      case 'fall':
        return <FallIcon sx={{ color: '#8d6e63' }} />;
      case 'winter':
        return <WinterIcon sx={{ color: '#2196f3' }} />;
      default:
        return <EcoIcon />;
    }
  };

  const getSeasonColor = (season) => {
    switch (season) {
      case 'spring':
        return '#e8f5e8';
      case 'summer':
        return '#fff3e0';
      case 'fall':
        return '#efebe9';
      case 'winter':
        return '#e3f2fd';
      default:
        return '#f5f5f5';
    }
  };

  const getSeasonGradient = (season) => {
    switch (season) {
      case 'spring':
        return 'linear-gradient(135deg, #81c784 0%, #4caf50 100%)';
      case 'summer':
        return 'linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)';
      case 'fall':
        return 'linear-gradient(135deg, #a1887f 0%, #8d6e63 100%)';
      case 'winter':
        return 'linear-gradient(135deg, #64b5f6 0%, #2196f3 100%)';
      default:
        return 'linear-gradient(135deg, #81c784 0%, #4caf50 100%)';
    }
  };

  return (
    <Card sx={{ mb: 2, backgroundColor: getSeasonColor(currentSeason) }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          {getSeasonIcon(currentSeason)}
          <Typography variant="h6" component="div" sx={{ textTransform: 'capitalize' }}>
            {currentSeason} Seasonal Recommendations
          </Typography>
          <Chip 
            label="In Season" 
            size="small" 
            sx={{ 
              backgroundColor: getSeasonGradient(currentSeason),
              color: 'white',
              fontWeight: 'bold'
            }} 
          />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Eating seasonally supports local agriculture and ensures peak nutrition and flavor!
        </Typography>

        {/* Seasonal Alternatives */}
        {seasonalAlternatives.map((category, index) => (
          <Accordion 
            key={index}
            expanded={expanded === `alternatives-${index}`}
            onChange={handleAccordionChange(`alternatives-${index}`)}
            sx={{ 
              backgroundColor: 'white',
              mb: 1,
              boxShadow: 1,
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {category.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {category.items.map((item, itemIndex) => (
                  <Grid item xs={12} md={6} key={itemIndex}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        backgroundColor: getSeasonColor(currentSeason),
                        borderRadius: 1,
                        border: `1px solid ${getSeasonGradient(currentSeason).split(' ')[1]}`
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        🌱 {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {item.benefits}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        fontStyle: 'italic',
                        color: 'primary.dark',
                        backgroundColor: 'white',
                        p: 0.5,
                        borderRadius: 0.5,
                        display: 'block',
                        mt: 1
                      }}>
                        💡 {item.preparation}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}

        {/* Seasonal Categories */}
        <Accordion 
          expanded={expanded === 'categories'}
          onChange={handleAccordionChange('categories')}
          sx={{ 
            backgroundColor: 'white',
            mb: 1,
            boxShadow: 1,
            '&:before': { display: 'none' }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              What's in Season Now
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {/* Vegetables */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="success.main">
                  🥬 Vegetables
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {seasonalIngredients.vegetables.slice(0, 5).map((vegetable, index) => (
                    <Tooltip key={index} title={`${vegetable.benefits} - ${vegetable.preparation}`}>
                      <Chip 
                        label={vegetable.name}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderColor: 'success.main',
                          color: 'success.main',
                          '&:hover': { backgroundColor: 'success.light', color: 'white' }
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Grid>

              {/* Fruits */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="error.main">
                  🍎 Fruits
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {seasonalIngredients.fruits.map((fruit, index) => (
                    <Tooltip key={index} title={`${fruit.benefits} - ${fruit.preparation}`}>
                      <Chip 
                        label={fruit.name}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderColor: 'error.main',
                          color: 'error.main',
                          '&:hover': { backgroundColor: 'error.light', color: 'white' }
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Grid>

              {/* Herbs */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="info.main">
                  🌿 Herbs & Spices
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {seasonalIngredients.herbs.map((herb, index) => (
                    <Tooltip key={index} title={`${herb.benefits} - ${herb.preparation}`}>
                      <Chip 
                        label={herb.name}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderColor: 'info.main',
                          color: 'info.main',
                          '&:hover': { backgroundColor: 'info.light', color: 'white' }
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Seasonal Eating Tips */}
        <Accordion 
          expanded={expanded === 'tips'}
          onChange={handleAccordionChange('tips')}
          sx={{ 
            backgroundColor: 'white',
            boxShadow: 1,
            '&:before': { display: 'none' }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Eating Tips
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              {seasonalTips.map((tip, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    mb: 2,
                    p: 2,
                    backgroundColor: getSeasonColor(currentSeason),
                    borderRadius: 1,
                    borderLeft: `4px solid ${getSeasonGradient(currentSeason).split(' ')[1]}`
                  }}
                >
                  <Typography variant="body2">
                    💡 {tip}
                  </Typography>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Environmental Benefits */}
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          backgroundColor: 'white',
          borderRadius: 1,
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="body2" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontWeight: 500
          }}>
            <EcoIcon color="success" />
            Eating seasonally reduces carbon footprint and supports local farmers! 🌍
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SeasonalRecommendations;