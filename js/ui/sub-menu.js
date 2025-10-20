// sub-menu.js
import { subCategoriesPanel, currentSubcategory, categoryTree } from '../core.js';
import { translateText } from '../utils/helpers.js';

export function renderSubCategories(mainCategory = null) {
  subCategoriesPanel.innerHTML = '';
  
  if (!mainCategory || !categoryTree[mainCategory]) {
    subCategoriesPanel.style.display = 'none';
    return;
  }

  const subcategories = Object.keys(categoryTree[mainCategory]);
  
  if (subcategories.length === 0) {
    subCategoriesPanel.style.display = 'none';
    return;
  }

  subCategoriesPanel.style.display = 'flex';
  
  subcategories.forEach((sub, index) => {
    const btn = document.createElement('button');
    btn.className = 'subcategory-btn';
    btn.textContent = translateText(sub);
    
    if (sub === currentSubcategory) {
      btn.classList.add('active');
    }
    
    btn.addEventListener('click', () => {
      // Ваша логика выбора подкатегории
      currentSubcategory = sub;
      window.loadAndRenderChannels(mainCategory, sub);
      updateSubCategoryButtons();
    });
    
    subCategoriesPanel.appendChild(btn);
  });
}

function updateSubCategoryButtons() {
  document.querySelectorAll('.subcategory-btn').forEach(btn => {
    btn.classList.remove('active');
  });
}

window.renderSubCategories = renderSubCategories;
