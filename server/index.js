import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Data directory for JSON storage
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// =============================================================================
// JSON File Storage Helpers
// =============================================================================

function getUserDataPath(userId) {
  return path.join(DATA_DIR, `user_${userId}.json`);
}

function readUserData(userId) {
  const filePath = getUserDataPath(userId);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  return {
    userId,
    entries: [],
    dailySummaries: []
  };
}

function writeUserData(userId, data) {
  const filePath = getUserDataPath(userId);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function generateEntryId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// =============================================================================
// AI Helper Functions
// =============================================================================

async function analyzeImageWithGemini(base64Image, prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Remove data URL prefix if present
    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageData
        }
      }
    ]);

    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

async function generateTextWithGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

// =============================================================================
// API Routes
// =============================================================================

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'BiteBalance API Server (JSON Storage)' });
});

// -----------------------------------------------------------------------------
// POST /generate-info - Analyze meal image for nutritional information
// -----------------------------------------------------------------------------
app.post('/generate-info', async (req, res) => {
  try {
    const { b64 } = req.body;

    if (!b64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const prompt = `Analyze this food image and provide nutritional information.

If this is NOT a food/meal image, respond with exactly: ERROR

If this IS a food image, respond in this exact JSON format:
{
  "foodName": "Name of the dish/food",
  "estimatedCalories": number,
  "protein": number (in grams),
  "carbs": number (in grams),
  "fat": number (in grams),
  "fiber": number (in grams),
  "sugar": number (in grams),
  "sodium": number (in mg),
  "confidence": "high" | "medium" | "low",
  "notes": "Any additional notes about the meal"
}

Be as accurate as possible with the nutritional estimates based on typical portion sizes visible in the image.`;

    const result = await analyzeImageWithGemini(b64, prompt);

    // Check if it's an error response
    if (result.trim() === 'ERROR' || result.includes('ERROR')) {
      return res.send(' ERROR');
    }

    // Try to parse as JSON, if fails return raw text
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json(parsed);
      }
    } catch (e) {
      // Return raw text if JSON parsing fails
    }

    res.send(result);
  } catch (error) {
    console.error('Error in /generate-info:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

// -----------------------------------------------------------------------------
// POST /generate-ingredients - Identify ingredients from image
// -----------------------------------------------------------------------------
app.post('/generate-ingredients', async (req, res) => {
  try {
    const { b64 } = req.body;

    if (!b64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const prompt = `Analyze this image and identify all food ingredients visible.

If this image does NOT contain food or ingredients, respond with exactly: ERROR

If this IS an image of food/ingredients, respond in this exact JSON format:
{
  "ingredients": [
    { "name": "ingredient name", "quantity": "estimated quantity", "category": "vegetable|fruit|protein|dairy|grain|spice|other" }
  ],
  "totalCount": number,
  "suggestedDishes": ["dish 1", "dish 2", "dish 3"]
}

Be thorough and identify all visible ingredients.`;

    const result = await analyzeImageWithGemini(b64, prompt);

    if (result.trim() === 'ERROR' || result.includes('ERROR')) {
      return res.send(' ERROR');
    }

    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json(parsed);
      }
    } catch (e) {
      // Return raw text if JSON parsing fails
    }

    res.send(result);
  } catch (error) {
    console.error('Error in /generate-ingredients:', error);
    res.status(500).json({ error: 'Failed to identify ingredients' });
  }
});

// -----------------------------------------------------------------------------
// POST /generate-recipe - Generate recipe from ingredients
// -----------------------------------------------------------------------------
app.post('/generate-recipe', async (req, res) => {
  try {
    const { ingredients, dietRestrictions, cooking_time, people, difficulty } = req.body;

    if (!ingredients) {
      return res.status(400).json({ error: 'No ingredients provided' });
    }

    const prompt = `Create a recipe using these ingredients: ${JSON.stringify(ingredients)}

Requirements:
- Diet preference: ${dietRestrictions || 'any'}
- Cooking time: ${cooking_time || 30} minutes maximum
- Servings: ${people || 2} people
- Difficulty level: ${difficulty || 'intermediate'}

Respond in this exact JSON format:
{
  "recipeName": "Name of the dish",
  "description": "Brief description of the dish",
  "prepTime": number (minutes),
  "cookTime": number (minutes),
  "totalTime": number (minutes),
  "servings": number,
  "difficulty": "easy" | "intermediate" | "advanced",
  "ingredients": [
    { "item": "ingredient name", "amount": "quantity with unit" }
  ],
  "instructions": [
    { "step": 1, "instruction": "Step description" }
  ],
  "nutritionPerServing": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "tips": ["tip 1", "tip 2"]
}

Create a delicious, practical recipe that can realistically be made with the given ingredients.`;

    const result = await generateTextWithGemini(prompt);

    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json(parsed);
      }
    } catch (e) {
      // Return raw text if JSON parsing fails
    }

    res.json({ recipe: result });
  } catch (error) {
    console.error('Error in /generate-recipe:', error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

// -----------------------------------------------------------------------------
// GET /calories/:userId - Get calorie/nutrition data for a user
// -----------------------------------------------------------------------------
app.get('/calories/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;

    const userData = readUserData(userId);

    if (date) {
      // Get data for specific date
      const dailySummary = userData.dailySummaries.find(s => s.date === date);
      const dayEntries = userData.entries.filter(e => e.date === date);

      return res.json({
        totalCalories: dailySummary?.totalCalories || 0,
        totalProtein: dailySummary?.totalProtein || 0,
        totalCarbs: dailySummary?.totalCarbs || 0,
        totalFat: dailySummary?.totalFat || 0,
        mealCount: dailySummary?.mealCount || 0,
        entries: dayEntries
      });
    }

    // Return all data if no date specified
    res.json(userData);
  } catch (error) {
    console.error('Error in /calories/:userId:', error);
    res.status(500).json({ error: 'Failed to fetch calorie data' });
  }
});

// -----------------------------------------------------------------------------
// GET /ycalories/:userId - Get yearly/historical calorie data
// -----------------------------------------------------------------------------
app.get('/ycalories/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;

    const userData = readUserData(userId);

    if (date) {
      const dayEntries = userData.entries.filter(e => e.date === date);
      const totals = dayEntries.reduce((acc, entry) => ({
        totalCalories: acc.totalCalories + (entry.calories || 0),
        totalProtein: acc.totalProtein + (entry.protein || 0),
        totalCarbs: acc.totalCarbs + (entry.carbs || 0),
        totalFat: acc.totalFat + (entry.fat || 0)
      }), { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });

      return res.json({
        ...totals,
        entries: dayEntries
      });
    }

    res.json(userData.dailySummaries);
  } catch (error) {
    console.error('Error in /ycalories/:userId:', error);
    res.status(500).json({ error: 'Failed to fetch calorie data' });
  }
});

