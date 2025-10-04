// src/App.js (updated with lazy loading)
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Lazy load all page components
const HomePage = React.lazy(() => import('./pages/HomePage'));
const PlayerPage = React.lazy(() => import('./pages/PlayerPage'));
const ChannelPlayerPage = React.lazy(() => import('./pages/ChannelPlayerPage'));
const GamePage = React.lazy(() => import('./pages/GamePage'));

// Loading component
const LoadingFallback = () => (
  <div className="loading-container min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-color)' }}>
    <img
      src="/src/assets/react.svg"
      alt="Loading..."
      className="w-20 h-20 animate-pulse"
      style={{ animationDuration: '3s' }}
    />
  </div>
);

function App() {
  return (
    <div className="App">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/player" element={<PlayerPage />} />
          <Route path="/ch-player" element={<ChannelPlayerPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;