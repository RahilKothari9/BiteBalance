import { Global } from '@emotion/react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { TipsAndUpdates as InsightsIcon, Lightbulb as AlternativesIcon } from '@mui/icons-material';
import axios from 'axios';  // Use axios for API calls
import '../css/drawer.css';
import { UserAuth } from '../contexts/AuthContext';
import FoodInsights from './FoodInsights';
import AlternativesSuggestions from './AlternativesSuggestions';
import SeasonalRecommendations from './SeasonalRecommendations';
import EducationalTooltip from './EducationalTooltip';
import NutritionBadge from './NutritionBadge';
const drawerBleeding = 50;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const updateTotalCalories = async (userId, calories, protein, sugar, carbs, fat, sodium) => {
  try {
    // Make an API call to Express.js server to update user calorie data in MongoDB
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}calories/update`, {
      userId,
      calories,
      protein,
      sugar,
      carbs,
      fat,
      sodium,
    });
    console.log('Calories updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating calories:', error);
  }
};

function SwipeableEdgeDrawer(props) {
  const { window } = props;
  const [open, setOpen] = React.useState(false);
  const [showAlternatives, setShowAlternatives] = React.useState(false);
  const { user } = UserAuth();
  // console.log(user)
  const userId = user.uid; // Replace this with your user ID management

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  

  // React.useEffect(() => {
  //   if (open) {
  //     const caloriesAsNumber = parseFloat(props.ing.calories);
  //     updateTotalCalories(userId, caloriesAsNumber);
  //   }
  // }, [open, userId, props.ing]);

  let rec = props.ing;
  console.log(rec);
    
  let resultString = rec;
  if (rec.startsWith(' ```json') && rec.endsWith('```')) {
    resultString = rec.substring(' ```json'.length, rec.length - '```'.length);
  } else if (rec.startsWith('```json') && rec.endsWith('```')) {
    resultString = rec.substring('```json'.length, rec.length - '```'.length);
  }
  let recipe = JSON.parse(resultString);

  // This is used only for the example
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
      
      <div className='flex flex-col items-center justify-center w-90 p-4 mt-4 bg-blue-50'>
        <img src={props.image} className="h-64 mt-4 mb-4 object-cover" alt={recipe.name} />
        
        {/* Meal title with nutrition badge */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <h1 className="text-2xl font-bold">{recipe.name}</h1>
          <NutritionBadge nutritionData={recipe} size="large" />
        </Box>
        
        {/* Action buttons row */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap" justifyContent="center">
          <Button 
            onClick={() => {
              const caloriesAsNumber = parseFloat(recipe.calories);
              const proteinAsNumber = parseFloat(recipe.protein);
              const sugarAsNumber = parseFloat(recipe.sugars);
              const carbsAsNumber = parseFloat(recipe.carbs);
              const fatAsNumber = parseFloat(recipe.fats);
              const sodiumAsNumber = parseFloat(recipe.sodium);

              updateTotalCalories(userId, caloriesAsNumber, proteinAsNumber, sugarAsNumber, carbsAsNumber, fatAsNumber, sodiumAsNumber);
            }}
            variant="contained"
            color="primary"
            sx={{ minWidth: 100 }}
          >
            Eat
          </Button>
          
          <Tooltip title="See healthier alternatives">
            <Button
              onClick={() => setShowAlternatives(true)}
              variant="outlined"
              color="secondary"
              startIcon={<AlternativesIcon />}
              sx={{ minWidth: 120 }}
            >
              Alternatives
            </Button>
          </Tooltip>
        </Box>

        {/* Food Insights Component */}
        <FoodInsights nutritionData={recipe} />
        
        {/* Seasonal Recommendations Component */}
        <SeasonalRecommendations currentIngredients={[recipe.name]} />
      </div>
      <div onClick={toggleDrawer(!open)}>
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        onClick={toggleDrawer(true)}
      
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: 'text.secondary' }}>Pull up for caloric info!</Typography>
        </StyledBox>
        
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
            backgroundColor: '#FFFFCC'
          }}
          className='bg-blue-50 flex flex-col justify-center items-center'
        >
          {/* <h1 className='font-bold underline mb-4'>Per 100 grams:</h1> */}
          
          <ul className="list-disc pl-5">
            <li className="mb-2 text-2xl sm:text-xl flex items-center">
              Calories: {recipe.calories}
              <EducationalTooltip 
                title="Calories"
                content="Energy provided by this food. Your body needs calories for basic functions and activities."
                learnMore="Aim for 300-500 calories per meal for balanced nutrition."
              />
            </li>
            <li className="mb-2 text-2xl sm:text-xl flex items-center">
              Protein: {recipe.protein} g
              <EducationalTooltip 
                title="Protein"
                content="Essential for muscle maintenance, immune function, and satiety. Helps you feel full longer."
                learnMore="Aim for 15-30g of protein per meal."
              />
            </li>
            <li className="mb-2 text-2xl sm:text-xl flex items-center">
              Carbs: {recipe.carbs} g
              <EducationalTooltip 
                title="Carbohydrates"
                content="Your body's main source of energy. Choose complex carbs for sustained energy."
                learnMore="Pair carbs with protein and fiber for better blood sugar control."
              />
            </li>
            <li className="mb-2 text-2xl sm:text-xl flex items-center">
              Sugars: {recipe.sugars} g
              <EducationalTooltip 
                title="Sugars"
                content="Natural and added sugars. Too much can cause energy spikes and crashes."
                learnMore="Limit added sugars to 25g per day for women, 36g for men."
              />
            </li>
            <li className="mb-2 text-2xl sm:text-xl flex items-center">
              Fats: {recipe.fats} g
              <EducationalTooltip 
                title="Fats"
                content="Essential for hormone production and vitamin absorption. Choose healthy fats from nuts, fish, and oils."
                learnMore="Focus on unsaturated fats and limit saturated fats to <10% of daily calories."
              />
            </li>
            <li className="mb-2 text-2xl sm:text-xl flex items-center">
              Sodium: {recipe.sodium} mg
              <EducationalTooltip 
                title="Sodium"
                content="Necessary for fluid balance but excessive amounts can raise blood pressure."
                learnMore="Keep daily sodium under 2,300mg (about 1 teaspoon of salt)."
              />
            </li>
          </ul>
          
        </StyledBox>
      </SwipeableDrawer>
      </div>
      
      {/* Alternatives Dialog */}
      <AlternativesSuggestions 
        open={showAlternatives}
        onClose={() => setShowAlternatives(false)}
        nutritionData={recipe}
      />
    </Root>
  );
}

SwipeableEdgeDrawer.propTypes = {
  window: PropTypes.func,
};

export default SwipeableEdgeDrawer;
