// src/pages/HomePage.jsx (updated)
import React, { useState, useEffect } from 'react';
import NavBar from '../components/common/NavBar';
import MatchList from '../components/home/MatchList';
import ChannelList from '../components/channel/ChannelList';
import GameList from '../components/game/GameList';
import ReloadButton from '../components/common/ReloadButton';
import DarkModeButton from '../components/common/DarkModeButton';
//import useTelegram from '../hooks/useTelegram';
import { fetchMatches, fetchChannels, fetchGames } from '../utils/api';
import { showInterstitialAd, showRewardedAd } from '../utils/ads';

const HomePage = () => {
  //const { tg, isFullscreen } = useTelegram();
  const [activeTab, setActiveTab] = useState('home');
  const [matches, setMatches] = useState([]);
  const [channels, setChannels] = useState([]);
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [matchesData, channelsData, gamesData] = await Promise.all([
        fetchMatches(),
        fetchChannels(),
        fetchGames()
      ]);

      setMatches(matchesData);
      setChannels(channelsData);
      setGames(gamesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const reloadApp = () => {
    window.location.reload();
  };

  const filteredMatches = () => {
    const selectedLeagues = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'MLS',
      'UEFA Champions League', 'UEFA Europa League', 'UEFA Nations League', 'Saudi Pro League', 'UEFA Conference League',
      'Coppa Italia', 'FA Cup', 'Copa del Rey', 'AFC Champions League Elite', 'Concacaf Champions Cup',
      'World Cup qualification (AFC)', 'World Cup qualification (CONMEBOL)', 'World Cup qualification (UEFA)', 'AFC Asian Cup qualification',
      'World Cup qualification (CONCACAF)', 'AFC Asian Cup qualification', 'FIFA Club World Cup'];

    if (filter === 'hot') {
      return matches.filter(match => selectedLeagues.includes(match.league));
    } else if (filter === 'live') {
      return matches.filter(match => match.match_status);
    }
    return matches;
  };

  const handleMatchClick = (matchId) => {
    const navigateToPlayer = () => {
      window.location.href = `/player?id=${matchId}`;
    };

    if (Math.random() < 0.5) {
      showInterstitialAd(
        navigateToPlayer,
        navigateToPlayer
      );
    } else {
      // For rewarded ads, the onReward callback is also needed.
      showRewardedAd(navigateToPlayer, navigateToPlayer, navigateToPlayer);
    }
  };

  const handleChannelClick = (channel) => {
    showRewardedAd(
      () => {
        window.location.href = `/ch-player?url=${encodeURIComponent(channel.url)}`;
      },
      () => {
        window.location.href = `/ch-player?url=${encodeURIComponent(channel.url)}`;
      },
      () => {
        window.location.href = `/ch-player?url=${encodeURIComponent(channel.url)}`;
      }
    );
  };

  const handleGameClick = (game) => {
    showRewardedAd(
      () => {
        window.location.href = `/game?url=${encodeURIComponent(game.embed)}`;
      },
      () => {
        window.location.href = `/game?url=${encodeURIComponent(game.embed)}`;
      },
      () => {
        window.location.href = `/game?url=${encodeURIComponent(game.embed)}`;
      }
    );
  };

  return (
    <div className="home-page">
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <section className="main-section">
        <div className="flex gap-3 justify-center">
          <DarkModeButton />
          <ReloadButton reloadApp={reloadApp} />
        </div>
        {activeTab === 'home' && (
          <div className="tab-content">
            <h2 className="text-base md:text-lg font-bold mb-2">Football Schedule Fixtures</h2>
            <div className="relative inline-block w-3/4 md:w-96 mb-4">
              <select id="matchFilter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="select select-bordered w-full h-auto px-4 py-2.5 text-base md:text-lg font-bold rounded-lg shadow-sm"
              >
                <option value="all">All Matches</option>
                <option value="hot">Hot Matches</option>
                <option value="live">Live Matches</option>
              </select>
            </div>
            <MatchList
              matches={filteredMatches()}
              loading={loading}
              onMatchClick={handleMatchClick}
            />
          </div>
        )}

        {activeTab === 'channels' && (
          <div className="tab-content">
            <h2 className="text-base md:text-lg font-bold mb-2">TV Channels</h2>
            <ChannelList
              channels={channels}
              loading={loading}
              onChannelClick={handleChannelClick}
            />
          </div>
        )}

        {activeTab === 'games' && (
          <div className="tab-content">
            <h2 className="text-base md:text-lg font-bold mb-2">Sports Games</h2>
            <GameList
              games={games}
              loading={loading}
              onGameClick={handleGameClick}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;