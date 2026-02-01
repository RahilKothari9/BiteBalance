import React, { useState, useEffect } from 'react';
import { UserAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

export default function QuickLog() {
  const { user } = UserAuth();
  const [favorites, setFavorites] = useState([]);
  const [recentMeals, setRecentMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loggingId, setLoggingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loggedSuccess, setLoggedSuccess] = useState(null);
  const [newMeal, setNewMeal] = useState({
    foodName: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    mealType: 'snack',
  });

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem(`bitebalance_favorites_${user?.uid}`);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid) {
      fetchRecentMeals();
    }
  }, [user]);

  const fetchRecentMeals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}entries/${user.uid}?limit=10`
      );
      const data = await response.json();
      // Get unique meals by name
      const uniqueMeals = [];
      const seen = new Set();
      for (const meal of data.entries || []) {
        if (meal.foodName && !seen.has(meal.foodName)) {
          seen.add(meal.foodName);
          uniqueMeals.push(meal);
        }
      }
      setRecentMeals(uniqueMeals.slice(0, 6));
    } catch (err) {
      console.error('Error fetching recent meals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLog = async (meal) => {
    setLoggingId(meal.id || meal.foodName);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}calories/update`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            foodName: meal.foodName,
            mealType: meal.mealType || 'snack',
            calories: meal.calories || 0,
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fat: meal.fat || 0,
            fiber: meal.fiber || 0,
            sugar: meal.sugar || 0,
            sodium: meal.sodium || 0,
          }),
        }
      );

      if (response.ok) {
        setLoggedSuccess(meal.foodName);
        setTimeout(() => setLoggedSuccess(null), 2000);
      }
    } catch (err) {
      console.error('Error logging meal:', err);
    } finally {
      setLoggingId(null);
    }
  };

  const handleAddFavorite = (meal) => {
    const newFavorite = {
      id: Date.now().toString(),
      foodName: meal.foodName,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      mealType: meal.mealType,
    };
    const updated = [...favorites, newFavorite];
    setFavorites(updated);
    localStorage.setItem(`bitebalance_favorites_${user.uid}`, JSON.stringify(updated));
  };

  const handleRemoveFavorite = (id) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem(`bitebalance_favorites_${user.uid}`, JSON.stringify(updated));
  };

  const handleSaveNewMeal = () => {
    if (!newMeal.foodName.trim()) return;
    handleAddFavorite(newMeal);
    setNewMeal({
      foodName: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      mealType: 'snack',
    });
    setShowAddForm(false);
  };

  const isFavorite = (foodName) => {
    return favorites.some(f => f.foodName === foodName);
  };

  return (
    <div className="min-h-screen bg-cream pt-[72px]">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-lg blob-coral absolute -top-40 -right-40 opacity-15 animate-float" />
        <div className="blob blob-lg blob-teal absolute bottom-0 -left-40 opacity-15 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Success Toast */}
      {loggedSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in">
          <div className="bg-teal text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <CheckIcon className="w-5 h-5" />
            <span className="font-medium">{loggedSuccess} logged!</span>
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 animate-in">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal mb-2">
              Quick Log
            </h1>
            <p className="text-warm-gray">
              Log your favorite meals with one tap
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
            className="mt-4 sm:mt-0"
            icon={() => <PlusIcon className="w-4 h-4" />}
          >
            Add Favorite
          </Button>
        </div>

        {/* Add New Favorite Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-charcoal">
                Create Favorite Meal
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 text-warm-gray hover:text-charcoal hover:bg-sand rounded-lg transition-colors"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-charcoal mb-2">Meal Name</label>
                <input
                  type="text"
                  value={newMeal.foodName}
                  onChange={(e) => setNewMeal({ ...newMeal, foodName: e.target.value })}
                  placeholder="e.g., Chicken Salad"
                  className="w-full px-4 py-3 bg-sand border-2 border-transparent rounded-xl text-charcoal placeholder-stone focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Calories</label>
                <input
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-sand border-2 border-transparent rounded-xl text-charcoal font-mono focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Protein (g)</label>
                <input
                  type="number"
                  value={newMeal.protein}
                  onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-sand border-2 border-transparent rounded-xl text-charcoal font-mono focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Carbs (g)</label>
                <input
                  type="number"
                  value={newMeal.carbs}
                  onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-sand border-2 border-transparent rounded-xl text-charcoal font-mono focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Fat (g)</label>
                <input
                  type="number"
                  value={newMeal.fat}
                  onChange={(e) => setNewMeal({ ...newMeal, fat: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-sand border-2 border-transparent rounded-xl text-charcoal font-mono focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral focus:bg-white transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-charcoal mb-2">Meal Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                    <button
                      key={type}
                      onClick={() => setNewMeal({ ...newMeal, mealType: type })}
                      className={`
                        py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-fast
                        ${newMeal.mealType === type
                          ? 'bg-coral text-white shadow-glow-coral'
                          : 'bg-sand text-charcoal hover:bg-coral-light'
                        }
                      `}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="teal"
              size="lg"
              onClick={handleSaveNewMeal}
              disabled={!newMeal.foodName.trim()}
              className="w-full"
            >
              Save to Favorites
            </Button>
          </div>
        )}

        {/* Favorites Section */}
        <div className="mb-8 animate-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <HeartIcon className="w-5 h-5 text-coral" />
            <h2 className="font-display font-bold text-xl text-charcoal">
              Favorites
            </h2>
          </div>

          {favorites.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-coral-light rounded-2xl flex items-center justify-center">
                <HeartIcon className="w-8 h-8 text-coral" />
              </div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">No favorites yet</h3>
              <p className="text-warm-gray mb-4">
                Save your frequently eaten meals for quick logging
              </p>
              <Button variant="primary" onClick={() => setShowAddForm(true)}>
                Add Your First Favorite
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((meal, index) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onLog={() => handleQuickLog(meal)}
                  onRemove={() => handleRemoveFavorite(meal.id)}
                  isLogging={loggingId === meal.id}
                  isFavorite={true}
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Meals Section */}
        <div className="animate-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <ClockIcon className="w-5 h-5 text-teal" />
            <h2 className="font-display font-bold text-xl text-charcoal">
              Recent Meals
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-sand rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentMeals.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-teal-light rounded-2xl flex items-center justify-center">
                <ClockIcon className="w-8 h-8 text-teal" />
              </div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">No recent meals</h3>
              <p className="text-warm-gray">
                Track some meals to see them here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentMeals.map((meal, index) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onLog={() => handleQuickLog(meal)}
                  onAddFavorite={() => handleAddFavorite(meal)}
                  isLogging={loggingId === meal.foodName}
                  isFavorite={isFavorite(meal.foodName)}
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Common Meals Section */}
        <div className="mt-8 animate-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <SparkleIcon className="w-5 h-5 text-gold" />
            <h2 className="font-display font-bold text-xl text-charcoal">
              Common Meals
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {COMMON_MEALS.map((meal, index) => (
              <button
                key={meal.name}
                onClick={() => handleQuickLog({
                  foodName: meal.name,
                  calories: meal.calories,
                  protein: meal.protein,
                  carbs: meal.carbs,
                  fat: meal.fat,
                  mealType: meal.type,
                })}
                disabled={loggingId === meal.name}
                className="bg-white rounded-xl p-4 text-left hover:shadow-md hover:scale-[1.02] transition-all duration-fast group animate-in"
                style={{ animationDelay: `${300 + index * 30}ms` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{meal.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal truncate">{meal.name}</p>
                    <p className="text-xs text-warm-gray capitalize">{meal.type}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono text-coral font-bold">{meal.calories} kcal</span>
                  <span className="text-teal opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <PlusIcon className="w-3 h-3" /> Log
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Meal Card Component
const MealCard = ({ meal, onLog, onRemove, onAddFavorite, isLogging, isFavorite, style }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-fast group animate-in"
      style={style}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-charcoal truncate">{meal.foodName}</h3>
            <p className="text-sm text-warm-gray capitalize">{meal.mealType || 'snack'}</p>
          </div>
          {isFavorite && onRemove ? (
            <button
              onClick={onRemove}
              className="p-1.5 text-coral hover:bg-coral-light rounded-lg transition-colors"
            >
              <HeartFilledIcon className="w-4 h-4" />
            </button>
          ) : onAddFavorite && (
            <button
              onClick={onAddFavorite}
              className="p-1.5 text-warm-gray hover:text-coral hover:bg-coral-light rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <HeartIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <NutrientPill label="Cal" value={meal.calories} color="coral" />
          <NutrientPill label="Pro" value={meal.protein} color="teal" />
          <NutrientPill label="Carb" value={meal.carbs} color="gold" />
          <NutrientPill label="Fat" value={meal.fat} color="coral" />
        </div>

        <button
          onClick={onLog}
          disabled={isLogging}
          className="w-full py-2.5 bg-teal text-white font-medium rounded-xl hover:bg-teal/90 active:scale-[0.98] transition-all duration-fast disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLogging ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Logging...
            </>
          ) : (
            <>
              <PlusIcon className="w-4 h-4" />
              Quick Log
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Nutrient Pill Component
const NutrientPill = ({ label, value, color }) => {
  const colors = {
    coral: 'bg-coral-light text-coral',
    teal: 'bg-teal-light text-teal',
    gold: 'bg-gold-light text-gold',
  };

  return (
    <div className={`${colors[color]} rounded-lg py-1 px-2 text-center`}>
      <p className="font-mono text-xs font-bold">{value || 0}</p>
      <p className="text-[10px] opacity-70">{label}</p>
    </div>
  );
};

// Common Meals Data
const COMMON_MEALS = [
  { name: 'Oatmeal', emoji: '🥣', calories: 300, protein: 10, carbs: 54, fat: 6, type: 'breakfast' },
  { name: 'Eggs & Toast', emoji: '🍳', calories: 350, protein: 18, carbs: 30, fat: 16, type: 'breakfast' },
  { name: 'Chicken Salad', emoji: '🥗', calories: 400, protein: 35, carbs: 15, fat: 22, type: 'lunch' },
  { name: 'Sandwich', emoji: '🥪', calories: 450, protein: 20, carbs: 45, fat: 18, type: 'lunch' },
  { name: 'Grilled Chicken', emoji: '🍗', calories: 350, protein: 40, carbs: 5, fat: 15, type: 'dinner' },
  { name: 'Pasta', emoji: '🍝', calories: 550, protein: 15, carbs: 80, fat: 18, type: 'dinner' },
  { name: 'Apple', emoji: '🍎', calories: 95, protein: 0, carbs: 25, fat: 0, type: 'snack' },
  { name: 'Protein Bar', emoji: '🍫', calories: 200, protein: 20, carbs: 22, fat: 8, type: 'snack' },
];

// Icons
const HeartIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const HeartFilledIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SparkleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
