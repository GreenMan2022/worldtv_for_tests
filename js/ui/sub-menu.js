// sub-menu.js
import { 
  subCategoriesPanel, 
  currentSubcategory, 
  categoryTree,
  translateText,
  loadAndRenderChannels
} from './core.js';

export let currentSubcategory = '';

export function renderSubCategories(mainCategory = null) {
  if (!subCategoriesPanel) return;
  
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
      currentSubcategory = sub;
      updateSubCategoryButtons();
      loadAndRenderChannels(mainCategory, sub);
    });
    
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
    
    subCategoriesPanel.appendChild(btn);
  });
}

function updateSubCategoryButtons() {
  document.querySelectorAll('.subcategory-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent === translateText(currentSubcategory)) {
      btn.classList.add('active');
    }
  });
}

window.renderSubCategories = renderSubCategories;
