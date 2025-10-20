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

// Firebase - ИСПРАВЛЕННЫЙ ИМПОРТ
// Используем compat версию для обратной совместимости
import firebase from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js';
import 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js';

// Инициализация Firebase
const app = firebase.initializeApp(firebaseConfig);
export const database = firebase.database();

// Функция перевода
export function translateText(key) {
  return translations[currentLanguage][key] || key;
}

// Функция загрузки каналов (заглушка - нужно реализовать)
export function loadAndRenderChannels(mainCategory, subCategory) {
  console.log('Loading channels for:', mainCategory, subCategory);
  
  // Заглушка - отображаем сообщение
  if (channelsContainer) {
    channelsContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #aaa;">
        <i class="fas fa-tv" style="font-size: 48px; margin-bottom: 20px;"></i>
        <h3>${translateText('Загрузка...')}</h3>
        <p>${mainCategory} → ${subCategory || 'Все категории'}</p>
      </div>
    `;
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 TV App Initialized');
  
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
  
  // Закрытие модального окна
  if (closeModal && playerModal) {
    closeModal.addEventListener('click', () => {
      playerModal.style.display = 'none';
      if (videoPlayerElement) {
        videoPlayerElement.pause();
        videoPlayerElement.src = '';
      }
    });
  }
  
  // Закрытие по ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && playerModal && playerModal.style.display === 'flex') {
      playerModal.style.display = 'none';
      if (videoPlayerElement) {
        videoPlayerElement.pause();
        videoPlayerElement.src = '';
      }
    }
  });
});

// Экспортируем firebase для использования в других модулях
export { firebase };
