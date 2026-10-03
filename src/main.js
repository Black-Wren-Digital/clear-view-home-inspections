import './main.css';
import { initMenu } from './js/menu.js';
import { initVideo } from './js/video.js';

initMenu();
initVideo();

for (const el of document.querySelectorAll('[data-year]')) {
  el.textContent = String(new Date().getFullYear());
}
