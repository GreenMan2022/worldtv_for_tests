// core.js — точка входа

// DOM элементы
export const channelsContainer = document.getElementById('channelsContainer');
export const mainCategoriesPanel = document.getElementById('mainCategoriesPanel');
export const subCategoriesPanel = document.getElementById('subCategoriesPanel');
export const playerModal = document.getElementById('playerModal');
export const videoPlayerElement = document.getElementById('videoPlayerElement');
export const closeModal = document.getElementById('closeModal');
export const initialLoader = document.getElementById('initialLoader');
export const toastContainer = document.getElementById('toastContainer');

// Глобальное состояние
export let currentLanguage = localStorage.getItem('appLanguage') || 'ru';
export let currentMainCategory = localStorage.getItem('homeMainCategory') || 'Главная';
export let currentSubcategory = '';
export let checkChannelsOnLoad = localStorage.getItem('checkChannelsOnLoad') === 'true';
export let loadedPlaylists = {};
export let navigationState = 'channels';
export let currentWatchedChannel = null;
export let watchStartTime = null;

// Главная: пользовательские ленты (с безопасным парсингом)
export let homeRows;
try {
  homeRows = JSON.parse(localStorage.getItem('homeRows')) || [
    { type: 'special', name: 'Просмотренные' },
    { type: 'special', name: 'Популярные' },
    { type: 'category', main: 'Категории', sub: 'Новости' },
    { type: 'category', main: 'Категории', sub: 'Музыка' },
    { type: 'category', main: 'Категории', sub: 'Кино' }
  ];
} catch (e) {
  console.warn('⚠️ Ошибка парсинга homeRows, используется значение по умолчанию');
  homeRows = [
    { type: 'special', name: 'Просмотренные' },
    { type: 'special', name: 'Популярные' },
    { type: 'category', main: 'Категории', sub: 'Новости' },
    { type: 'category', main: 'Категории', sub: 'Музыка' },
    { type: 'category', main: 'Категории', sub: 'Кино' }
  ];
}

// Firebase
import { firebaseConfig } from '../config/playlists.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js';
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// Переводы
import { translations } from '../config/translations.js';
export { translations };

// Функция перевода
export function translateText(key) {
  return translations[currentLanguage][key] || key;
}

// Импорт модулей
import './ui/main-menu.js';
import './ui/sub-menu.js';
import './ui/home-screen.js';
import './channels/loader.js';
import './channels/renderer.js';
import './channels/player.js';
import './utils/toast.js';
import './utils/blacklist.js';
import './utils/helpers.js';
import './navigation.js';

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  window.renderMainCategories();
  window.renderSubCategories();
  window.loadAndRenderChannels(currentMainCategory, currentSubcategory);
});
