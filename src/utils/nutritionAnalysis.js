// Nutrition analysis utilities for food insights and recommendations

// Recommended daily values and thresholds for analysis
const DAILY_LIMITS = {
  calories: 2000,
  sodium: 2300, // mg
  saturatedFat: 20, // g (assuming 10% of total fats are saturated)
  sugars: 50, // g
  protein: 50, // g minimum
  fats: 65 // g
};

// Thresholds for classifying foods as high/low in nutrients (per serving)
const HIGH_THRESHOLDS = {
  sodium: 400, // mg per serving
  sugars: 15, // g per serving
  calories: 400, // calories per serving
  fats: 15 // g per serving
};

/**
 * Analyzes nutrition data and identifies potentially unhealthy aspects
 * @param {Object} nutritionData - The nutrition data object
 * @returns {Object} Analysis results with insights and recommendations
 */
export const analyzeNutrition = (nutritionData) => {
  const analysis = {
    concerns: [],
    positives: [],
    recommendations: [],
    healthScore: 100, // Start with perfect score and deduct points
    insights: []
  };

  const { calories, protein, carbs, sugars, fats, sodium } = nutritionData;

  // Convert string values to numbers
  const numericData = {
    calories: parseFloat(calories) || 0,
    protein: parseFloat(protein) || 0,
    carbs: parseFloat(carbs) || 0,
    sugars: parseFloat(sugars) || 0,
    fats: parseFloat(fats) || 0,
    sodium: parseFloat(sodium) || 0
  };

  // Analyze sodium content
  if (numericData.sodium > HIGH_THRESHOLDS.sodium) {
    analysis.concerns.push('High Sodium');
    analysis.recommendations.push('Consider choosing low-sodium alternatives or reducing portion size');
    analysis.healthScore -= 20;
    analysis.insights.push({
      type: 'concern',
      title: 'High Sodium Alert',
      message: `This meal contains ${numericData.sodium}mg of sodium. High sodium intake can contribute to high blood pressure.`,
      tip: 'Try using herbs and spices instead of salt for flavoring.'
    });
  } else if (numericData.sodium < 140) {
    analysis.positives.push('Low Sodium');
    analysis.insights.push({
      type: 'positive',
      title: 'Heart-Healthy Choice',
      message: 'This meal is low in sodium, which is great for heart health!'
    });
  }

  // Analyze sugar content
  if (numericData.sugars > HIGH_THRESHOLDS.sugars) {
    analysis.concerns.push('High Sugar');
    analysis.recommendations.push('Look for alternatives with natural sugars or reduce portion size');
    analysis.healthScore -= 15;
    analysis.insights.push({
      type: 'concern',
      title: 'Sugar Watch',
      message: `This meal contains ${numericData.sugars}g of sugar. Consider pairing with protein to help stabilize blood sugar.`,
      tip: 'Choose fruits over processed sweets for natural sweetness.'
    });
  }

  // Analyze calorie content
  if (numericData.calories > HIGH_THRESHOLDS.calories) {
    analysis.insights.push({
      type: 'info',
      title: 'Calorie Dense',
      message: `This is a calorie-dense meal (${numericData.calories} calories). Great for post-workout or when you need sustained energy.`
    });
    if (numericData.calories > 600) {
      analysis.concerns.push('Very High Calories');
      analysis.healthScore -= 10;
    }
  } else if (numericData.calories < 200) {
    analysis.insights.push({
      type: 'info',
      title: 'Light Meal',
      message: 'This is a light meal. Consider adding protein or healthy fats for more satiety.'
    });
  }

  // Analyze protein content
  if (numericData.protein > 15) {
    analysis.positives.push('Good Protein Source');
    analysis.insights.push({
      type: 'positive',
      title: 'Protein Power',
      message: `Excellent protein content (${numericData.protein}g)! Protein helps with muscle maintenance and satiety.`
    });
  } else if (numericData.protein < 5) {
    analysis.recommendations.push('Consider adding a protein source like nuts, beans, or lean meat');
    analysis.insights.push({
      type: 'suggestion',
      title: 'Boost Your Protein',
      message: 'This meal is low in protein. Adding protein can help you feel full longer.',
      tip: 'Try adding Greek yogurt, nuts, or beans to increase protein content.'
    });
  }

  // Analyze fat content
  if (numericData.fats > HIGH_THRESHOLDS.fats) {
    analysis.insights.push({
      type: 'info',
      title: 'Fat Content',
      message: `This meal is relatively high in fats (${numericData.fats}g). If these are healthy fats from sources like avocado or nuts, that's great!`
    });
  }

  // Calculate macronutrient ratios
  const totalMacros = numericData.protein + numericData.carbs + numericData.fats;
  if (totalMacros > 0) {
    const proteinPercent = Math.round((numericData.protein / totalMacros) * 100);
    const carbPercent = Math.round((numericData.carbs / totalMacros) * 100);
    const fatPercent = Math.round((numericData.fats / totalMacros) * 100);
    
    analysis.macroRatios = { proteinPercent, carbPercent, fatPercent };
    
    // Provide insights on macro balance
    if (proteinPercent >= 25) {
      analysis.insights.push({
        type: 'positive',
        title: 'Well-Balanced Protein',
        message: `Great protein balance (${proteinPercent}% of macros)!`
      });
    }
  }

  // Overall health score interpretation
  if (analysis.healthScore >= 90) {
    analysis.healthGrade = 'A';
    analysis.overallMessage = 'Excellent nutritional choice!';
  } else if (analysis.healthScore >= 80) {
    analysis.healthGrade = 'B';
    analysis.overallMessage = 'Good nutritional choice with room for improvement.';
  } else if (analysis.healthScore >= 70) {
    analysis.healthGrade = 'C';
    analysis.overallMessage = 'Decent choice, but consider healthier alternatives.';
  } else {
    analysis.healthGrade = 'D';
    analysis.overallMessage = 'Consider choosing a healthier alternative.';
  }

  return analysis;
};

