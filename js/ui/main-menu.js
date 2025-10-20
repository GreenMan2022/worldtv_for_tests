// main-menu.js

import { mainCategoriesPanel } from '../core.js';
import { categoryTree } from '../config/playlists.js';
import { translateText } from '../utils/helpers.js';
import { setLanguage, toggleChannelCheck } from './sub-menu.js'; // или вынесите в отдельный файл

export function renderMainCategories() {
  mainCategoriesPanel.innerHTML = '';
  const mainCategories = Object.keys(categoryTree);
  mainCategories.forEach((cat, index) => {
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.textContent = translateText(cat);
    if (cat === currentMainCategory) {
      btn.classList.add('active');
      currentMainCategoryIndex = index;
    }
    btn.addEventListener('click', () => selectMainCategory(cat, index));
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
    mainCategoriesPanel.appendChild(btn);
  });
  // ... флаги и кнопки (как в вашем коде)
}

// selectMainCategory и другие функции — аналогично вашему коду
// (можно вынести в отдельный файл logic.js позже)

window.renderMainCategories = renderMainCategories;