// -----------------------------------------------------------------------------
// POST /calories/update - Add/update calorie entry
// -----------------------------------------------------------------------------
app.post('/calories/update', (req, res) => {
  try {
    const { userId, calories, protein, carbs, fat, fiber, sugar, sodium, foodName, mealType } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const today = new Date().toISOString().split('T')[0];

    // Read existing data
    const userData = readUserData(userId);

    // Add new entry
    const newEntry = {
      id: generateEntryId(),
      date: today,
      mealType: mealType || 'snack',
      foodName: foodName || 'Meal',
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      fiber: fiber || 0,
      sugar: sugar || 0,
      sodium: sodium || 0,
      createdAt: new Date().toISOString()
    };

    userData.entries.push(newEntry);

    // Update daily summary
    let summaryIndex = userData.dailySummaries.findIndex(s => s.date === today);

    if (summaryIndex === -1) {
      userData.dailySummaries.push({
        date: today,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        mealCount: 0
      });
      summaryIndex = userData.dailySummaries.length - 1;
    }

    userData.dailySummaries[summaryIndex] = {
      ...userData.dailySummaries[summaryIndex],
      totalCalories: (userData.dailySummaries[summaryIndex].totalCalories || 0) + (calories || 0),
      totalProtein: (userData.dailySummaries[summaryIndex].totalProtein || 0) + (protein || 0),
      totalCarbs: (userData.dailySummaries[summaryIndex].totalCarbs || 0) + (carbs || 0),
      totalFat: (userData.dailySummaries[summaryIndex].totalFat || 0) + (fat || 0),
      mealCount: (userData.dailySummaries[summaryIndex].mealCount || 0) + 1
    };

    // Save to file
    writeUserData(userId, userData);

    res.json({
      success: true,
      message: 'Calorie data updated',
      entry: newEntry,
      dailySummary: userData.dailySummaries[summaryIndex]
    });
  } catch (error) {
    console.error('Error in /calories/update:', error);
    res.status(500).json({ error: 'Failed to update calorie data' });
  }
});

