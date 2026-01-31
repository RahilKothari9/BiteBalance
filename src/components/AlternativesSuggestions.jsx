import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  IconButton,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { analyzeNutrition, suggestHealthierAlternatives } from '../utils/nutritionAnalysis';

const AlternativesSuggestions = ({ open, onClose, nutritionData }) => {
  const [expanded, setExpanded] = useState(false);

  if (!nutritionData) {
    return null;
  }

  const analysis = analyzeNutrition(nutritionData);
  const alternatives = suggestHealthierAlternatives(nutritionData, analysis);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getNutrientColor = (category) => {
    switch (category) {
      case 'Low Sodium':
        return '#2196f3';
      case 'Lower Sugar':
        return '#9c27b0';
      case 'Calorie Conscious':
        return '#ff9800';
      case 'Protein Boost':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <LightbulbIcon color="primary" />
          <Typography variant="h6">
            Healthier Alternatives & Tips
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {alternatives.length === 0 ? (
          <Box textAlign="center" py={4}>
            <FavoriteIcon sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
            <Typography variant="h6" color="success.main" gutterBottom>
              Great Choice!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This meal looks nutritionally balanced. No specific alternatives needed!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Keep up the healthy eating habits! 🎉
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Based on your meal's nutritional profile, here are some suggestions to make it even healthier:
            </Typography>

            {alternatives.map((category, categoryIndex) => (
              <Card key={categoryIndex} sx={{ mb: 3, boxShadow: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Chip 
                      label={category.category}
                      sx={{ 
                        backgroundColor: getNutrientColor(category.category),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                      icon={<TrendingUpIcon sx={{ color: 'white !important' }} />}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    {category.suggestions.map((suggestion, suggestionIndex) => (
                      <Grid item xs={12} key={suggestionIndex}>
                        <Accordion 
                          expanded={expanded === `${categoryIndex}-${suggestionIndex}`}
                          onChange={handleAccordionChange(`${categoryIndex}-${suggestionIndex}`)}
                          sx={{ 
                            backgroundColor: '#fafafa',
                            boxShadow: 1,
                            '&:before': { display: 'none' }
                          }}
                        >
                          <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ 
                              backgroundColor: 'transparent',
                              '&:hover': { backgroundColor: '#f0f0f0' }
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                {suggestion.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Click to see details and benefits
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ backgroundColor: 'white', borderTop: '1px solid #e0e0e0' }}>
                            <Box>
                              <Typography variant="body2" paragraph>
                                {suggestion.description}
                              </Typography>
                              
                              <Box 
                                sx={{ 
                                  backgroundColor: '#e8f5e8',
                                  borderLeft: '4px solid #4caf50',
                                  p: 2,
                                  borderRadius: 1
                                }}
                              >
                                <Typography variant="body2" fontWeight="bold" color="success.dark">
                                  ✨ Benefit: {suggestion.benefit}
                                </Typography>
                              </Box>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Divider sx={{ my: 3 }} />

            {/* General Healthy Eating Tips */}
            <Card sx={{ backgroundColor: '#f0f8ff', boxShadow: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  💡 General Healthy Eating Tips
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        🥗 Plate Method
                      </Typography>
                      <Typography variant="body2">
                        Fill half your plate with vegetables, one quarter with lean protein, and one quarter with whole grains.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        🥤 Stay Hydrated
                      </Typography>
                      <Typography variant="body2">
                        Drink plenty of water throughout the day. Sometimes thirst is mistaken for hunger.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        🍎 Color Variety
                      </Typography>
                      <Typography variant="body2">
                        Eat a rainbow of colors to ensure you get a variety of vitamins and antioxidants.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        ⏰ Mindful Eating
                      </Typography>
                      <Typography variant="body2">
                        Eat slowly and pay attention to hunger cues. It takes 20 minutes for your brain to register fullness.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Got it, thanks!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlternativesSuggestions;