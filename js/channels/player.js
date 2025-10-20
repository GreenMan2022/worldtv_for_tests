// player.js

import { videoPlayerElement, playerModal, closeModal, currentWatchedChannel, watchStartTime, database } from '../core.js';
import { showToast } from '../utils/toast.js';
import { translateText } from '../utils/helpers.js';
import { addToBlacklist } from '../utils/blacklist.js';

let miniPlayers = new Map();

export function createMiniPlayer(url) {
  if (miniPlayers.has(url)) return miniPlayers.get(url);
  const container = document.createElement('div');
  container.className = 'mini-player';
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.loop = true;
  video.style.width = '100%';
  video.style.height = '100%';
  container.appendChild(video);
  miniPlayers.set(url, container);
  return container;
}

export function stopAllMiniPlayers() {
  miniPlayers.forEach((container) => {
    const video = container.querySelector('video');
    if (video) video.pause();
    container.style.display = 'none';
  });
}

export function openFullScreenPlayer(name, url, group, logo) {
  stopAllMiniPlayers();
  currentWatchedChannel = { name, url, group, logo };
  watchStartTime = Date.now();
  playerModal.style.display = 'flex';
  videoPlayerElement.src = '';
  videoPlayerElement.load();
  videoPlayerElement.muted = false;
  let manifestLoaded = false;
  const timeoutId = setTimeout(() => {
    if (!manifestLoaded) {
      console.warn("Таймаут полный экран:", url);
      showToast(translateText('Канал не отвечает'));
      addToBlacklist(url);
      playerModal.style.display = 'none';
    }
  }, 30000);
  if (Hls.isSupported()) {
    const hls = new Hls({
      liveDurationInfinity: true,
      enableWorker: true,
      lowLatencyMode: false,
      manifestLoadingTimeOut: 15000,
      levelLoadingTimeOut: 15000,
      fragLoadingTimeOut: 15000,
      fragLoadingMaxRetry: 6,
      levelLoadingMaxRetry: 4,
      manifestLoadingMaxRetry: 3
    });
    videoPlayerElement.hls = hls;
    hls.loadSource(url);
    hls.attachMedia(videoPlayerElement);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      clearTimeout(timeoutId);
      manifestLoaded = true;
      videoPlayerElement.play().catch(e => {
        console.log("Autoplay blocked:", e);
        showToast(translateText("Нажмите на видео для воспроизведения"));
      });
      setTimeout(() => requestNativeFullscreen(), 1000);
    });
    let errorCount = 0;
    hls.on(Hls.Events.ERROR, (event, data) => {
      console.warn('HLS Error:', data.type, data.details, data.fatal);
      if (data.fatal) {
        errorCount++;
        if (errorCount >= 2) {
          clearTimeout(timeoutId);
          showToast(translateText('Канал недоступен'));
          addToBlacklist(url);
          playerModal.style.display = 'none';
          if (videoPlayerElement.hls) {
            videoPlayerElement.hls.destroy();
            delete videoPlayerElement.hls;
          }
        } else {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          }
        }
      }
    });
  } else if (videoPlayerElement.canPlayType('application/vnd.apple.mpegurl')) {
    videoPlayerElement.src = url;
    videoPlayerElement.addEventListener('loadedmetadata', () => {
      clearTimeout(timeoutId);
      manifestLoaded = true;
      videoPlayerElement.play().catch(e => {
        console.log("Autoplay blocked:", e);
        showToast(translateText("Нажмите на видео для воспроизведения"));
      });
      setTimeout(() => requestNativeFullscreen(), 1000);
    });
    videoPlayerElement.addEventListener('error', () => {
      clearTimeout(timeoutId);
      showToast(translateText('Канал недоступен'));
      addToBlacklist(url);
      playerModal.style.display = 'none';
    });
  } else {
    clearTimeout(timeoutId);
    showToast(translateText('Формат не поддерживается'));
    playerModal.style.display = 'none';
  }
}

// Fullscreen API
function requestNativeFullscreen() {
  const elem = videoPlayerElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(err => console.log("Fullscreen:", err));
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen().catch(err => console.log("Fullscreen:", err));
  }
}
