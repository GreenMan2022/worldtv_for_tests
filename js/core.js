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

// Импортируем конфигурации
import { firebaseConfig, categoryTree } from '../config/playlists.js';
import { translations } from '../config/translations.js';

// Экспортируем их
export { firebaseConfig, categoryTree, translations };

// Глобальное состояние
export let currentLanguage = localStorage.getItem('appLanguage') || 'ru';
export let currentMainCategory = localStorage.getItem('homeMainCategory') || 'Главная';
export let currentSubcategory = '';
export let checkChannelsOnLoad = localStorage.getItem('checkChannelsOnLoad') === 'true';
export let loadedPlaylists = {};
export let navigationState = 'channels';
export let currentWatchedChannel = null;
export let watchStartTime = null;

// Главная: пользовательские ленты
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
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js';
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// Функция перевода
export function translateText(key) {
  return translations[currentLanguage][key] || key;
}

// Добавьте эту функцию (она используется в других файлах)
export function loadAndRenderChannels(mainCategory, subCategory) {
  console.log('Loading channels for:', mainCategory, subCategory);
  // Здесь будет ваша логика загрузки каналов
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Скрываем лоадер
  if (initialLoader) {
    initialLoader.style.display = 'none';
  }
  
  // Инициализируем компоненты
  if (typeof window.renderMainCategories === 'function') {
    window.renderMainCategories();
  }
  if (typeof window.renderSubCategories === 'function') {
    window.renderSubCategories(currentMainCategory);
  }
});