/**
 * Suggests healthier alternatives based on nutrition analysis
 * @param {Object} nutritionData - The original nutrition data
 * @param {Object} analysis - The nutrition analysis results
 * @returns {Array} Array of alternative suggestions
 */
export const suggestHealthierAlternatives = (nutritionData, analysis) => {
  const alternatives = [];

  // High sodium alternatives
  if (analysis.concerns.includes('High Sodium')) {
    alternatives.push({
      category: 'Low Sodium',
      suggestions: [
        {
          title: 'Use herbs and spices',
          description: 'Replace salt with garlic, herbs, lemon juice, or vinegar for flavor',
          benefit: 'Reduces sodium by up to 300mg per serving'
        },
        {
          title: 'Choose fresh over processed',
          description: 'Opt for fresh vegetables instead of canned or pickled ones',
          benefit: 'Can reduce sodium by 200-400mg'
        },
        {
          title: 'Rinse canned foods',
          description: 'Rinse canned beans or vegetables to remove excess sodium',
          benefit: 'Reduces sodium by up to 40%'
        }
      ]
    });
  }

  // High sugar alternatives
  if (analysis.concerns.includes('High Sugar')) {
    alternatives.push({
      category: 'Lower Sugar',
      suggestions: [
        {
          title: 'Add fiber',
          description: 'Include more vegetables or whole grains to slow sugar absorption',
          benefit: 'Helps stabilize blood sugar levels'
        },
        {
          title: 'Natural sweeteners',
          description: 'Use fruits like berries or dates instead of added sugars',
          benefit: 'Provides antioxidants along with natural sweetness'
        },
        {
          title: 'Portion control',
          description: 'Enjoy a smaller portion and add protein or healthy fats',
          benefit: 'Reduces sugar intake while maintaining satisfaction'
        }
      ]
    });
  }

  // High calorie alternatives
  if (analysis.concerns.includes('Very High Calories')) {
    alternatives.push({
      category: 'Calorie Conscious',
      suggestions: [
        {
          title: 'Bulk up with vegetables',
          description: 'Add more non-starchy vegetables to increase volume with fewer calories',
          benefit: 'Maintains portion size while reducing calories by 100-200'
        },
        {
          title: 'Cooking method swap',
          description: 'Try grilling, steaming, or baking instead of frying',
          benefit: 'Can reduce calories by 150-300 per serving'
        }
      ]
    });
  }

  // Low protein suggestions
  if (analysis.recommendations.some(rec => rec.includes('protein'))) {
    alternatives.push({
      category: 'Protein Boost',
      suggestions: [
        {
          title: 'Add Greek yogurt',
          description: 'Include a side of Greek yogurt or use it as a topping',
          benefit: 'Adds 15-20g of protein'
        },
        {
          title: 'Sprinkle nuts or seeds',
          description: 'Top your meal with almonds, walnuts, or chia seeds',
          benefit: 'Adds 5-10g of protein plus healthy fats'
        },
        {
          title: 'Include legumes',
          description: 'Add beans, lentils, or chickpeas to your meal',
          benefit: 'Adds 10-15g of protein plus fiber'
        }
      ]
    });
  }

  return alternatives;
};

/**
 * Generates educational "Did you know?" facts based on nutrition data
 * @param {Object} nutritionData - The nutrition data
 * @returns {Array} Array of educational facts
 */
export const generateEducationalFacts = (nutritionData) => {
  const facts = [
    "Did you know? Protein helps you feel full longer because it takes more energy to digest than carbs or fats.",
    "Did you know? The average American consumes 3,400mg of sodium daily - 50% more than recommended!",
    "Did you know? Fiber from vegetables helps slow sugar absorption, preventing blood sugar spikes.",
    "Did you know? Eating colorful foods ensures you get a variety of antioxidants and nutrients.",
    "Did you know? Healthy fats from nuts, avocados, and fish are essential for brain function.",
    "Did you know? Your taste buds adapt to less salt within 2-3 weeks of reducing sodium intake."
  ];

  // Select relevant facts based on the nutrition data
  const relevantFacts = [];
  const { protein, sodium, sugars } = nutritionData;

  if (parseFloat(protein) > 15) {
    relevantFacts.push("Did you know? This meal's high protein content will help maintain stable blood sugar and keep you satisfied longer!");
  }

  if (parseFloat(sodium) > 400) {
    relevantFacts.push("Did you know? Reducing sodium intake by just 400mg daily can significantly lower blood pressure in many people.");
  }

  if (parseFloat(sugars) < 10) {
    relevantFacts.push("Did you know? Keeping sugar intake low like this meal helps maintain steady energy levels throughout the day!");
  }

  // Add 2-3 random facts if we don't have enough relevant ones
  while (relevantFacts.length < 3) {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    if (!relevantFacts.includes(randomFact)) {
      relevantFacts.push(randomFact);
    }
  }

  return relevantFacts.slice(0, 3);
};