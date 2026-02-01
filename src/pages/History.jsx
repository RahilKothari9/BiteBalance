import React, { useState, useEffect } from 'react';
import { UserAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

export default function History() {
  const { user } = UserAuth();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}entries/${user.uid}?limit=100`
      );
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (err) {
      console.error('Error fetching entries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (entryId) => {
    setDeletingId(entryId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}calories/${user.uid}/entry/${entryId}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        setEntries(entries.filter(e => e.id !== entryId));
      }
    } catch (err) {
      console.error('Error deleting entry:', err);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  // Get unique dates for filter
  const uniqueDates = [...new Set(entries.map(e => e.date))].sort().reverse();

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    if (selectedDate !== 'all' && entry.date !== selectedDate) return false;
    if (selectedMealType !== 'all' && entry.mealType !== selectedMealType) return false;
    return true;
  });

  // Group entries by date
  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {});

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const getMealTypeIcon = (mealType) => {
    switch (mealType) {
      case 'breakfast': return <SunIcon className="w-4 h-4" />;
      case 'lunch': return <SunHighIcon className="w-4 h-4" />;
      case 'dinner': return <MoonIcon className="w-4 h-4" />;
      default: return <SnackIcon className="w-4 h-4" />;
    }
  };

  const getMealTypeColor = (mealType) => {
    switch (mealType) {
      case 'breakfast': return 'bg-gold-light text-gold';
      case 'lunch': return 'bg-coral-light text-coral';
      case 'dinner': return 'bg-teal-light text-teal';
      default: return 'bg-sand text-warm-gray';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream pt-[72px]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-sand rounded w-48" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-sand rounded-xl" />
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
        <div className="blob blob-lg blob-teal absolute -top-40 -right-40 opacity-15 animate-float" />
        <div className="blob blob-lg blob-gold absolute bottom-0 -left-40 opacity-15 animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-in">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal mb-2">
            Meal History
          </h1>
          <p className="text-warm-gray">
            View and manage your logged meals
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6 animate-in" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Date Filter */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-warm-gray mb-2">Filter by Date</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-sand rounded-xl text-charcoal font-medium text-sm focus:outline-none focus:ring-2 focus:ring-coral/50 transition-all"
              >
                <option value="all">All Dates</option>
                {uniqueDates.map(date => (
                  <option key={date} value={date}>{formatDate(date)}</option>
                ))}
              </select>
            </div>

            {/* Meal Type Filter */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-warm-gray mb-2">Filter by Meal</label>
              <div className="flex gap-2">
                {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedMealType(type)}
                    className={`
                      flex-1 py-2.5 px-2 rounded-xl text-xs font-medium capitalize transition-all duration-fast
                      ${selectedMealType === type
                        ? 'bg-coral text-white shadow-glow-coral'
                        : 'bg-sand text-charcoal hover:bg-coral-light'
                      }
                    `}
                  >
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {filteredEntries.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 stagger-children">
            <SummaryCard
              label="Total Meals"
              value={filteredEntries.length}
              color="coral"
            />
            <SummaryCard
              label="Calories"
              value={filteredEntries.reduce((sum, e) => sum + (e.calories || 0), 0)}
              unit="kcal"
              color="teal"
            />
            <SummaryCard
              label="Protein"
              value={filteredEntries.reduce((sum, e) => sum + (e.protein || 0), 0)}
              unit="g"
              color="gold"
            />
            <SummaryCard
              label="Avg/Meal"
              value={Math.round(filteredEntries.reduce((sum, e) => sum + (e.calories || 0), 0) / filteredEntries.length)}
              unit="kcal"
              color="coral"
            />
          </div>
        )}

        {/* Entries List */}
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center animate-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-sand rounded-2xl flex items-center justify-center">
              <HistoryIcon className="w-8 h-8 text-warm-gray" />
            </div>
            <h3 className="font-display font-bold text-xl text-charcoal mb-2">No meals found</h3>
            <p className="text-warm-gray mb-6">
              {entries.length === 0
                ? 'Start tracking your meals to see them here!'
                : 'Try adjusting your filters to see more meals.'}
            </p>
            {entries.length === 0 && (
              <Button variant="primary" onClick={() => window.location.href = '/track'}>
                Track Your First Meal
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEntries)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([date, dateEntries], groupIndex) => (
                <div
                  key={date}
                  className="animate-in"
                  style={{ animationDelay: `${150 + groupIndex * 50}ms` }}
                >
                  {/* Date Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="font-display font-bold text-lg text-charcoal">
                      {formatDate(date)}
                    </h2>
                    <div className="flex-1 h-px bg-sand" />
                    <span className="text-sm text-warm-gray">
                      {dateEntries.reduce((sum, e) => sum + (e.calories || 0), 0)} kcal
                    </span>
                  </div>

                  {/* Entries */}
                  <div className="space-y-2">
                    {dateEntries.map((entry, entryIndex) => (
                      <div
                        key={entry.id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-fast group"
                        style={{ animationDelay: `${entryIndex * 30}ms` }}
                      >
                        <div className="p-4 flex items-center gap-4">
                          {/* Meal Type Badge */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getMealTypeColor(entry.mealType)}`}>
                            {getMealTypeIcon(entry.mealType)}
                          </div>

                          {/* Food Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-charcoal truncate">
                              {entry.foodName || 'Meal'}
                            </h3>
                            <p className="text-sm text-warm-gray capitalize">
                              {entry.mealType} {entry.createdAt && (
                                <span className="text-stone">
                                  at {new Date(entry.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                </span>
                              )}
                            </p>
                          </div>

                          {/* Nutrition Quick View */}
                          <div className="hidden sm:flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <p className="font-mono font-bold text-coral">{entry.calories || 0}</p>
                              <p className="text-xs text-warm-gray">kcal</p>
                            </div>
                            <div className="text-center">
                              <p className="font-mono font-bold text-teal">{entry.protein || 0}g</p>
                              <p className="text-xs text-warm-gray">protein</p>
                            </div>
                            <div className="text-center">
                              <p className="font-mono font-bold text-gold">{entry.carbs || 0}g</p>
                              <p className="text-xs text-warm-gray">carbs</p>
                            </div>
                          </div>

                          {/* Mobile Calories */}
                          <div className="sm:hidden text-right">
                            <p className="font-mono font-bold text-coral">{entry.calories || 0}</p>
                            <p className="text-xs text-warm-gray">kcal</p>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => setShowDeleteConfirm(entry.id)}
                            className="p-2 text-warm-gray hover:text-error hover:bg-error-light rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-fast"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Delete Confirmation */}
                        {showDeleteConfirm === entry.id && (
                          <div className="px-4 pb-4 pt-0 animate-in">
                            <div className="bg-error-light rounded-lg p-3 flex items-center justify-between">
                              <p className="text-sm text-error">Delete this entry?</p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setShowDeleteConfirm(null)}
                                  className="px-3 py-1.5 text-sm font-medium text-charcoal hover:bg-white rounded-lg transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleDelete(entry.id)}
                                  disabled={deletingId === entry.id}
                                  className="px-3 py-1.5 text-sm font-medium text-white bg-error hover:bg-error/90 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {deletingId === entry.id ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Summary Card Component
const SummaryCard = ({ label, value, unit, color }) => {
  const colors = {
    coral: 'bg-coral-light text-coral',
    teal: 'bg-teal-light text-teal',
    gold: 'bg-gold-light text-gold',
  };

  return (
    <div className={`${colors[color]} rounded-xl p-4 hover:scale-105 transition-transform duration-fast`}>
      <p className="text-xs font-medium opacity-70 mb-1">{label}</p>
      <p className="font-mono font-bold text-xl">
        {value.toLocaleString()}
        {unit && <span className="text-sm ml-1 opacity-70">{unit}</span>}
      </p>
    </div>
  );
};

// Icons
const SunIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const SunHighIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.95-4.95l-1.414 1.414M7.464 16.536l-1.414 1.414m10.486 0l-1.414-1.414M7.464 7.464L6.05 6.05M17 12a5 5 0 11-10 0 5 5 0 0110 0z" />
  </svg>
);

const MoonIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const SnackIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HistoryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
