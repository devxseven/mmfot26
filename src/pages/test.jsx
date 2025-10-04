// src/pages/PlayerPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import flvjs from 'flv.js';
import CryptoJS from 'crypto-js';
import moment from 'moment-timezone';
import MatchDetail from '../components/match/MatchDetail';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import useTelegram from '../hooks/useTelegram';
import { fetchMatches } from '../utils/api';

const PlayerPage = () => {
  const [searchParams] = useSearchParams();
  const { tg } = useTelegram();
  const artRef = useRef(null);
  const playerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  
  const matchId = searchParams.get('id');
  const isUrlFullscreen = searchParams.get('fullscreen') === 'true';
  
  const [match, setMatch] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null);
  const [authKey, setAuthKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);

  // Initialize Telegram
  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
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

  // Generate auth key
  useEffect(() => {
    setAuthKey(generateAuthKey());
  }, []);

  // Load match data
  useEffect(() => {
    loadMatch();
  }, [matchId]);

  const generateAuthKey = () => {
    const date = new Date();
    const options = { timeZone: 'Asia/Baku', hour12: false };
    const formatter = new Intl.DateTimeFormat('en-US', {
      ...options, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const parts = formatter.formatToParts(date);
    const dateTime = {};
    parts.forEach(({ type, value }) => dateTime[type] = value);
    const adenDate = new Date(`${dateTime.year}-${dateTime.month}-${dateTime.day}T${dateTime.hour}:${dateTime.minute}:${dateTime.second}+03:00`);
    const timestamp = Math.floor(adenDate.getTime() / 1000);
    const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    const constant = "0-0";
    const hash = CryptoJS.MD5(`${timestamp}${randomNumber}`).toString();
    return `${timestamp}-${constant}-${hash}`;
  };

  const loadMatch = async () => {
    try {
      setLoading(true);
      const matches = await fetchMatches();
      const foundMatch = matches.find(m => m.id === matchId);
      
      if (!foundMatch) {
        throw new Error('Match not found');
      }
      
      setMatch(foundMatch);
      
      // Set default stream
      if (foundMatch.links && foundMatch.links.length > 0) {
        const defaultStream = foundMatch.links.find(link => link.name === 'VN HD 1') || foundMatch.links[0];
        setSelectedStream(defaultStream);
      }

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
  };

  const startCountdown = (matchData) => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const matchDateTime = moment.tz(matchData.match_time * 1000, userTimezone);
    const now = moment.tz("Asia/Yangon");
    const showtime = 600000; // 10 minutes in milliseconds
    
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

    // Initial update
    updateCountdown();
    
    // Set up interval
    countdownIntervalRef.current = setInterval(updateCountdown, 1000);
  };

  const generateStreamUrl = (url, name) => {
    let streamUrl = '';
    const isAppleDevice = detectAppleDevice();

    if (url.includes('http')) {
      if (url.includes('pull.niur.live')) {
        streamUrl = isAppleDevice
          ? url.replace('.m3u8', '.flv')
          : url;
      } else {
        streamUrl = url;
      }
    } else if (name.includes('V HD')) {
      streamUrl = `https://pull.niues.live/live/stream-${url}_lhd.m3u8?auth_key=${authKey}`;
    } else if (name.includes('V SD')) {
      streamUrl = `https://pull.niues.live/live/stream-${url}_lsd.m3u8?auth_key=${authKey}`;
    } else if (name.includes('C HD')) {
      streamUrl = isAppleDevice
        ? `https://pull.dangaoka.com/live/stream-${url}_lhd.flv?auth_key=${authKey}`
        : `https://pull.dangaoka.com/live/stream-${url}_lhd.m3u8?auth_key=${authKey}`;
    } else if (name.includes('C SD')) {
      streamUrl = isAppleDevice
        ? `https://pull.dangaoka.com/live/stream-${url}_lsd.flv?auth_key=${authKey}`
        : `https://pull.dangaoka.com/live/stream-${url}_lsd.m3u8?auth_key=${authKey}`;
    } else {
      streamUrl = url;
    }
    
    return streamUrl;
  };

  const detectAppleDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) return false;
    if (/iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return false;
    return true;
  };

  const initializePlayer = (streamUrl) => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    if (!artRef.current) return;

    const art = new Artplayer({
      container: artRef.current,
      url: streamUrl,
      autoplay: true,
      isLive: true,
      fullscreenWeb: true,
      autoOrientation: true,
      layers: [{
        html: '<span style="color:yellow; font-weight: 700; font-size: smaller;">mmfot.com</span>',
        style: { position: 'absolute', top: '0px', right: '3px', opacity: '1' },
      }],
      controls: [{
        position: 'left',
        html: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFF"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>',
        index: 20,
        tooltip: 'Reload',
        click: function () {
          art.url = streamUrl;
        },
      }, {
        position: 'left',
        html: '<span class="dot" style="height: 6px; width: 6px; background-color: red; border-radius: 50%; display: inline-block; margin-right: 5px;"></span><span style="color:white; font-weight: 900; font-size: smaller;">Live</span>',
        index: 40,
      }, {
        position: 'right',
        html: `
          <i class="art-icon art-icon-fullscreenWebOnCus" style="display: inline-flex;">
            <svg class="icon" width="22" height="22" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path fill="#fff" d="M625.778 256H768v142.222h113.778v-256h-256V256zM256 398.222V256h142.222V142.222h-256v256H256zm512 227.556V768H625.778v113.778h256v-256H768zM398.222 768H256V625.778H142.222v256h256V768z"></path>
            </svg>
          </i>
          <i class="art-icon art-icon-fullscreenWebOffCus" style="display: none;">
            <svg class="icon" width="22" height="22" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path fill="#fff" d="M768 298.667h170.667V384h-256V128H768v170.667zM341.333 384h-256v-85.333H256V128h85.333v256zM768 725.333V896h-85.333V640h256v85.333H768zM341.333 640v256H256V725.333H85.333V640h256z"></path>
            </svg>
          </i>
        `,
        tooltip: 'Fullscreen',
        index: 100,
        click: async function () {
          const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
          try {
            if (tg) {
              if (!isUrlFullscreen) {
                if (!art.fullscreenWeb) {
                  await tg.requestFullscreen();
                  await delay(1000);
                  art.fullscreenWeb = !art.fullscreenWeb;
                } else {
                  tg.exitFullscreen();
                  art.fullscreenWeb = !art.fullscreenWeb;
                }
              } else {
                art.fullscreenWeb = !art.fullscreenWeb;
              }
            }
          } catch (err) {
            console.error('Error accessing fullscreen setting:', err);
            art.fullscreen = !art.fullscreen;
          }
        },
      }],
      customType: {
        m3u8: function (video, url, art) {
          if (Hls.isSupported()) {
            if (art.hls) art.hls.destroy();
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            art.hls = hls;
            art.on('destroy', () => hls.destroy());
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          } else {
            art.notice.show = 'Unsupported playback format: m3u8';
          }
        },
        flv: function (video, url, art) {
          if (flvjs.isSupported()) {
            if (art.flv) art.flv.destroy();
            const flv = flvjs.createPlayer({ type: 'flv', url });
            flv.attachMediaElement(video);
            flv.load();
            art.flv = flv;
            art.on('destroy', () => flv.destroy());
          } else {
            art.notice.show = 'Unsupported playback format: flv';
          }
        },
      },
    });

    // Fullscreen event handlers
    art.on('fullscreenWeb', (state) => {
      const artPlayer = artRef.current;
      const controlsLeft = artPlayer.querySelector('.art-video-player.art-mobile .art-controls-left');
      const videoLeft = artPlayer.querySelector('.art-video-player.art-mobile .art-video');

      (async () => {
        try {
          if (!isUrlFullscreen && !state) {
            tg.exitFullscreen();
          }
        } catch (err) {
          console.error('Error accessing fullscreen setting:', err);
        }

        if (state) {
          if (videoLeft) {
            videoLeft.style.position = 'absolute';
            videoLeft.style.left = `var(--tg-safe-area-inset-top, 0px)`;
          }
          controlsLeft.style.paddingLeft = `calc(var(--tg-safe-area-inset-top, 0px) + var(--tg-content-safe-area-inset-top, 0px) + 15px)`;
        } else {
          if (videoLeft) {
            videoLeft.style.left = '0';
          }
          controlsLeft.style.paddingLeft = '0';
        }
        
        const onIcon = document.querySelector('.art-icon-fullscreenWebOnCus');
        const offIcon = document.querySelector('.art-icon-fullscreenWebOffCus');
        if (onIcon && offIcon) {
          onIcon.style.display = state ? 'none' : 'inline-flex';
          offIcon.style.display = state ? 'inline-flex' : 'none';
        }
      })();
    });

    art.on('fullscreen', (state) => {
      const onIcon = document.querySelector('.art-icon-fullscreenWebOnCus');
      const offIcon = document.querySelector('.art-icon-fullscreenWebOffCus');
      if (onIcon && offIcon) {
        onIcon.style.display = state ? 'none' : 'inline-flex';
        offIcon.style.display = state ? 'inline-flex' : 'none';
      }
    });

    playerRef.current = art;

    // Update player height
    const updateHeight = () => {
      if (!artRef.current) return;
      const viewportHeight = tg ? (tg.viewportHeight || window.innerHeight) : window.innerHeight;
      const customHeight = viewportHeight * 0.4;
      artRef.current.style.height = `${customHeight}px`;
    };

    updateHeight();
    if (tg) {
      tg.onEvent('viewportChanged', updateHeight);
    }
    window.addEventListener('resize', updateHeight);
  };

  const handleStreamSelect = (stream) => {
    setSelectedStream(stream);
    const streamUrl = generateStreamUrl(stream.url, stream.name);
    initializePlayer(streamUrl);
  };

  const reloadApp = () => {
    window.location.reload();
  };

  if (loading) {
    return <LoadingSpinner type="player" />;
  }

  if (!match) {
    return (
      <div className="player-page">
        <div className="text-center text-red-500 p-4">Match not found.</div>
      </div>
    );
  }

  return (
    <div className="player-page">
      <section>
        <div className="flex gap-3 justify-center">
          <a href="javascript:Telegram.WebApp.openTelegramLink('https://t.me/mmfottv');">
            <button className="btn text-sm md:text-base px-4 py-2 rounded-lg shadow-lg button h-auto min-h-[44px] no-hover flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-telegram w-6 h-6 fill-current" viewBox="0 0 16 16" fill="var(--tg-theme-text-color, #212121)">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
              </svg>
              Join Telegram
            </button>
          </a>
          <button 
            onClick={reloadApp}
            className="btn text-sm md:text-base px-4 py-2 rounded-lg shadow-lg button h-auto min-h-[44px] no-hover flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current" viewBox="0 -960 960 960" fill="var(--tg-theme-text-color, #212121)">
              <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
            </svg>
            Reload
          </button>
        </div>

        <img src="/img/info-reload.png" alt="Info" className="w-3/5 md:w-[400px] h-auto mx-auto" />
        
        <MatchDetail match={match} isLive={showPlayer} />

        <div id="match-player">
          {showPlayer ? (
            <>
              <div ref={artRef} id="art-player" className="w-full bg-black my-4"></div>
              
              {match.links && match.links.length > 0 && (
                <div id="player-buttons" className="my-2 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 justify-items-center px-2">
                  {match.links.map((link, index) => (
                    <div
                      key={index}
                      className={`custom-card card shadow-lg rounded-lg w-full max-w-[200px] text-xs md:text-base font-bold flex items-center justify-center py-4 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out ${
                        selectedStream?.name === link.name ? 'selected' : ''
                      }`}
                      onClick={() => handleStreamSelect(link)}
                    >
                      <strong>{link.name}</strong>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="timer-mm">
              The match will start in <span id="countdown">{countdown}</span>.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PlayerPage;