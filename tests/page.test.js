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

describe('head', () => {
  const meta = (selector) => document.querySelector(selector)?.getAttribute('content');
  const description =
    'Clear View Home Inspections serves Central Indiana with residential and commercial home inspections, new construction and pre-drywall inspections, radon testing, and mold testing.';

  it('has the meta description', () => {
    expect(meta('meta[name="description"]')).toBe(description);
  });

  it('has Open Graph tags', () => {
    expect(meta('meta[property="og:type"]')).toBe('website');
    expect(meta('meta[property="og:title"]')).toBe(document.title);
    expect(meta('meta[property="og:description"]')).toBe(description);
    expect(meta('meta[property="og:image"]')).toBe('https://www.cvhi.us/og-image.jpg');
  });

  it('links the icons in public/', () => {
    const icon = document.querySelector('link[rel="icon"]').getAttribute('href');
    const touch = document.querySelector('link[rel="apple-touch-icon"]').getAttribute('href');
    expect(existsSync(resolve(root, 'public', icon.replace(/^\//, '')))).toBe(true);
    expect(existsSync(resolve(root, 'public', touch.replace(/^\//, '')))).toBe(true);
  });

  it('reserves space for the sticky header when it jumps to a section', () => {
    expect(document.documentElement.classList.contains('scroll-pt-20')).toBe(true);
  });
});

describe('header', () => {
  const navHrefs = ['#services', '#reports', '#reviews', '#faq', '#contact'];
  const navLabels = ['Services', 'Reports', 'Reviews', 'FAQ', 'Contact'];

  it('starts with a skip link to the main content', () => {
    const first = document.body.querySelector('a, button');
    expect(first.getAttribute('href')).toBe('#main');
    expect(text(first)).toBe('Skip to content');
    expect(document.querySelector('main#main')).not.toBeNull();
  });

  it('has the desktop nav links and the call button', () => {
    const links = [...document.querySelectorAll('nav[aria-label="Main"] a')];
    expect(links.slice(0, 5).map((a) => a.getAttribute('href'))).toEqual(navHrefs);
    expect(links.slice(0, 5).map(text)).toEqual(navLabels);
    expect(links[5].getAttribute('href')).toBe('tel:3175780890');
    expect(text(links[5])).toBe('Call (317) 578-0890');
  });

  it('has a mobile menu with the same links, closed by default', () => {
    const button = document.querySelector('[data-menu-button]');
    expect(button.getAttribute('aria-controls')).toBe('mobile-menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    const panel = document.getElementById('mobile-menu');
    expect(panel.hasAttribute('hidden')).toBe(true);
    expect([...panel.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual(navHrefs);
  });
});

describe('hero', () => {
  it('has exactly one h1 with the headline', () => {
    const h1s = document.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(text(h1s[0])).toBe('Protect your investment. Choose Clear View.');
  });

  it('has the two buttons', () => {
    const hero = document.getElementById('top');
    const links = [...hero.querySelectorAll('a')].map((a) => [text(a), a.getAttribute('href')]);
    expect(links).toEqual([
      ['Schedule an inspection', '#contact'],
      ['Our services', '#services'],
    ]);
  });
});

describe('trust bar', () => {
  it('lists the four facts', () => {
    const items = [...document.querySelectorAll('[aria-label="Why clients choose us"] li')].map(text);
    expect(items).toEqual([
      'Serving Central Indiana since 1999',
      'Licensed home inspectors',
      'Report within 24 hours',
      'Based in Fishers, Indiana',
    ]);
  });
});

describe('why clear view', () => {
  it('has the heading and the video button', () => {
    const section = document.getElementById('about');
    expect(text(section.querySelector('h2'))).toBe(
      "If you're buying a house, you need a home inspection.",
    );
    const video = section.querySelector('button[data-video-id]');
    expect(video.dataset.videoId).toBe('H6RSqJ-COWg');
    expect(video.getAttribute('aria-label')).toBe('Play video: Clear View Home Inspections');
  });

  it('sends no request to YouTube before a click', () => {
    expect(document.querySelector('iframe')).toBeNull();
  });
});

describe('images', () => {
  it('give each image alt text, a width, a height, and a file that exists', () => {
    for (const img of document.querySelectorAll('img')) {
      expect(img.hasAttribute('alt')).toBe(true);
      expect(Number(img.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(img.getAttribute('height'))).toBeGreaterThan(0);
      const sources = [img.getAttribute('src'), ...(img.getAttribute('srcset') ?? '').split(',')]
        .map((s) => s.trim().split(/\s+/)[0])
        .filter(Boolean);
      for (const src of sources) {
        expect(existsSync(resolve(root, src)), src).toBe(true);
      }
    }
  });
});
