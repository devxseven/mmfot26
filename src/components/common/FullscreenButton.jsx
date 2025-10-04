// src/components/Common/FullscreenButton.jsx
import React from 'react';

const FullscreenButton = ({ isFullscreen, toggleFullscreen }) => {
  return (
    <button
      onClick={toggleFullscreen}
      className="btn text-sm md:text-base px-4 py-2 rounded-lg shadow-lg button h-auto min-h-[44px] no-hover flex items-center gap-2"
    >
      {isFullscreen ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current" viewBox="0 -960 960 960" fill="var(--tg-theme-text-color, #212121)">
            <path d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z"/>
          </svg>
          Exit Fullscreen
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current" viewBox="0 -960 960 960" fill="var(--tg-theme-text-color, #212121)">
            <path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"/>
          </svg>
          Change Fullscreen
        </>
      )}
    </button>
  );
};

export default FullscreenButton;