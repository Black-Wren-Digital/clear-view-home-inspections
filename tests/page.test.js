import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { describe, it, expect } from 'vitest';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const { document } = new JSDOM(html).window;

const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

describe('document', () => {
  it('is in English', () => {
    expect(document.documentElement.getAttribute('lang')).toBe('en');
  });

  it('loads the main script as a module', () => {
    const script = document.querySelector('script[type="module"]');
    expect(script.getAttribute('src')).toBe('/src/main.js');
  });

  it('has the site title', () => {
    expect(document.title).toBe(
      'Clear View Home Inspections | Fishers & Indianapolis Home Inspector',
    );
  });
});
