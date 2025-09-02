import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Grid,
  CircularProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  TipsAndUpdates as TipsIcon,
  Favorite as HeartIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Psychology as InsightIcon
} from '@mui/icons-material';
import { analyzeNutrition, generateEducationalFacts } from '../utils/nutritionAnalysis';

const FoodInsights = ({ nutritionData }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!nutritionData) {
    return null;
  }

  const analysis = analyzeNutrition(nutritionData);
  const educationalFacts = generateEducationalFacts(nutritionData);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getHealthScoreColor = (score) => {
    if (score >= 90) return '#4caf50'; // Green
    if (score >= 80) return '#8bc34a'; // Light green
    if (score >= 70) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'concern':
        return <WarningIcon sx={{ color: '#ff9800' }} />;
      case 'positive':
        return <HeartIcon sx={{ color: '#4caf50' }} />;
      case 'suggestion':
        return <TipsIcon sx={{ color: '#2196f3' }} />;
      default:
        return <InfoIcon sx={{ color: '#757575' }} />;
    }
  };

  return (
    <Card sx={{ mb: 2, backgroundColor: '#f8f9fa' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InsightIcon color="primary" />
            Smart Food Insights
          </Typography>
          
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Health Score:
            </Typography>
            <Box position="relative" display="inline-flex">
              <CircularProgress
                variant="determinate"
                value={analysis.healthScore}
                size={40}
                sx={{ color: getHealthScoreColor(analysis.healthScore) }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" component="div" color="text.secondary" fontWeight="bold">
                  {analysis.healthGrade}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
          {analysis.overallMessage}
        </Typography>

        {/* Quick Insights */}
        <Box mb={2}>
          <Grid container spacing={1}>
            {analysis.positives.map((positive, index) => (
              <Grid item key={index}>
                <Chip 
                  label={positive} 
                  color="success" 
                  size="small"
                  icon={<HeartIcon />}
                />
              </Grid>
            ))}
            {analysis.concerns.map((concern, index) => (
              <Grid item key={index}>
                <Chip 
                  label={concern} 
                  color="warning" 
                  size="small"
                  icon={<WarningIcon />}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Macro Ratios */}
        {analysis.macroRatios && (
          <Box mb={2}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Macronutrient Balance:
            </Typography>
            <Box display="flex" gap={2}>
              <Typography variant="body2">
                Protein: {analysis.macroRatios.proteinPercent}%
              </Typography>
              <Typography variant="body2">
                Carbs: {analysis.macroRatios.carbPercent}%
              </Typography>
              <Typography variant="body2">
                Fats: {analysis.macroRatios.fatPercent}%
              </Typography>
            </Box>
          </Box>
        )}

        {/* Detailed Insights */}
        <Accordion 
          expanded={expanded === 'insights'} 
          onChange={handleAccordionChange('insights')}
          sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body1" fontWeight="bold">
              Detailed Insights ({analysis.insights.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              {analysis.insights.map((insight, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: 'white', borderRadius: 1 }}>
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    {getInsightIcon(insight.type)}
                    <Box flex={1}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {insight.message}
                      </Typography>
                      {insight.tip && (
                        <Typography variant="body2" sx={{ 
                          fontStyle: 'italic', 
                          color: '#1976d2',
                          backgroundColor: '#e3f2fd',
                          p: 1,
                          borderRadius: 1,
                          mt: 1
                        }}>
                          💡 Tip: {insight.tip}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Educational Facts */}
        <Accordion 
          expanded={expanded === 'education'} 
          onChange={handleAccordionChange('education')}
          sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body1" fontWeight="bold">
              Did You Know?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              {educationalFacts.map((fact, index) => (
                <Box key={index} sx={{ 
                  mb: 1, 
                  p: 2, 
                  backgroundColor: '#e8f5e8', 
                  borderRadius: 1,
                  borderLeft: '4px solid #4caf50'
                }}>
                  <Typography variant="body2">
                    {fact}
                  </Typography>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <Accordion 
            expanded={expanded === 'recommendations'} 
            onChange={handleAccordionChange('recommendations')}
            sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body1" fontWeight="bold">
                Recommendations ({analysis.recommendations.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                {analysis.recommendations.map((recommendation, index) => (
                  <Box key={index} sx={{ 
                    mb: 1, 
                    p: 2, 
                    backgroundColor: '#fff3e0', 
                    borderRadius: 1,
                    borderLeft: '4px solid #ff9800'
                  }}>
                    <Typography variant="body2">
                      {recommendation}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodInsights;