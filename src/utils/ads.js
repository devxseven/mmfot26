// src/utils/ads.js
import createAdHandler from 'monetag-tg-sdk';

// Replace these with your actual Monetag zone IDs
const ZONE_ID = '10057039';
const adHandler = createAdHandler(ZONE_ID);

export const showRewardedInterstitialAd = (onClose, fallback) => {
  adHandler()
    .then(() => {
      if (onClose) onClose();
    })
    .catch(() => {
      if (fallback) {
        window.open('https://www.effectivegatecpm.com/gvq64qttqq?key=9eda1aa2f84634ef24faf5a2620856b7', '_blank');
        fallback();
      }
    });
};

export const showRewardedPopupAd = (onClose, fallback) => {
  adHandler({ type: 'pop' })
    .then(() => {
      if (onClose) onClose();
    })
    .catch(() => {
      if (fallback) {
        window.open('https://www.effectivegatecpm.com/gvq64qttqq?key=9eda1aa2f84634ef24faf5a2620856b7', '_blank');
        fallback();
      }
    });
};

