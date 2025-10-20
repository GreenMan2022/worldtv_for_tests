// renderer.js

import { channelsContainer } from '../core.js';
import { createMiniPlayer, initializeMiniPlayer, stopAllMiniPlayers } from './player.js';
import { getGroupIcon } from '../utils/helpers.js';
import { translateText } from '../utils/helpers.js';

export function renderChannels(channelsToRender) {
  channelsContainer.innerHTML = '';
  if (channelsToRender.length === 0) {
    channelsContainer.innerHTML = `<div style="color:#aaa; padding:40px; text-align:center">${translateText("Каналы не найдены")}</div>`;
    return;
  }
  channelsToRender.forEach((channel, index) => {
    const groupIcon = getGroupIcon(channel.group);
    const channelCard = document.createElement('div');
    channelCard.className = 'channel-card';
    channelCard.setAttribute('tabindex', '0');
    channelCard.dataset.index = index;

    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'channel-media';
    if (channel.logo) {
      const img = document.createElement('img');
      img.src = channel.logo;
      img.alt = channel.name;
      img.onerror = () => { img.style.display = 'none'; };
      mediaContainer.appendChild(img);
    }
    const icon = document.createElement('i');
    icon.className = `fas ${groupIcon}`;
    mediaContainer.appendChild(icon);
    const miniPlayer = createMiniPlayer(channel.url);
    mediaContainer.appendChild(miniPlayer);

    let viewsText = '';
    if (channel.views) viewsText = ` 👥 ${channel.views}`;
    if (channel.lastWatched) {
      const now = Date.now();
      if (now - channel.lastWatched < 600000) viewsText += ` ⚡`;
    }

    const infoContainer = document.createElement('div');
    infoContainer.className = 'channel-info';
    infoContainer.innerHTML = `<h3>${channel.name}${viewsText}</h3><p>${channel.group}</p>`;

    channelCard.appendChild(mediaContainer);
    channelCard.appendChild(infoContainer);

    channelCard.addEventListener('focus', function() {
      // логика фокуса (мини-плеер)
    });
    channelCard.addEventListener('blur', function() {
      // логика blur
    });
    channelCard.addEventListener('click', () => {
      stopAllMiniPlayers();
      // openFullScreenPlayer(...)
    });
    channelCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        stopAllMiniPlayers();
        // openFullScreenPlayer(...)
      }
    });

    channelsContainer.appendChild(channelCard);
  });
}

export function createChannelCard(channel, isCompact = false) {
  const groupIcon = getGroupIcon(channel.group);
  const channelCard = document.createElement('div');
  channelCard.className = 'channel-card';
  channelCard.style.width = isCompact ? '180px' : '260px';
  channelCard.setAttribute('tabindex', '0');

  const mediaContainer = document.createElement('div');
  mediaContainer.className = 'channel-media';
  if (channel.logo) {
    const img = document.createElement('img');
    img.src = channel.logo;
    img.alt = channel.name;
    img.onerror = () => { img.style.display = 'none'; };
    mediaContainer.appendChild(img);
  }
  const icon = document.createElement('i');
  icon.className = `fas ${groupIcon}`;
  mediaContainer.appendChild(icon);

  const infoContainer = document.createElement('div');
  infoContainer.className = 'channel-info';
  infoContainer.innerHTML = `<h3>${channel.name}</h3><p>${channel.group}</p>`;

  channelCard.appendChild(mediaContainer);
  channelCard.appendChild(infoContainer);

  channelCard.addEventListener('click', () => {
    // openFullScreenPlayer(...)
  });
  channelCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // openFullScreenPlayer(...)
    }
  });

  return channelCard;
}
