// home-screen.js

import { channelsContainer, homeRows, categoryTree, loadedPlaylists, database } from '../core.js';
import { translateText } from '../utils/helpers.js';
import { showToast } from '../utils/toast.js';
import { fetchM3U, parseM3UContent } from '../channels/loader.js';
import { createChannelCard } from '../channels/renderer.js';

export function renderHomeScreen() {
  channelsContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();

  homeRows.forEach((row, idx) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'home-row';

    const titleWrapper = document.createElement('div');
    titleWrapper.style.display = 'flex';
    titleWrapper.style.alignItems = 'center';
    titleWrapper.style.justifyContent = 'space-between';
    titleWrapper.style.margin = '0 15px 10px';

    const title = document.createElement('h2');
    title.className = 'row-title';
    title.textContent = getRowTitle(row);
    title.style.margin = '0';
    title.style.color = '#fff';
    title.style.fontSize = '18px';

    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '⋯';
    removeBtn.style.background = 'none';
    removeBtn.style.border = 'none';
    removeBtn.style.color = '#ff375f';
    removeBtn.style.cursor = 'pointer';
    removeBtn.style.fontSize = '18px';
    removeBtn.style.padding = '4px';
    removeBtn.setAttribute('tabindex', '0');
    removeBtn.dataset.rowIndex = idx;

    let longPressTimer = null;
    const startLongPress = () => {
      longPressTimer = setTimeout(() => confirmRemoveRow(idx), 1000);
    };
    const cancelLongPress = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };

    removeBtn.addEventListener('mousedown', startLongPress);
    removeBtn.addEventListener('mouseleave', cancelLongPress);
    removeBtn.addEventListener('mouseup', cancelLongPress);

    let enterPressTimer = null;
    removeBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (enterPressTimer) {
          clearTimeout(enterPressTimer);
          enterPressTimer = null;
          confirmRemoveRow(idx);
        } else {
          enterPressTimer = setTimeout(() => { enterPressTimer = null; }, 1000);
        }
        e.preventDefault();
      }
    });
    removeBtn.addEventListener('keyup', () => {
      if (enterPressTimer) {
        clearTimeout(enterPressTimer);
        enterPressTimer = null;
      }
    });

    titleWrapper.appendChild(title);
    titleWrapper.appendChild(removeBtn);
    rowEl.appendChild(titleWrapper);

    const channelsWrapper = document.createElement('div');
    channelsWrapper.className = 'row-channels';
    rowEl.appendChild(channelsWrapper);
    fragment.appendChild(rowEl);

    loadRowChannels(row, channelsWrapper);
  });

  const addRow = document.createElement('div');
  addRow.className = 'home-row add-row';
  const addBtn = document.createElement('button');
  addBtn.className = 'add-row-btn';
  addBtn.innerHTML = '<i class="fas fa-plus"></i><br>Добавить ленту';
  addBtn.addEventListener('click', showCategoryPicker);
  addBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showCategoryPicker();
    }
  });
  addRow.appendChild(addBtn);
  fragment.appendChild(addRow);

  channelsContainer.appendChild(fragment);
}

function getRowTitle(row) {
  if (row.type === 'special') return translateText(row.name);
  if (row.type === 'category') return translateText(row.sub);
  return 'Неизвестно';
}

async function loadRowChannels(row, container) {
  let channels = [];
  if (row.type === 'special' && row.name === 'Просмотренные') {
    try {
      const raw = localStorage.getItem('watchedChannels');
      channels = raw ? JSON.parse(raw) : [];
    } catch (e) {
      channels = [];
    }
  } else if (row.type === 'special' && row.name === 'Популярные') {
    try {
      const snapshot = await database.ref('popular').get();
      if (snapshot.exists()) {
        channels = Object.values(snapshot.val()).sort((a, b) => b.views - a.views).slice(0, 20);
      }
    } catch (e) {
      channels = [];
    }
  } else if (row.type === 'category') {
    const url = categoryTree[row.main]?.[row.sub];
    if (url) {
      if (loadedPlaylists[url]) {
        channels = loadedPlaylists[url];
      } else {
        try {
          const content = await fetchM3U(url);
          channels = parseM3UContent(content, row.sub);
          loadedPlaylists[url] = channels;
        } catch (e) {
          channels = [];
        }
      }
    }
  }
  channels.slice(0, 10).forEach(channel => {
    const card = createChannelCard(channel, true);
    container.appendChild(card);
  });
}

