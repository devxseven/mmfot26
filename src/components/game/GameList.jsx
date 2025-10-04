// src/components/Home/GameList.jsx
import React from 'react';

const GameList = ({ games, loading, onGameClick }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="skeleton-card h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return <p className="text-center text-gray-600">No games found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
      {games.map(game => (
        <div
          key={game.image}
          className="card shadow-xl game-card cursor-pointer"
          onClick={() => onGameClick(game)}
        >
          <img 
            src={game.image} 
            className="rounded-lg h-32 w-full object-cover" 
            loading="lazy" 
            alt={game.image}
            onError={(e) => { e.target.src = 'default-image.png'; }} 
          />
        </div>
      ))}
    </div>
  );
};

export default GameList;