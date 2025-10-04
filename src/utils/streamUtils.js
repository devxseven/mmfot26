// src/utils/streamUtils.js
import CryptoJS from 'crypto-js';

export const generateAuthKey = () => {
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

export const generateStreamUrl = (url, name, authKey) => {
    let streamUrl = '';
    const isAppleDevice = /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent) ||
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

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

export const detectAppleDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) return false;
    if (/iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return false;
    return true;
};