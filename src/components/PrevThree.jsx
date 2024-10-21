import React, { useState, useEffect } from 'react';

const PrevThree = ({ userId }) => {
  const [lastThreeDaysStats, setLastThreeDaysStats] = useState([]);

  useEffect(() => {
    const fetchLastThreeDays = async () => {
      try {
        const today = new Date();
        let statsArray = [];

        for (let i = 0; i < 3; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const formattedDate = date.toISOString().split('T')[0];

          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}calories/${userId}?date=${formattedDate}`);
          const data = await res.json();
          if (data) {
            statsArray.push({ date: formattedDate, ...data });
          }
        }
        setLastThreeDaysStats(statsArray);
      } catch (error) {
        console.error('Error fetching last three days stats:', error);
      }
    };

    fetchLastThreeDays();
  }, [userId]);

  if (!lastThreeDaysStats.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detailed-stats">
      <h2>Last 3 Days</h2>
      {lastThreeDaysStats.map((dayStats, idx) => (
        <div key={idx}>
          <h3>{dayStats.date}</h3>
          <ul>
            <li>Calories: {dayStats.totalCalories}</li>
            <li>Protein: {dayStats.totalProtein}g</li>
            <li>Carbs: {dayStats.totalCarbs}g</li>
            <li>Sugars: {dayStats.totalSugars}g</li>
            <li>Fats: {dayStats.totalFats}g</li>
            <li>Sodium: {dayStats.totalSodium}mg</li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PrevThree;