// -----------------------------------------------------------------------------
// GET /stats/:userId - Get comprehensive stats for a user
// -----------------------------------------------------------------------------
app.get('/stats/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 7 } = req.query;

    const userData = readUserData(userId);

    if (!userData.entries || userData.entries.length === 0) {
      return res.json({
        weeklyData: [],
        averages: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        streak: 0,
        totalMeals: 0
      });
    }

    // Get last N days of data
    const today = new Date();
    const weeklyData = [];

    for (let i = 0; i < parseInt(days); i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const summary = userData.dailySummaries.find(s => s.date === dateStr);
      weeklyData.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        calories: summary?.totalCalories || 0,
        protein: summary?.totalProtein || 0,
        carbs: summary?.totalCarbs || 0,
        fat: summary?.totalFat || 0,
        mealCount: summary?.mealCount || 0
      });
    }

    // Calculate averages
    const daysWithData = weeklyData.filter(d => d.calories > 0);
    const averages = daysWithData.length > 0 ? {
      calories: Math.round(daysWithData.reduce((a, b) => a + b.calories, 0) / daysWithData.length),
      protein: Math.round(daysWithData.reduce((a, b) => a + b.protein, 0) / daysWithData.length),
      carbs: Math.round(daysWithData.reduce((a, b) => a + b.carbs, 0) / daysWithData.length),
      fat: Math.round(daysWithData.reduce((a, b) => a + b.fat, 0) / daysWithData.length)
    } : { calories: 0, protein: 0, carbs: 0, fat: 0 };

    // Calculate streak
    let streak = 0;
    for (let i = 0; i < weeklyData.length; i++) {
      if (weeklyData[i].mealCount > 0) {
        streak++;
      } else {
        break;
      }
    }

    res.json({
      weeklyData: weeklyData.reverse(),
      averages,
      streak,
      totalMeals: userData.entries.length
    });
  } catch (error) {
    console.error('Error in /stats/:userId:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// -----------------------------------------------------------------------------
// DELETE /calories/:userId/entry/:entryId - Delete a specific entry
// -----------------------------------------------------------------------------
app.delete('/calories/:userId/entry/:entryId', (req, res) => {
  try {
    const { userId, entryId } = req.params;

    const userData = readUserData(userId);

    const entryIndex = userData.entries.findIndex(e => e.id === entryId);

    if (entryIndex === -1) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const entry = userData.entries[entryIndex];

    // Update daily summary
    const summaryIndex = userData.dailySummaries.findIndex(s => s.date === entry.date);
    if (summaryIndex !== -1) {
      userData.dailySummaries[summaryIndex].totalCalories -= entry.calories || 0;
      userData.dailySummaries[summaryIndex].totalProtein -= entry.protein || 0;
      userData.dailySummaries[summaryIndex].totalCarbs -= entry.carbs || 0;
      userData.dailySummaries[summaryIndex].totalFat -= entry.fat || 0;
      userData.dailySummaries[summaryIndex].mealCount -= 1;
    }

    userData.entries.splice(entryIndex, 1);

    // Save to file
    writeUserData(userId, userData);

    res.json({ success: true, message: 'Entry deleted' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

// -----------------------------------------------------------------------------
// GET /entries/:userId - Get all entries for a user (with optional date filter)
// -----------------------------------------------------------------------------
app.get('/entries/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { date, limit = 50 } = req.query;

    const userData = readUserData(userId);

    let entries = userData.entries;

    if (date) {
      entries = entries.filter(e => e.date === date);
    }

    // Sort by createdAt descending and limit
    entries = entries
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, parseInt(limit));

    res.json({ entries });
  } catch (error) {
    console.error('Error in /entries/:userId:', error);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`BiteBalance API Server running on port ${PORT}`);
  console.log(`Using JSON file storage in: ${DATA_DIR}`);
  console.log(`Health check: http://localhost:${PORT}/`);
});
