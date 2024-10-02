import { Global } from '@emotion/react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
import { getFirestore, increment, doc, updateDoc, collection, getDoc, setDoc } from 'firebase/firestore';
import { UserAuth } from '../contexts/AuthContext'
import { Button } from '@mui/material';
import { db } from '../config/firebase';import '../css/drawer.css';
const drawerBleeding = 56;

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

function SwipeableEdgeDrawer(props) {
  const { window } = props;
  const [open, setOpen] = React.useState(false);
  const { user } = UserAuth();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const updateTotalCalories = async (userId, newCalories, protein, sugar, carbs, fat, sodium) => {
    try {
       const firestore = getFirestore();
       const userDocRef = doc(firestore, 'users', userId);
       // Check if the calories field exists and update accordingly
       const userSnapshot = await getDoc(userDocRef);
       if (userSnapshot.exists()) {
         const userData = userSnapshot.data();
         
         await setDoc(userDocRef,  {totalCalories: (userData.totalCalories || 0) + newCalories,
          totalProtein: (userData.totalProtein || 0) + protein,
          totalCarbs: (userData.totalCarbs || 0) + carbs,
          totalSugars: (userData.totalSugars || 0) + sugar,
          totalFats: (userData.totalFats || 0) + fat,
          totalSodium: (userData.totalSodium || 0) + sodium,}, { merge: true });
       } else {
         // If the document does not exist, create it with the new calories value
         await setDoc(userDocRef, { totalCalories: newCalories }, { merge: true });
       }
       console.log('Total calories updated successfully');
    } catch (error) {
       console.error('Error updating total calories in Firestore:', error);
    }
   };

  React.useEffect(() => {
    if (open && user) {
      const caloriesAsNumber = parseFloat(props.ing.calories);
      updateTotalCalories(user.uid, caloriesAsNumber);
    }
 }, [open, user, props.ing]);


    let rec = props.ing
    console.log(rec)
    
    let resultString = rec
    if (rec.startsWith(' ```json') && rec.endsWith('```')) {
        resultString = rec.substring(' ```json'.length, rec.length - '```'.length);}
    else if (rec.startsWith('```json') && rec.endsWith('```')) {
        resultString = rec.substring('```json'.length, rec.length - '```'.length);}
    let recipe = JSON.parse(resultString)

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
      
      <div className='flex flex-col align-center justify-center image-show'>
        {/* //add image here */}
        <img src={props.image} style={{"height":"350px", "margin": "auto", "marginTop":"2em"}}/>
        <h1>{recipe.name}</h1>
        <Button onClick={()=>updateTotalCalories(user.uid, parseFloat(recipe.calories), parseFloat(recipe.protein), parseFloat(recipe.sugar), parseFloat(recipe.carbs), parseFloat(recipe.fat), parseFloat(recipe.sodium))}>Eat</Button>
        
      </div>
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
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
          className='bg-primary-100 flex flex-col justify-center contents-center items-center'
        >
        <h1 className='font-bold underline-offset-4'>Per 100 grams:</h1>
          
          <ul>
          <li >Calories: {recipe.calories}</li>
          <li>Protein: {recipe.protein} g</li>
          <li>Carbs: {recipe.carbs} g</li>
          <li>Sugars: {recipe.sugars} g</li>
          <li>Fats: {recipe.fats} g</li>
          <li>Sodium: {recipe.sodium} mg</li>
          </ul>
          
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

SwipeableEdgeDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default SwipeableEdgeDrawer;
