import React, { useState, useEffect } from 'react';
import { UserAuth } from '../contexts/AuthContext';

const Stats = () => {
  const { user } = UserAuth();
  const [stats, setStats] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    if (user?.uid) {
      fetchStats();
    }
  }, [user, timeRange]);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch comprehensive stats
      const statsRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}stats/${user.uid}?days=${timeRange}`
      );
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch today's data
      const today = new Date().toISOString().split('T')[0];
      const todayRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}calories/${user.uid}?date=${today}`
      );
      const todayResult = await todayRes.json();
      setTodayData(todayResult);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream pt-[72px]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-sand rounded w-48" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-sand rounded-xl" />
              ))}
            </div>
            <div className="h-64 bg-sand rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-[72px]">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-lg blob-gold absolute -top-40 -right-40 opacity-15" />
        <div className="blob blob-lg blob-teal absolute bottom-0 -left-40 opacity-15" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 animate-in">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal mb-2">
              Your Stats
            </h1>
            <p className="text-warm-gray">
              Track your nutrition journey
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 mt-4 sm:mt-0">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-all duration-fast
                  ${timeRange === days
                    ? 'bg-gold text-charcoal shadow-glow-gold'
                    : 'bg-white text-warm-gray hover:bg-sand'
                  }
                `}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-light rounded-xl text-error text-sm">
            {error}
          </div>
        )}

        {/* Today's Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger-children">
          <StatCard
            label="Calories"
            value={todayData?.totalCalories || 0}
            unit="kcal"
            color="coral"
            icon={<FlameIcon />}
            max={2000}
          />
          <StatCard
            label="Protein"
            value={todayData?.totalProtein || 0}
            unit="g"
            color="teal"
            icon={<ProteinIcon />}
            max={150}
          />
          <StatCard
            label="Carbs"
            value={todayData?.totalCarbs || 0}
            unit="g"
            color="gold"
            icon={<CarbsIcon />}
            max={300}
          />
          <StatCard
            label="Fat"
            value={todayData?.totalFat || 0}
            unit="g"
            color="coral"
            icon={<FatIcon />}
            max={65}
          />
        </div>

        {/* Streak & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 animate-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-coral to-orange-400 rounded-xl flex items-center justify-center">
                <FireIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-warm-gray">Current Streak</p>
                <p className="font-display font-bold text-3xl text-charcoal">
                  {stats?.streak || 0}
                  <span className="text-lg text-warm-gray ml-1">days</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 animate-in" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-teal to-emerald-400 rounded-xl flex items-center justify-center">
                <MealsIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-warm-gray">Total Meals</p>
                <p className="font-display font-bold text-3xl text-charcoal">
                  {stats?.totalMeals || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 animate-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-gold to-yellow-400 rounded-xl flex items-center justify-center">
                <AvgIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-warm-gray">Avg. Calories</p>
                <p className="font-display font-bold text-3xl text-charcoal">
                  {stats?.averages?.calories || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-in" style={{ animationDelay: '350ms' }}>
          <h2 className="font-display font-bold text-xl text-charcoal mb-6">
            Calorie Trend
          </h2>
          <div className="h-64">
            <SimpleBarChart data={stats?.weeklyData || []} />
          </div>
        </div>

        {/* Macro Averages */}
        <div className="bg-white rounded-xl shadow-md p-6 animate-in" style={{ animationDelay: '400ms' }}>
          <h2 className="font-display font-bold text-xl text-charcoal mb-6">
            Average Macros ({timeRange} days)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <MacroAvg label="Calories" value={stats?.averages?.calories || 0} unit="kcal" color="coral" />
            <MacroAvg label="Protein" value={stats?.averages?.protein || 0} unit="g" color="teal" />
            <MacroAvg label="Carbs" value={stats?.averages?.carbs || 0} unit="g" color="gold" />
            <MacroAvg label="Fat" value={stats?.averages?.fat || 0} unit="g" color="coral" />
          </div>
        </div>
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, unit, color, icon, max }) => {
  const colors = {
    coral: { bg: 'bg-coral-light', text: 'text-coral', bar: 'bg-coral' },
    teal: { bg: 'bg-teal-light', text: 'text-teal', bar: 'bg-teal' },
    gold: { bg: 'bg-gold-light', text: 'text-gold', bar: 'bg-gold' },
  };
  const c = colors[color];
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 ${c.bg} rounded-lg flex items-center justify-center ${c.text}`}>
          {icon}
        </div>
        <span className="text-sm text-warm-gray">{label}</span>
      </div>
      <p className={`font-mono font-bold text-2xl ${c.text}`}>
        {value}
        <span className="text-sm text-warm-gray ml-1">{unit}</span>
      </p>
      <div className="mt-3 h-2 bg-sand rounded-full overflow-hidden">
        <div
          className={`h-full ${c.bar} rounded-full transition-all duration-slow`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

// Macro Average Component
const MacroAvg = ({ label, value, unit, color }) => {
  const colors = {
    coral: 'text-coral',
    teal: 'text-teal',
    gold: 'text-gold',
  };

  return (
    <div className="text-center">
      <p className="text-sm text-warm-gray mb-1">{label}</p>
      <p className={`font-mono font-bold text-2xl ${colors[color]}`}>
        {value}
        <span className="text-sm text-warm-gray ml-1">{unit}</span>
      </p>
    </div>
  );
};

// Simple Bar Chart Component
const SimpleBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-warm-gray">
        No data yet. Start tracking your meals!
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.calories), 1);

  return (
    <div className="h-full flex items-end justify-between gap-2 px-2">
      {data.map((day, index) => {
        const height = (day.calories / maxValue) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-xs text-warm-gray font-mono">
              {day.calories > 0 ? day.calories : '-'}
            </span>
            <div className="w-full bg-sand rounded-t-lg overflow-hidden" style={{ height: '180px' }}>
              <div
                className="w-full bg-gradient-to-t from-coral to-orange-400 rounded-t-lg transition-all duration-slow"
                style={{ height: `${height}%`, marginTop: `${100 - height}%` }}
              />
            </div>
            <span className="text-xs text-charcoal font-medium">
              {day.dayName}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Icons
const FlameIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const ProteinIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const CarbsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const FatIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const FireIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
  </svg>
);

const MealsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const AvgIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default Stats;
