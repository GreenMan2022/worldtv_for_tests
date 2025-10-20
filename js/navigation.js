// navigation.js
import { navigationState, renderHomeScreen } from './core.js';

export function handleNavigation() {
  // Логика навигации между экранами
  console.log('Navigation handler initialized');
}

export function navigateTo(state) {
  navigationState = state;
  
  switch(state) {
    case 'home':
      renderHomeScreen();
      break;
    case 'channels':
      // Логика отображения каналов
      break;
    default:
      break;
  }
}

window.handleNavigation = handleNavigation;
