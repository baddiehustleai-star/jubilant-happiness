import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('HTML Landing Page', () => {
  const html = readFileSync(join(process.cwd(), 'index.html'), 'utf-8');

  it('contains the correct title', () => {
    expect(html).toContain('<title>Photo 2 Profit</title>');
  });

  it('contains the logo image', () => {
    expect(html).toContain('<img src="logo.svg" alt="Photo 2 Profit Logo"');
  });

  it('contains the hero heading', () => {
    expect(html).toContain('Turn Your Passion Into Profit');
  });

  it('contains the testimonials section', () => {
    expect(html).toContain('What Our Members Say');
    expect(html).toContain('Photo2Profit gave me the clarity');
  });

  it('contains the signup form', () => {
    expect(html).toContain('Join the Waitlist');
    expect(html).toContain('type="email"');
    expect(html).toContain('placeholder="Enter your email"');
  });

  it('contains the CTA button', () => {
    expect(html).toContain('Start Now');
  });

  it('contains the footer', () => {
    expect(html).toContain('© 2025 Photo2Profit. All rights reserved.');
  });

  it('uses the rose-gold color palette', () => {
    expect(html).toContain('#fbd3e9');
    expect(html).toContain('#f8b6d2');
    expect(html).toContain('#b46a7b');
  });

  it('imports Poppins font', () => {
    expect(html).toContain('Poppins');
  });

  it('is a standalone HTML file with inline styles', () => {
    expect(html).toContain('<style>');
    expect(html).not.toContain('<script type="module" src="/src/main.jsx">');
  });
});
