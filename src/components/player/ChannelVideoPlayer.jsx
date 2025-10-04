// src/components/Player/ChannelVideoPlayer.jsx
import React, { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import flvjs from 'flv.js';

const ChannelVideoPlayer = ({ streamUrl, isFullscreen, tg }) => {
  const artRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!artRef.current || !streamUrl) return;

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
              if (!isFullscreen) {
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
      if (!artPlayer) return;

      const controlsLeft = artPlayer.querySelector('.art-video-player.art-mobile .art-controls-left');
      const videoLeft = artPlayer.querySelector('.art-video-player.art-mobile .art-video');

      (async () => {
        try {
          if (!isFullscreen && !state) {
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
          if (controlsLeft) {
            controlsLeft.style.paddingLeft = `calc(var(--tg-safe-area-inset-top, 0px) + var(--tg-content-safe-area-inset-top, 0px) + 15px)`;
          }
        } else {
          if (videoLeft) {
            videoLeft.style.left = '0';
          }
          if (controlsLeft) {
            controlsLeft.style.paddingLeft = '0';
          }
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

    // Set fullscreen on mount if needed
    if (isFullscreen && tg) {
      tg.requestFullscreen();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [streamUrl, isFullscreen, tg]);

  return <div ref={artRef} className="art-player"></div>;
};

export default ChannelVideoPlayer;