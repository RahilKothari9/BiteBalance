import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Grid, Chip } from '@mui/material';
import { FitnessCenter, Restaurant, Fastfood, WaterDrop, Icecream, Apple, TipsAndUpdates } from '@mui/icons-material';
import axios from 'axios';
import { analyzeNutrition, generateEducationalFacts } from '../utils/nutritionAnalysis';

const Dashboard = ({ userId }) => {
  const [nutritionStats, setNutritionStats] = useState([]);
  const [calorieHistory, setCalorieHistory] = useState([]);
  const [dailyInsights, setDailyInsights] = useState(null);

  // Fetch the data from your backend
  const fetchUserData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}calories/${userId}?date=${today}`);
      
      if (response.data) {
        const { totalCalories, totalProtein, totalCarbs, totalSodium, totalSugars, totalFats } = response.data;
        setNutritionStats([
          { name: 'Calories', value: totalCalories, icon: <FitnessCenter />, color: 'red', max: 3000 },
          { name: 'Proteins', value: totalProtein, icon: <Restaurant />, color: 'purple', max: 500 },
          { name: 'Carbs', value: totalCarbs, icon: <Fastfood />, color: 'yellow', max: 600 },
          { name: 'Sodium', value: totalSodium, icon: <WaterDrop />, color: 'blue', max: 4300 },
          { name: 'Sugars', value: totalSugars, icon: <Icecream />, color: 'pink', max: 150 },
          { name: 'Fats', value: totalFats, icon: <Apple />, color: 'green', max: 180 },
        ]);

        // Generate daily insights
        const dailyNutritionData = {
          calories: totalCalories,
          protein: totalProtein,
          carbs: totalCarbs,
          sugars: totalSugars,
          fats: totalFats,
          sodium: totalSodium
        };
        
        const analysis = analyzeNutrition(dailyNutritionData);
        const facts = generateEducationalFacts(dailyNutritionData);
        setDailyInsights({ analysis, facts });
      }

      // Fetch calorie history (last 3 days)
      
      if (true) {
        const lastThreeDays = [];
        for (let i = 2; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const formattedDate = date.toISOString().split('T')[0];
          const dayResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}calories/${userId}?date=${formattedDate}`);
          if (dayResponse.data) {
            lastThreeDays.push({ day: formattedDate, calories: dayResponse.data.totalCalories });
          }
        }
        setCalorieHistory(lastThreeDays);
      }
    } catch (error) {
      console.error('Error fetching data:', error);x
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  return (
    <Box maxWidth="lg" mx="auto" p={10}>
      {/* Nutrition Stats Card */}
      <Card  mt={14}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom >
            Your Nutrition Today
          </Typography>
          <Grid container spacing={3} >
            {nutritionStats.map((stat) => (
              <Grid item xs={12} sm={6} md={4} key={stat.name}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  {stat.icon}
                  <Typography variant="subtitle1">{stat.name}</Typography>
                  <Typography variant="h6" fontWeight="bold">{stat.value}</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stat.value / stat.max) * 100} 
                    sx={{ width: '100%', mt: 1, height: 10, borderRadius: 5, backgroundColor: '#f0f0f0' }} 
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Calorie History Card */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Calorie History
          </Typography>
          <Box>
            {calorieHistory.map((day, index) => (
              <Box key={index} display="flex" justifyContent="space-between" py={2} borderBottom="1px solid #ddd">
                <Typography variant="subtitle1">{day.day}</Typography>
                <Typography variant="body1">{day.calories} calories</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Daily Insights Card */}
      {dailyInsights && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TipsAndUpdates color="primary" />
              Today's Nutrition Insights
            </Typography>
            
            {/* Health Score and Grade */}
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="body1">
                Overall Health Score: <strong>{dailyInsights.analysis.healthScore}/100</strong>
              </Typography>
              <Chip 
                label={`Grade: ${dailyInsights.analysis.healthGrade}`}
                color={dailyInsights.analysis.healthGrade === 'A' ? 'success' : 
                       dailyInsights.analysis.healthGrade === 'B' ? 'primary' : 
                       dailyInsights.analysis.healthGrade === 'C' ? 'warning' : 'error'}
                variant="contained"
              />
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              {dailyInsights.analysis.overallMessage}
            </Typography>

            {/* Positive aspects and concerns */}
            <Box mb={2}>
              <Grid container spacing={1}>
                {dailyInsights.analysis.positives.map((positive, index) => (
                  <Grid item key={index}>
                    <Chip label={positive} color="success" size="small" />
                  </Grid>
                ))}
                {dailyInsights.analysis.concerns.map((concern, index) => (
                  <Grid item key={index}>
                    <Chip label={concern} color="warning" size="small" />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Educational fact */}
            {dailyInsights.facts.length > 0 && (
              <Box sx={{ 
                backgroundColor: '#e8f5e8', 
                p: 2, 
                borderRadius: 1,
                borderLeft: '4px solid #4caf50'
              }}>
                <Typography variant="body2">
                  {dailyInsights.facts[0]}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Dashboard;
