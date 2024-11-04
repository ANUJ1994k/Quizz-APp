import React from 'react';

const Leaderboard = () => {
  const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {leaderboardData
          .sort((a, b) => b.score - a.score)
          .map((entry, index) => (
            <li key={index}>
              {entry.name} - {entry.score} points
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
