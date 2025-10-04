// src/components/Home/MatchCard.jsx
import React from 'react';
import moment from 'moment-timezone';

const MatchCard = ({ match, onClick }) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const matchDateTime = moment.tz(match.match_time * 1000, userTimezone);
  const isLive = match.match_status;
  const formattedDate = matchDateTime.format('MMM D');
  const formattedTime = matchDateTime.format('hh:mm A');

  const handleClick = () => {
    if (match.id) {
      onClick(match.id);
    }
  };

  return (
    <div className="card shadow-xl p-1 flex flex-col items-center cursor-pointer" onClick={handleClick}>
      <h2 className="text-xs md:text-sm p-1 font-bold text-center league">{match.league || ''}</h2>
      <div className="grid grid-cols-11 gap-2 w-full text-center mt-2">
        <div className="col-span-4 flex flex-col items-center home-name">
          <img 
            src={match.home_img || ''} 
            alt="Home Team" 
            className="w-12 h-12 object-cover" 
            loading="lazy" 
            onError={(e) => { e.target.src = 'default-image.png'; }} 
          />
          <p className="text-[9px] md:text-[11px] pt-1 font-semibold">{match.home_name || ''}</p>
        </div>
        <div className="col-span-3 flex flex-col items-center match-date match-time">
          <p className="text-xs md:text-sm font-semibold">{formattedDate || ''}</p>
          <p className="text-xs md:text-sm font-bold">{formattedTime || ''}</p>
          {isLive && <p className="text-xs md:text-sm text-red-500 font-bold animate-pulse">⬤ LIVE</p>}
        </div>
        <div className="col-span-4 flex flex-col items-center away-name">
          <img 
            src={match.away_img || ''} 
            alt="Away Team" 
            className="w-12 h-12 object-cover" 
            loading="lazy" 
            onError={(e) => { e.target.src = 'default-image.png'; }} 
          />
          <p className="text-[9px] md:text-[11px] pt-1 font-semibold">{match.away_name || ''}</p>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;