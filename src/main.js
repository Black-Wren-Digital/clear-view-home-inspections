import './main.css';
import { initMenu } from './js/menu.js';

initMenu();

for (const el of document.querySelectorAll('[data-year]')) {
  el.textContent = String(new Date().getFullYear());
}
