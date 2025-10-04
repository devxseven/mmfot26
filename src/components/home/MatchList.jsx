// src/components/Home/MatchList.jsx
import React from 'react';
import MatchCard from '../match/MatchCard';

const MatchList = ({ matches, loading, onMatchClick }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="skeleton-card grid grid-cols-11 gap-2 w-full mt-2 shadow-xl items-center">
            <div className="col-span-4 flex flex-col items-center home-name">
              <div className="skeleton-square"></div>
              <div className="skeleton-line"></div>
            </div>
            <div className="col-span-3 flex flex-col items-center match-date match-time">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
            <div className="col-span-4 flex flex-col items-center away-name">
              <div className="skeleton-square"></div>
              <div className="skeleton-line"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return <p className="text-center text-gray-600">No upcoming matches found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {matches.map(match => (
        <MatchCard key={match.id} match={match} onClick={onMatchClick} />
      ))}
    </div>
  );
};

export default MatchList;