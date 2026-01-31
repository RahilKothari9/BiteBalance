// Seasonal ingredients database for providing seasonal alternatives and recommendations

export const SEASONAL_INGREDIENTS = {
  spring: {
    vegetables: [
      { name: 'Asparagus', benefits: 'High in folate and vitamin K', preparation: 'Grill or roast for best flavor' },
      { name: 'Artichokes', benefits: 'Rich in fiber and antioxidants', preparation: 'Steam and serve with lemon' },
      { name: 'Peas', benefits: 'Good source of protein and fiber', preparation: 'Add to salads or pasta dishes' },
      { name: 'Spring onions', benefits: 'Mild flavor, rich in vitamin C', preparation: 'Use in stir-fries or as garnish' },
      { name: 'Radishes', benefits: 'Low calories, high in vitamin C', preparation: 'Eat raw in salads or pickle' },
      { name: 'Spinach', benefits: 'Iron and folate powerhouse', preparation: 'Sauté with garlic or add to smoothies' },
      { name: 'Lettuce', benefits: 'Hydrating and low calorie', preparation: 'Perfect for fresh salads' }
    ],
    fruits: [
      { name: 'Strawberries', benefits: 'High in vitamin C and antioxidants', preparation: 'Eat fresh or add to yogurt' },
      { name: 'Rhubarb', benefits: 'Good source of fiber', preparation: 'Stew with minimal sugar' },
      { name: 'Apricots', benefits: 'Rich in beta-carotene', preparation: 'Eat fresh or grill for dessert' }
    ],
    herbs: [
      { name: 'Chives', benefits: 'Adds onion flavor without calories', preparation: 'Sprinkle on eggs or salads' },
      { name: 'Parsley', benefits: 'Rich in vitamin K', preparation: 'Use fresh in salads or as garnish' },
      { name: 'Dill', benefits: 'Good source of calcium', preparation: 'Pairs well with fish and yogurt' }
    ]
  },
  summer: {
    vegetables: [
      { name: 'Tomatoes', benefits: 'High in lycopene and vitamin C', preparation: 'Eat fresh or grill for smokiness' },
      { name: 'Zucchini', benefits: 'Low calorie, high water content', preparation: 'Spiralize as pasta alternative' },
      { name: 'Bell peppers', benefits: 'Vitamin C powerhouse', preparation: 'Stuff with quinoa or eat raw' },
      { name: 'Corn', benefits: 'Good source of fiber', preparation: 'Grill or add to salads' },
      { name: 'Cucumber', benefits: 'Hydrating and cooling', preparation: 'Add to water or make gazpacho' },
      { name: 'Eggplant', benefits: 'High in fiber and antioxidants', preparation: 'Grill or roast until tender' },
      { name: 'Green beans', benefits: 'Rich in vitamin K', preparation: 'Steam lightly to retain crunch' }
    ],
    fruits: [
      { name: 'Berries', benefits: 'Antioxidant superstars', preparation: 'Eat fresh or freeze for smoothies' },
      { name: 'Peaches', benefits: 'Rich in vitamins A and C', preparation: 'Grill for natural sweetness' },
      { name: 'Watermelon', benefits: 'Hydrating and low calorie', preparation: 'Perfect summer snack' },
      { name: 'Cherries', benefits: 'Anti-inflammatory properties', preparation: 'Eat fresh or add to salads' },
      { name: 'Plums', benefits: 'Good source of vitamin C', preparation: 'Eat fresh or bake into desserts' }
    ],
    herbs: [
      { name: 'Basil', benefits: 'Anti-inflammatory properties', preparation: 'Make pesto or add to caprese' },
      { name: 'Mint', benefits: 'Aids digestion', preparation: 'Add to water or make tea' },
      { name: 'Oregano', benefits: 'Rich in antioxidants', preparation: 'Use in Mediterranean dishes' }
    ]
  },
  fall: {
    vegetables: [
      { name: 'Pumpkin', benefits: 'High in beta-carotene', preparation: 'Roast seeds for healthy snack' },
      { name: 'Sweet potatoes', benefits: 'Rich in vitamin A and fiber', preparation: 'Bake whole or cube and roast' },
      { name: 'Brussels sprouts', benefits: 'High in vitamin K and C', preparation: 'Roast until crispy edges form' },
      { name: 'Cauliflower', benefits: 'Low carb, high in vitamin C', preparation: 'Rice, mash, or roast whole' },
      { name: 'Beets', benefits: 'Rich in folate and nitrates', preparation: 'Roast or spiralize for salads' },
      { name: 'Carrots', benefits: 'High in beta-carotene', preparation: 'Roast with herbs or eat raw' },
      { name: 'Kale', benefits: 'Nutrient dense superfood', preparation: 'Massage for salads or bake chips' }
    ],
    fruits: [
      { name: 'Apples', benefits: 'High in fiber and vitamin C', preparation: 'Eat with skin for maximum fiber' },
      { name: 'Pears', benefits: 'Good source of fiber', preparation: 'Poach with cinnamon' },
      { name: 'Cranberries', benefits: 'Rich in antioxidants', preparation: 'Add to salads or make sauce' },
      { name: 'Pomegranate', benefits: 'Antioxidant powerhouse', preparation: 'Sprinkle seeds on yogurt' }
    ],
    herbs: [
      { name: 'Sage', benefits: 'May improve brain function', preparation: 'Crisp in butter for pasta' },
      { name: 'Rosemary', benefits: 'Rich in antioxidants', preparation: 'Roast with vegetables' },
      { name: 'Thyme', benefits: 'Antimicrobial properties', preparation: 'Add to roasted meats' }
    ]
  },
  winter: {
    vegetables: [
      { name: 'Cabbage', benefits: 'High in vitamin C and K', preparation: 'Make slaw or ferment into sauerkraut' },
      { name: 'Leeks', benefits: 'Good source of vitamin K', preparation: 'Add to soups and stews' },
      { name: 'Parsnips', benefits: 'High in fiber and folate', preparation: 'Roast or mash as potato alternative' },
      { name: 'Turnips', benefits: 'Low calorie, high in vitamin C', preparation: 'Roast or add to stews' },
      { name: 'Winter squash', benefits: 'Rich in vitamin A', preparation: 'Roast and use in soups' },
      { name: 'Collard greens', benefits: 'Calcium and vitamin K rich', preparation: 'Braise with garlic' }
    ],
    fruits: [
      { name: 'Citrus fruits', benefits: 'Vitamin C boost for immunity', preparation: 'Eat fresh or add to water' },
      { name: 'Persimmons', benefits: 'Rich in vitamins A and C', preparation: 'Eat fresh or add to salads' },
      { name: 'Kiwi', benefits: 'More vitamin C than oranges', preparation: 'Eat whole or add to smoothies' }
    ],
    herbs: [
      { name: 'Bay leaves', benefits: 'Anti-inflammatory properties', preparation: 'Add to soups and stews' },
      { name: 'Cinnamon', benefits: 'May help regulate blood sugar', preparation: 'Add to oats or coffee' },
      { name: 'Ginger', benefits: 'Aids digestion and reduces inflammation', preparation: 'Make tea or add to stir-fries' }
    ]
  }
};

