// src/components/Player/VideoPlayerButtons.jsx
import React from 'react';
import { generateStreamUrl } from '../../utils/streamUtils';
import { showRewardedPopupAd } from '../../utils/ads';

const VideoPlayerButtons = ({ streams, selectedStream, onStreamSelect, authKey }) => {

  const handleStreamClick = (stream) => {
    const streamUrl = generateStreamUrl(stream.url, stream.name, authKey);
    if (Math.random() < 0.4) {
      showRewardedPopupAd(
        () => {
          onStreamSelect(stream, streamUrl);
        },
        () => {
          onStreamSelect(stream, streamUrl);
        }
      );
    } else {
      onStreamSelect(stream, streamUrl);
    }
  };

  if (!streams || streams.length === 0) {
    return null;
  }

  return (
    <div id="player-buttons" className="my-2 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 justify-items-center px-2">
      {streams.map((stream, index) => (
        <div
          key={index}
          className={`custom-card card shadow-lg rounded-lg w-full max-w-[200px] text-xs md:text-base font-bold flex items-center justify-center py-4 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out ${selectedStream?.name === stream.name ? 'selected' : ''
            }`}
          onClick={() => handleStreamClick(stream)}
        >
          <strong>{stream.name}</strong>
        </div>
      ))}
    </div>
  );
};

export default VideoPlayerButtons;