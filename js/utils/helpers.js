// helpers.js

import { translations } from '../config/translations.js';
import { currentLanguage } from '../core.js';

export function translateText(key) {
  return translations[currentLanguage][key] || key;
}

export function getGroupIcon(group) {
  group = group.toLowerCase();
  if (group.includes('новости')) return 'fa-newspaper';
  if (group.includes('спорт')) return 'fa-futbol';
  if (group.includes('кино')) return 'fa-film';
  if (group.includes('музыка')) return 'fa-music';
  if (group.includes('детск')) return 'fa-child';
  if (group.includes('документ')) return 'fa-video';
  if (group.includes('развлеч')) return 'fa-theater-masks';
  return 'fa-tv';
}

export function extractPlaylistName(url) {
  try {
    const decoded = decodeURIComponent(url);
    const parts = decoded.split('/');
    let name = parts[parts.length - 1].split('?')[0].split('#')[0];
    if (name.endsWith('.m3u') || name.endsWith('.m3u8')) {
      name = name.substring(0, name.lastIndexOf('.'));
    }
    return name || 'Custom Playlist';
  } catch (e) {
    return 'Custom Playlist';
  }
}