function showCategoryPicker() {
  const picker = document.createElement('div');
  picker.id = 'categoryPicker';
  picker.style.position = 'fixed';
  picker.style.top = '0';
  picker.style.left = '0';
  picker.style.width = '100%';
  picker.style.height = '100%';
  picker.style.background = 'rgba(0,0,0,0.95)';
  picker.style.zIndex = '1500';
  picker.style.padding = '20px';
  picker.style.overflow = 'auto';
  picker.style.color = 'white';

  let html = '<h2 style="margin-bottom:20px;">Выберите ленту для добавления</h2>';
  html += '<h3>📺 Специальные</h3><div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px;">';
  ['Просмотренные', 'Популярные', 'Прямо сейчас'].forEach(name => {
    html += `<button class="picker-btn" data-type="special" data-name="${name}">${translateText(name)}</button>`;
  });
  html += '</div>';

  ['Категории', 'Страны', 'Языки', 'Регионы'].forEach(mainCat => {
    if (!categoryTree[mainCat]) return;
    html += `<h3>🗂 ${translateText(mainCat)}</h3><div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px;">`;
    Object.keys(categoryTree[mainCat]).forEach(sub => {
      html += `<button class="picker-btn" data-type="category" data-main="${mainCat}" data-sub="${sub}">${translateText(sub)}</button>`;
    });
    html += '</div>';
  });

  html += `<button id="pickerClose" style="margin-top:20px;background:#555;padding:10px;border:none;color:white;border-radius:6px;">Закрыть</button>`;
  picker.innerHTML = html;
  document.body.appendChild(picker);

  picker.querySelectorAll('.picker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      if (type === 'special') {
        homeRows.push({ type, name: btn.dataset.name });
      } else if (type === 'category') {
        homeRows.push({ type, main: btn.dataset.main, sub: btn.dataset.sub });
      }
      localStorage.setItem('homeRows', JSON.stringify(homeRows));
      renderHomeScreen();
      document.body.removeChild(picker);
    });
  });

  document.getElementById('pickerClose').addEventListener('click', () => {
    document.body.removeChild(picker);
  });
}

function confirmRemoveRow(index) {
  const confirmDiv = document.createElement('div');
  confirmDiv.style.position = 'fixed';
  confirmDiv.style.bottom = '20px';
  confirmDiv.style.left = '50%';
  confirmDiv.style.transform = 'translateX(-50%)';
  confirmDiv.style.background = 'rgba(0,0,0,0.9)';
  confirmDiv.style.color = 'white';
  confirmDiv.style.padding = '12px 20px';
  confirmDiv.style.borderRadius = '8px';
  confirmDiv.style.zIndex = '2001';
  confirmDiv.style.display = 'flex';
  confirmDiv.style.gap = '10px';
  confirmDiv.innerHTML = `
    <span>Удалить ленту?</span>
    <button id="confirmYes" style="color:#ff375f; background:none; border:none; cursor:pointer;">✅</button>
    <button id="confirmNo" style="color:#aaa; background:none; border:none; cursor:pointer;">❌</button>
  `;
  document.body.appendChild(confirmDiv);

  document.getElementById('confirmYes').onclick = () => {
    homeRows.splice(index, 1);
    localStorage.setItem('homeRows', JSON.stringify(homeRows));
    renderHomeScreen();
    document.body.removeChild(confirmDiv);
  };
  document.getElementById('confirmNo').onclick = () => {
    document.body.removeChild(confirmDiv);
  };

  setTimeout(() => {
    if (document.body.contains(confirmDiv)) {
      document.body.removeChild(confirmDiv);
    }
  }, 5000);
}

window.renderHomeScreen = renderHomeScreen;
