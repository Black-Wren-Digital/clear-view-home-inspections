import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initMenu } from '../src/js/menu.js';

let cleanup;

beforeEach(() => {
  document.body.innerHTML = `
    <a href="#elsewhere" id="elsewhere">Elsewhere</a>
    <button type="button" data-menu-button aria-controls="mobile-menu" aria-expanded="false">Menu</button>
    <nav id="mobile-menu" hidden>
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
    </nav>`;
  cleanup = initMenu();
});

afterEach(() => cleanup());

const button = () => document.querySelector('[data-menu-button]');
const panel = () => document.getElementById('mobile-menu');
const pressEscape = () =>
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

describe('initMenu', () => {
  it('opens the menu on a click', () => {
    button().click();
    expect(button().getAttribute('aria-expanded')).toBe('true');
    expect(panel().hidden).toBe(false);
  });

  it('closes the menu on a second click', () => {
    button().click();
    button().click();
    expect(button().getAttribute('aria-expanded')).toBe('false');
    expect(panel().hidden).toBe(true);
  });

  it('closes the menu when a link in it is clicked', () => {
    button().click();
    panel().querySelector('a').click();
    expect(button().getAttribute('aria-expanded')).toBe('false');
    expect(panel().hidden).toBe(true);
  });

  it('closes the menu on Escape and moves focus to the button', () => {
    button().click();
    panel().querySelector('a').focus();
    pressEscape();
    expect(panel().hidden).toBe(true);
    expect(document.activeElement).toBe(button());
  });

  it('does not move focus on Escape when the menu is closed', () => {
    const link = document.getElementById('elsewhere');
    link.focus();
    pressEscape();
    expect(document.activeElement).toBe(link);
  });

  it('removes its listeners on cleanup', () => {
    cleanup();
    button().click();
    expect(panel().hidden).toBe(true);
  });

  it('does nothing when the page has no menu button', () => {
    document.body.innerHTML = '<p>No menu</p>';
    expect(() => initMenu()()).not.toThrow();
  });
});
