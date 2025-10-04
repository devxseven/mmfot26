import { useEffect, useState } from 'react';

const useTelegram = () => {
  const [tg, setTg] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setTg(tg);
      tg.ready();
      tg.expand();
      
      // Set up fullscreen event listeners
      tg.onEvent('fullscreenChanged', () => {
        setIsFullscreen(tg.isFullscreen);
      });
    }
  }, []);

  // const toggleFullscreen = () => {
  //   if (tg) {
  //     if (tg.isFullscreen) {
  //       tg.exitFullscreen();
  //     } else {
  //       tg.requestFullscreen();
  //     }
  //   }
  // };

  return { tg, isFullscreen };
};

export default useTelegram;