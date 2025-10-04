// src/pages/PlayerPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import moment from 'moment-timezone';
import MatchDetail from '../components/match/MatchDetail';
import MatchPlayer from '../components/match/MatchPlayer';
import useTelegram from '../hooks/useTelegram';
import { fetchMatches } from '../utils/api';
import DarkModeButton from '../components/common/DarkModeButton';
import { generateAuthKey } from '../utils/streamUtils';
import ReloadButton from '../components/common/ReloadButton';
import Info from "../assets/info-reload.png";
import GamePlayer from '../components/player/GamePlayer';
import { FaTelegram } from "react-icons/fa";
import TelegramButton from '../components/common/TelegramButton';

const PlayerPage = () => {
  const [searchParams] = useSearchParams();
  const { tg } = useTelegram();
  const countdownIntervalRef = useRef(null);

  const matchId = searchParams.get('id');
  const isUrlFullscreen = searchParams.get('fullscreen') === 'true';

  const [match, setMatch] = useState(null);
  const [authKey, setAuthKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);

  // Initialize Telegram
  useEffect(() => {
    if (tg) {
      tg.BackButton.show();
      tg.BackButton.onClick(() => window.history.back());
    }

    return () => {
      if (tg) {
        tg.BackButton.hide();
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [tg]);

  // Generate auth key and load match
  const loadMatch = React.useCallback(async () => {
    try {
      setLoading(true);
      const matches = await fetchMatches();
      const foundMatch = matches.find(m => m.id === matchId);

      if (!foundMatch) {
        throw new Error('Match not found');
      }

      setMatch(foundMatch);

      // Check if match is live or should show countdown
      if (foundMatch.match_status) {
        setShowPlayer(true);
      } else {
        startCountdown(foundMatch);
      }
    } catch (error) {
      console.error('Error loading match:', error);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    setAuthKey(generateAuthKey());

    if (matchId) {
      loadMatch();
    }
  }, [matchId, loadMatch]);

  const startCountdown = (matchData) => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const matchDateTime = moment.tz(matchData.match_time * 1000, userTimezone);
    const now = moment.tz("Asia/Yangon");
    const showtime = 300000; // 5 minutes in milliseconds

    let distance = matchDateTime.diff(now);

    const updateCountdown = () => {
      distance -= 1000;

      if (distance <= showtime) {
        clearInterval(countdownIntervalRef.current);
        setShowPlayer(true);
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      setCountdown(formattedTime);
    };

    updateCountdown();
    countdownIntervalRef.current = setInterval(updateCountdown, 1000);
  };

  const reloadApp = () => {
    window.location.reload();
  };

  const openTelegramChannel = () => {
    if (tg) {
      tg.openTelegramLink('https://t.me/mmfottv');
    } else {
      window.open('https://t.me/mmfottv', '_blank');
    }
  };

  return (
    <div className="player-page">
      <section>
        {/* Always show these buttons */}
        <div className="flex gap-3 justify-center">
          <DarkModeButton />
          <TelegramButton openTelegramChannel={openTelegramChannel} />
          <ReloadButton reloadApp={reloadApp} />
        </div>

        <img id='match-info' src={Info} alt="Info" className="w-3/5 md:w-[400px] h-auto mx-auto" />

        {/* Show loading skeleton while loading */}
        {loading && (
          <div id="match-detail">
            <div className="skeleton-card grid grid-cols-11 gap-2 w-full mt-2 shadow-xl items-center">
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
          </div>
        )}

        {/* When loading is complete and match is found */}
        {!loading && match && (
          <>
            <MatchDetail match={match} isLive={showPlayer} />
            {showPlayer ? (
              <MatchPlayer
                match={match}
                authKey={authKey}
                isFullscreen={isUrlFullscreen}
                tg={tg}
              />
            ) : (
              <div className="prediction-section">
                <div className="timer-mm">
                  The match will start in <span id="countdown">{countdown}</span>
                </div>
                <GamePlayer match={match} />
              </div>
            )}
          </>
        )}

        {/* Show error message only when loading is complete and match is not found */}
        {!loading && !match && (
          <div className="text-center text-red-500 p-4">Match not found.</div>
        )}
      </section>
    </div>
  );
};

export default PlayerPage;