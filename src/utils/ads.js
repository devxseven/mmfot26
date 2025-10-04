// src/utils/ads.js
export const showAd = (adUnit, options = {}) => {
  if (window.Sonar) {
    return window.Sonar.show({
      adUnit,
      onClose: options.onClose,
      onReward: options.onReward,
    }).then((showResult) => {
      if (showResult?.status === 'error') {
        if (options.fallback) options.fallback();
      }
    }).catch(() => {
      if (options.fallback) options.fallback();
    });
  } else {
    if (options.fallback) options.fallback();
  }
};

export const showInterstitialAd = (onClose, fallback) => {
  showAd('intmmfot', {
    onClose,
    fallback: () => {
      window.open('https://www.profitableratecpm.com/ewdrwi8p?key=c3f8195dd58a3e2c408fed211cc8ddee', '_blank');
      if (fallback) fallback();
    }
  });
};

export const showRewardedAd = (onClose, onReward, fallback) => {
  showAd('rwmmfot', {
    onClose,
    onReward,
    fallback: () => {
      window.open('https://www.profitableratecpm.com/ewdrwi8p?key=c3f8195dd58a3e2c408fed211cc8ddee', '_blank');
      if (fallback) fallback();
    }
  });
};