// loader.js

import { database } from '../core.js';
import { filterBlacklistedChannels } from '../utils/blacklist.js';
import { showToast } from '../utils/toast.js';
import { translateText } from '../utils/helpers.js';

export async function fetchM3U(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.text();
}

export function parseM3UContent(content, assignedCategory) {
  const channels = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#EXTINF:')) {
      const infoLine = lines[i];
      const urlLine = lines[i + 1];
      if (urlLine && !urlLine.startsWith('#')) {
        let name = infoLine.split(',')[1] || 'Канал';
        name = name.trim();
        const logoMatch = infoLine.match(/tvg-logo="([^"]*)"/);
        const logo = logoMatch ? logoMatch[1] : '';
        let group = assignedCategory;
        const groupMatch = infoLine.match(/tvg-group-title="([^"]*)"/);
        if (groupMatch && groupMatch[1]) {
          group = groupMatch[1].trim();
        }
        channels.push({ name, url: urlLine.trim(), group, logo });
      }
    }
  }
  return filterBlacklistedChannels(channels);
}

export function checkChannelAvailability(url) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    let manifestLoaded = false;
    let errorOccurred = false;
    const timeoutId = setTimeout(() => {
      if (!manifestLoaded && !errorOccurred) {
        cleanup();
        resolve(false);
      }
    }, 5000);
    function cleanup() {
      clearTimeout(timeoutId);
      video.src = '';
      video.load();
    }
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        manifestLoaded = true;
        cleanup();
        resolve(true);
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          errorOccurred = true;
          cleanup();
          resolve(false);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        manifestLoaded = true;
        cleanup();
        resolve(true);
      });
      video.addEventListener('error', () => {
        errorOccurred = true;
        cleanup();
        resolve(false);
      });
    } else {
      cleanup();
      resolve(false);
    }
    video.play().catch(() => {});
  });
}
