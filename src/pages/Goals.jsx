import React, { useState, useEffect } from 'react';
import { UserAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const DEFAULT_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
};

export default function Goals() {
  const { user } = UserAuth();
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [todayData, setTodayData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState(DEFAULT_GOALS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem(`bitebalance_goals_${user?.uid}`);
    if (savedGoals) {
      const parsed = JSON.parse(savedGoals);
      setGoals(parsed);
      setEditValues(parsed);
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid) {
      fetchTodayData();
    }
  }, [user]);

  const fetchTodayData = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}calories/${user.uid}?date=${today}`
      );
      const data = await response.json();
      setTodayData(data);
    } catch (err) {
      console.error('Error fetching today data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGoals = () => {
    setIsSaving(true);
    // Save to localStorage
    localStorage.setItem(`bitebalance_goals_${user.uid}`, JSON.stringify(editValues));
    setGoals(editValues);
    setIsEditing(false);
    setIsSaving(false);
  };

  const getProgress = (current, goal) => {
    if (!goal) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-teal';
    if (progress >= 75) return 'bg-gold';
    return 'bg-coral';
  };

  const remaining = {
    calories: Math.max(goals.calories - (todayData?.totalCalories || 0), 0),
    protein: Math.max(goals.protein - (todayData?.totalProtein || 0), 0),
    carbs: Math.max(goals.carbs - (todayData?.totalCarbs || 0), 0),
    fat: Math.max(goals.fat - (todayData?.totalFat || 0), 0),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream pt-[72px]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-sand rounded w-48" />
            <div className="h-64 bg-sand rounded-2xl" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-sand rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-[72px]">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-lg blob-gold absolute -top-40 -left-40 opacity-15 animate-float" />
        <div className="blob blob-lg blob-coral absolute bottom-0 -right-40 opacity-15 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 animate-in">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal mb-2">
              Daily Goals
            </h1>
            <p className="text-warm-gray">
              Track your progress towards your nutrition goals
            </p>
          </div>
          <Button
            variant={isEditing ? 'secondary' : 'primary'}
            onClick={() => {
              if (isEditing) {
                setEditValues(goals);
              }
              setIsEditing(!isEditing);
            }}
            className="mt-4 sm:mt-0"
          >
            {isEditing ? 'Cancel' : 'Edit Goals'}
          </Button>
        </div>

        {/* Main Progress Ring */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 animate-in" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Calorie Ring */}
            <div className="relative">
              <svg className="w-56 h-56 transform -rotate-90">
                {/* Background ring */}
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  fill="none"
                  stroke="#F5F1EC"
                  strokeWidth="16"
                />
                {/* Progress ring */}
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  fill="none"
                  stroke="url(#calorieGradient)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 100}`}
                  strokeDashoffset={`${2 * Math.PI * 100 * (1 - getProgress(todayData?.totalCalories || 0, goals.calories) / 100)}`}
                  className="transition-all duration-slow"
                />
                <defs>
                  <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E85D4C" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-mono font-bold text-4xl text-charcoal">
                  {todayData?.totalCalories || 0}
                </p>
                <p className="text-warm-gray text-sm">of {goals.calories} kcal</p>
                <p className={`text-sm font-medium mt-1 ${getProgress(todayData?.totalCalories || 0, goals.calories) >= 100 ? 'text-teal' : 'text-coral'}`}>
                  {remaining.calories > 0 ? `${remaining.calories} left` : 'Goal reached!'}
                </p>
              </div>
            </div>

            {/* Macro Progress Bars */}
            <div className="flex-1 w-full space-y-6">
              <MacroProgress
                label="Protein"
                current={todayData?.totalProtein || 0}
                goal={goals.protein}
                unit="g"
                color="teal"
                icon={<ProteinIcon className="w-5 h-5" />}
              />
              <MacroProgress
                label="Carbohydrates"
                current={todayData?.totalCarbs || 0}
                goal={goals.carbs}
                unit="g"
                color="gold"
                icon={<CarbsIcon className="w-5 h-5" />}
              />
              <MacroProgress
                label="Fat"
                current={todayData?.totalFat || 0}
                goal={goals.fat}
                unit="g"
                color="coral"
                icon={<FatIcon className="w-5 h-5" />}
              />
            </div>
          </div>
        </div>

        {/* Edit Goals Form */}
        {isEditing && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-in">
            <h2 className="font-display font-bold text-xl text-charcoal mb-6">
              Set Your Daily Goals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <GoalInput
                label="Calories"
                value={editValues.calories}
                onChange={(v) => setEditValues({ ...editValues, calories: v })}
                unit="kcal"
                color="coral"
                min={1000}
                max={5000}
              />
              <GoalInput
                label="Protein"
                value={editValues.protein}
                onChange={(v) => setEditValues({ ...editValues, protein: v })}
                unit="g"
                color="teal"
                min={50}
                max={300}
              />
              <GoalInput
                label="Carbohydrates"
                value={editValues.carbs}
                onChange={(v) => setEditValues({ ...editValues, carbs: v })}
                unit="g"
                color="gold"
                min={100}
                max={500}
              />
              <GoalInput
                label="Fat"
                value={editValues.fat}
                onChange={(v) => setEditValues({ ...editValues, fat: v })}
                unit="g"
                color="coral"
                min={30}
                max={150}
              />
            </div>

            {/* Quick Presets */}
            <div className="mb-6">
              <p className="text-sm font-medium text-warm-gray mb-3">Quick Presets</p>
              <div className="flex flex-wrap gap-2">
                <PresetButton
                  label="Weight Loss"
                  onClick={() => setEditValues({ calories: 1500, protein: 130, carbs: 150, fat: 50 })}
                />
                <PresetButton
                  label="Maintenance"
                  onClick={() => setEditValues({ calories: 2000, protein: 150, carbs: 250, fat: 65 })}
                />
                <PresetButton
                  label="Muscle Gain"
                  onClick={() => setEditValues({ calories: 2500, protein: 200, carbs: 300, fat: 80 })}
                />
                <PresetButton
                  label="High Protein"
                  onClick={() => setEditValues({ calories: 2200, protein: 220, carbs: 200, fat: 70 })}
                />
              </div>
            </div>

            <Button
              variant="teal"
              size="lg"
              loading={isSaving}
              onClick={handleSaveGoals}
              className="w-full"
            >
              Save Goals
            </Button>
          </div>
        )}

        {/* Remaining Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 stagger-children">
          <RemainingCard
            label="Calories Left"
            value={remaining.calories}
            unit="kcal"
            progress={getProgress(todayData?.totalCalories || 0, goals.calories)}
            color="coral"
          />
          <RemainingCard
            label="Protein Left"
            value={remaining.protein}
            unit="g"
            progress={getProgress(todayData?.totalProtein || 0, goals.protein)}
            color="teal"
          />
          <RemainingCard
            label="Carbs Left"
            value={remaining.carbs}
            unit="g"
            progress={getProgress(todayData?.totalCarbs || 0, goals.carbs)}
            color="gold"
          />
          <RemainingCard
            label="Fat Left"
            value={remaining.fat}
            unit="g"
            progress={getProgress(todayData?.totalFat || 0, goals.fat)}
            color="coral"
          />
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-coral to-teal rounded-2xl p-6 text-white text-center animate-in" style={{ animationDelay: '300ms' }}>
          <p className="font-display font-bold text-xl mb-2">
            {getProgress(todayData?.totalCalories || 0, goals.calories) >= 100
              ? "Great job! You've reached your calorie goal!"
              : getProgress(todayData?.totalCalories || 0, goals.calories) >= 75
              ? "Almost there! Keep going!"
              : getProgress(todayData?.totalCalories || 0, goals.calories) >= 50
              ? "You're halfway to your goal!"
              : "Let's make today count!"}
          </p>
          <p className="text-white/80">
            {todayData?.mealCount || 0} meals logged today
          </p>
        </div>
      </main>
    </div>
  );
}

// Macro Progress Component
const MacroProgress = ({ label, current, goal, unit, color, icon }) => {
  const progress = Math.min((current / goal) * 100, 100);
  const colors = {
    coral: { bg: 'bg-coral-light', bar: 'bg-gradient-to-r from-coral to-orange-400', text: 'text-coral' },
    teal: { bg: 'bg-teal-light', bar: 'bg-gradient-to-r from-teal to-emerald-400', text: 'text-teal' },
    gold: { bg: 'bg-gold-light', bar: 'bg-gradient-to-r from-gold to-yellow-400', text: 'text-gold' },
  };
  const c = colors[color];

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`${c.bg} ${c.text} w-8 h-8 rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
          <span className="font-medium text-charcoal">{label}</span>
        </div>
        <span className="font-mono text-sm text-warm-gray">
          <span className={c.text}>{current}</span> / {goal}{unit}
        </span>
      </div>
      <div className={`h-3 ${c.bg} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${c.bar} rounded-full transition-all duration-slow group-hover:animate-pulse`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Goal Input Component
const GoalInput = ({ label, value, onChange, unit, color, min, max }) => {
  const colors = {
    coral: 'focus:ring-coral/50 focus:border-coral',
    teal: 'focus:ring-teal/50 focus:border-teal',
    gold: 'focus:ring-gold/50 focus:border-gold',
  };

  return (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-2">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          className={`
            w-full px-4 py-3 pr-12 bg-sand border-2 border-transparent rounded-xl
            font-mono text-charcoal
            focus:outline-none focus:ring-2 focus:bg-white ${colors[color]}
            transition-all duration-fast
          `}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-warm-gray">
          {unit}
        </span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="w-full mt-2 accent-coral"
      />
    </div>
  );
};

// Preset Button Component
const PresetButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-sand text-charcoal text-sm font-medium rounded-lg hover:bg-coral-light hover:text-coral transition-colors duration-fast"
  >
    {label}
  </button>
);

// Remaining Card Component
const RemainingCard = ({ label, value, unit, progress, color }) => {
  const colors = {
    coral: { bg: 'bg-coral-light', text: 'text-coral' },
    teal: { bg: 'bg-teal-light', text: 'text-teal' },
    gold: { bg: 'bg-gold-light', text: 'text-gold' },
  };
  const c = colors[color];

  return (
    <div className={`${c.bg} rounded-xl p-4 hover:scale-105 transition-transform duration-fast`}>
      <p className="text-xs font-medium text-charcoal/60 mb-1">{label}</p>
      <p className={`font-mono font-bold text-2xl ${progress >= 100 ? 'text-teal' : c.text}`}>
        {progress >= 100 ? (
          <CheckIcon className="w-6 h-6 inline" />
        ) : (
          <>
            {value}
            <span className="text-sm ml-1 opacity-70">{unit}</span>
          </>
        )}
      </p>
    </div>
  );
};

// Icons
const ProteinIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const CarbsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const FatIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
