// src/pages/ChannelPlayerPage.jsx
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
//import Artplayer from 'artplayer';
//import Hls from 'hls.js';
//import flvjs from 'flv.js';
import useTelegram from '../hooks/useTelegram';
import ChannelVideoPlayer from '../components/player/ChannelVideoPlayer';

const ChannelPlayerPage = () => {
  const [searchParams] = useSearchParams();
  const { tg } = useTelegram();
  //const artRef = useRef(null);
  //const playerRef = useRef(null);
  const videoUrl = searchParams.get('url') || 'https://pplive.comquas.com:5443/LiveApp/streams/rHEBIW7pjQLU1677679374164.m3u8';
  const isFullscreen = searchParams.get('fullscreen') === 'true';

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

  if (!videoUrl) {
    return <div className="text-center text-red-500">No video URL provided.</div>;
  }

  return (
    <div className="channel-player-page">
      {videoUrl && (
        <ChannelVideoPlayer
          streamUrl={videoUrl}
          isFullscreen={isFullscreen}
          tg={tg}
        />
      )}
    </div>
  );
};

export default ChannelPlayerPage;