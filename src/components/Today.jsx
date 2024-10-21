import React, { useState, useEffect } from 'react';

const Today = ({ userId }) => {
  const [todayStats, setTodayStats] = useState(null);

  useEffect(() => {
    const fetchTodayStats = async () => {
      const today = new Date().toISOString().split('T')[0]; // Get today's date
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}ycalories/${userId}?date=${today}`);
        const data = await res.json();
        setTodayStats(data);
      } catch (error) {
        console.error('Error fetching today\'s stats:', error);
      }
    };
    fetchTodayStats();
  }, [userId]);

  if (!todayStats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="stats-overview">
      <h2>Today's Stats</h2>
      <ul>
        <li>Calories: {todayStats.totalCalories}</li>
        <li>Protein: {todayStats.totalProtein}g</li>
        <li>Carbs: {todayStats.totalCarbs}g</li>
        <li>Sugars: {todayStats.totalSugars}g</li>
        <li>Fats: {todayStats.totalFats}g</li>
        <li>Sodium: {todayStats.totalSodium}mg</li>
      </ul>
    </div>
  );
};

export default Today;
