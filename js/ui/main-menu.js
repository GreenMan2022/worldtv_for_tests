// main-menu.js
import { 
  mainCategoriesPanel, 
  categoryTree, 
  currentMainCategory,
  renderSubCategories,
  loadAndRenderChannels
} from './core.js';
import { translateText } from '../utils/helpers.js';

export let currentMainCategoryIndex = 0;

export function renderMainCategories() {
  if (!mainCategoriesPanel) return;
  
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
}

function selectMainCategory(category, index) {
  currentMainCategory = category;
  currentMainCategoryIndex = index;
  
  // Обновляем активную кнопку
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.category-btn')[index].classList.add('active');
  
  // Сохраняем в localStorage
  localStorage.setItem('homeMainCategory', category);
  
  // Показываем подкатегории
  if (typeof renderSubCategories === 'function') {
    renderSubCategories(category);
  }
  
  // Загружаем каналы
  if (typeof loadAndRenderChannels === 'function') {
    loadAndRenderChannels(category, '');
  }
}

window.renderMainCategories = renderMainCategories;
