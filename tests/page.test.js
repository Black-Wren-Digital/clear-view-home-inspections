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

  it('fills the first screen below the header at all widths', () => {
    const hero = document.getElementById('top').classList;
    expect(hero.contains('min-h-[calc(100svh-4rem-1px)]')).toBe(true);
    expect([...hero].some((c) => /^(sm|md|lg|xl):min-h-/.test(c))).toBe(false);
  });

  it('holds the trust cards below the buttons', () => {
    const hero = document.getElementById('top');
    const trust = hero.querySelector('ul[aria-label="Why clients choose us"]');
    expect(trust).not.toBeNull();
    const buttons = hero.querySelector('a[href="#contact"]');
    expect(buttons.compareDocumentPosition(trust) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
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

  it('stacks the facts in one column on phones', () => {
    const list = document.querySelector('ul[aria-label="Why clients choose us"]').classList;
    expect(list.contains('grid-cols-1')).toBe(true);
    expect(list.contains('grid-cols-2')).toBe(false);
    expect(list.contains('sm:grid-cols-2')).toBe(true);
    expect(list.contains('lg:flex')).toBe(true);
    expect(list.contains('lg:justify-between')).toBe(true);
  });

  it('shows the facts as light text on the photo, not as cards', () => {
    for (const item of document.querySelectorAll('ul[aria-label="Why clients choose us"] li')) {
      for (const card of ['bg-white', 'border', 'shadow-sm', 'rounded-xl']) {
        expect(item.classList.contains(card), card).toBe(false);
      }
      const [icon, label] = item.querySelectorAll(':scope > svg, :scope > span');
      expect(icon.tagName.toLowerCase()).toBe('svg');
      expect(label.classList.contains('text-white')).toBe(true);
    }
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

describe('page links', () => {
  it('points each in-page link at an element that exists', () => {
    for (const a of document.querySelectorAll('a[href^="#"]')) {
      const id = a.getAttribute('href').slice(1);
      expect(document.getElementById(id), a.getAttribute('href')).not.toBeNull();
    }
  });

  it('opens each external link in a new tab, safely', () => {
    for (const a of document.querySelectorAll('a[href^="http"]')) {
      expect(a.getAttribute('target'), a.href).toBe('_blank');
      expect(a.getAttribute('rel'), a.href).toBe('noopener noreferrer');
    }
  });

  it('uses one phone number and one email address', () => {
    for (const a of document.querySelectorAll('a[href^="tel:"]')) {
      expect(a.getAttribute('href')).toBe('tel:3175780890');
    }
    for (const a of document.querySelectorAll('a[href^="mailto:"]')) {
      expect(a.getAttribute('href')).toMatch(/^mailto:info@cvhi\.us(\?|$)/);
    }
  });

  it('gives each section with an id an h2, except the hero', () => {
    for (const section of document.querySelectorAll('main section[id]:not(#top)')) {
      expect(section.querySelector('h2'), section.id).not.toBeNull();
    }
  });
});

describe('services', () => {
  it('lists the eleven services in order', () => {
    const names = [...document.querySelectorAll('#services [data-service]')].map(text);
    expect(names).toEqual([
      'Full Home Inspections',
      'New Construction Inspections',
      'Pre-Drywall Inspections',
      'Foundation Inspections',
      'Commercial Inspections',
      'Termite Certification',
      'Radon Testing',
      'Mold Testing',
      'Air & Water Sampling',
      'Winterization & De-Winterization',
      'Well & Septic Certifications',
    ]);
  });

  it('ends with a call card', () => {
    const cta = document.querySelector('#services [data-service-cta] a');
    expect(cta.getAttribute('href')).toBe('tel:3175780890');
    expect(text(cta)).toBe('Not sure what you need? Call us');
  });
});

describe('reports', () => {
  it('has the heading and the text', () => {
    const section = document.getElementById('reports');
    expect(text(section.querySelector('h2'))).toBe('A clear report within 24 hours');
    expect(text(section)).toContain(
      'Within 24 hours of your inspection, you receive a detailed, easy-to-read report. It lists each defect, sorts the defects by severity, and includes photos.',
    );
  });
});

describe('reviews', () => {
  const section = () => document.getElementById('reviews');

  it('quotes the review word for word', () => {
    expect(text(section().querySelector('blockquote'))).toBe(
      'My fiance and I are in the process of buying our first home. After finding the perfect home, our realtor recommended [Clear View Home Inspections] for the inspection. Doug Wehr was our inspector and he was absolutely fantastic. He was incredibly thorough and made sure to explain every step of the process and every detail regarding any serious or potential issue in the home. We are so appreciative of his time and expertise during our experience. I would highly recommend Doug to any of my family and friends!',
    );
    expect(text(section().querySelector('figcaption'))).toBe('Krystal Schulz · First-time home buyer');
  });

  it('links to Google and Yelp reviews', () => {
    const links = [...section().querySelectorAll('a')].map((a) => [text(a), a.getAttribute('href')]);
    expect(links).toEqual([
      ['Read our Google reviews', 'https://share.google/r1sEf6h0a8sqJCZn8'],
      ['Read our Yelp reviews', 'https://www.yelp.com/biz/clear-view-home-inspections-fishers'],
    ]);
  });
});

describe('faq', () => {
  it('has three questions and opens the first one', () => {
    const items = [...document.querySelectorAll('#faq details')];
    expect(items.map((d) => text(d.querySelector('summary')))).toEqual([
      'What is a home inspection?',
      'Should I be present for the inspection?',
      'When can I expect my report?',
    ]);
    expect(items.map((d) => d.hasAttribute('open'))).toEqual([true, false, false]);
  });

  it('puts each answer under the correct question', () => {
    const answers = [...document.querySelectorAll('#faq details > p')].map(text);
    expect(answers[0]).toMatch(/^A home inspection is a thorough visual review/);
    expect(answers[1]).toMatch(/^We recommend it\./);
    expect(answers[2]).toMatch(/^Within 24 hours of the inspection/);
  });
});

describe('contact form', () => {
  const form = () => document.getElementById('contact-form');

  it('has the attributes that the form module and the hosts need', () => {
    expect(form().getAttribute('name')).toBe('contact');
    expect(form().getAttribute('method')).toBe('POST');
    expect(form().getAttribute('data-endpoint')).toBe('');
    expect(form().getAttribute('netlify-honeypot')).toBe('_gotcha');
    expect(form().querySelector('input[type="hidden"][name="form-name"]').value).toBe('contact');
    expect(form().querySelector('input[name="_gotcha"]').getAttribute('tabindex')).toBe('-1');
  });

  it('has four required fields, each with a visible label', () => {
    const labels = {};
    for (const name of ['first_name', 'last_name', 'email', 'message']) {
      const field = form().querySelector(`[name="${name}"]`);
      expect(field.required, name).toBe(true);
      labels[name] = text(document.querySelector(`label[for="${field.id}"]`));
    }
    expect(labels).toEqual({
      first_name: 'First name',
      last_name: 'Last name',
      email: 'Email',
      message: 'Message',
    });
    expect(form().querySelector('[name="email"]').type).toBe('email');
  });

  it('has a submit button, a status line, and a hidden success message', () => {
    expect(text(form().querySelector('button[type="submit"]'))).toBe('Send message');
    expect(form().querySelector('p[role="status"]')).not.toBeNull();
    const success = form().parentElement.querySelector('[data-form-success]');
    expect(success.hasAttribute('hidden')).toBe(true);
    expect(text(success)).toContain("Thanks! We'll be in touch soon.");
  });
});

describe('footer', () => {
  it('has the copyright line with a year placeholder', () => {
    const footer = document.querySelector('footer');
    expect(footer.querySelector('[data-year]').textContent).toBe('2026');
    expect(text(footer)).toContain('© 2026 Clear View Home Inspections, LLC. All rights reserved.');
  });
});
