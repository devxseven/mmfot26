// src/pages/GamePage.jsx
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useTelegram from '../hooks/useTelegram';

const GamePage = () => {
  const [searchParams] = useSearchParams();
  const { tg } = useTelegram();
  const gameUrl = searchParams.get('url');

  useEffect(() => {
    if (tg) {
      tg.BackButton.show();
      tg.BackButton.onClick(() => window.history.back());
    }

    return () => {
      if (tg) {
        tg.BackButton.hide();
      }
    };
  }, [tg]);

  if (!gameUrl) {
    return <p className="text-center text-red-500">No game URL provided.</p>;
  }

  return (
    <div className="game-page fixed inset-0 w-full h-full bg-black">
      <iframe 
        id="gameFrame" 
        src={decodeURIComponent(gameUrl)} 
        title="Game"
        className="w-full h-full border-0"
        allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default GamePage;