/**
 * Gets current season based on the current month
 * @returns {string} Current season
 */
export const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1; // getMonth() returns 0-11
  
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
};

/**
 * Gets seasonal ingredients for a specific season
 * @param {string} season - The season to get ingredients for
 * @returns {Object} Seasonal ingredients object
 */
export const getSeasonalIngredients = (season = getCurrentSeason()) => {
  return SEASONAL_INGREDIENTS[season] || SEASONAL_INGREDIENTS[getCurrentSeason()];
};

/**
 * Suggests seasonal alternatives based on current ingredients
 * @param {Array} currentIngredients - Array of current ingredients
 * @param {string} season - Optional season, defaults to current
 * @returns {Array} Array of seasonal suggestions
 */
export const suggestSeasonalAlternatives = (currentIngredients = [], season = getCurrentSeason()) => {
  const seasonal = getSeasonalIngredients(season);
  const suggestions = [];

  // Common ingredient mappings to seasonal alternatives
  const seasonalMappings = {
    spring: {
      'lettuce': seasonal.vegetables.find(v => v.name === 'Spinach'),
      'onion': seasonal.vegetables.find(v => v.name === 'Spring onions'),
      'berries': seasonal.fruits.find(f => f.name === 'Strawberries')
    },
    summer: {
      'pasta': { name: 'Zucchini noodles', benefits: 'Lower carb alternative', preparation: 'Spiralize zucchini' },
      'potato': seasonal.vegetables.find(v => v.name === 'Zucchini'),
      'apple': seasonal.fruits.find(f => f.name === 'Peaches')
    },
    fall: {
      'potato': seasonal.vegetables.find(v => v.name === 'Sweet potatoes'),
      'rice': { name: 'Cauliflower rice', benefits: 'Lower carb, more nutrients', preparation: 'Pulse cauliflower in food processor' },
      'banana': seasonal.fruits.find(f => f.name === 'Apples')
    },
    winter: {
      'lettuce': seasonal.vegetables.find(v => v.name === 'Cabbage'),
      'potato': seasonal.vegetables.find(v => v.name === 'Parsnips'),
      'orange': seasonal.fruits.find(f => f.name === 'Citrus fruits')
    }
  };

  // Generate suggestions based on season
  const currentSeason = season || getCurrentSeason();
  const seasonalBenefits = {
    spring: 'Spring ingredients are fresh and help detoxify after winter. They\'re rich in vitamins and perfect for renewal.',
    summer: 'Summer produce is hydrating and cooling. High water content helps maintain hydration in hot weather.',
    fall: 'Fall ingredients are warming and rich in nutrients to prepare your body for winter. Great sources of vitamin A and fiber.',
    winter: 'Winter produce boosts immunity with vitamin C and provides warming, grounding nutrients.'
  };

  suggestions.push({
    category: `${currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Favorites`,
    description: seasonalBenefits[currentSeason],
    items: [
      ...seasonal.vegetables.slice(0, 3),
      ...seasonal.fruits.slice(0, 2)
    ]
  });

  return suggestions;
};

/**
 * Gets seasonal eating tips based on current season
 * @param {string} season - Optional season, defaults to current
 * @returns {Array} Array of seasonal eating tips
 */
export const getSeasonalEatingTips = (season = getCurrentSeason()) => {
  const tips = {
    spring: [
      "Focus on detoxifying foods like leafy greens and asparagus",
      "Take advantage of fresh herbs to reduce salt usage",
      "Enjoy lighter meals as the weather warms up"
    ],
    summer: [
      "Stay hydrated with water-rich foods like cucumber and watermelon", 
      "Grill vegetables to enhance their natural flavors",
      "Choose cooling foods and avoid heavy, hot meals"
    ],
    fall: [
      "Incorporate warming spices like cinnamon and ginger",
      "Focus on fiber-rich foods to support digestive health",
      "Use seasonal squashes as healthy carb alternatives"
    ],
    winter: [
      "Boost immunity with vitamin C-rich citrus fruits",
      "Include warming foods like ginger and root vegetables",
      "Make hearty soups and stews with seasonal vegetables"
    ]
  };

  return tips[season] || tips[getCurrentSeason()];
};