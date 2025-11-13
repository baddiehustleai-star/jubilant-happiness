import { describe, it, expect } from 'vitest';
import {
  brand,
  marketingAgent,
  generateTweetThread,
  generateLaunchEmail,
  generateSEOPage,
  generateNewsletter,
  createBrandPost,
  renderInstagramVisual,
  marketingFunctions,
} from '../src/lib/marketingAgent.js';

describe('marketingAgent', () => {
  describe('brand configuration', () => {
    it('has all required brand properties', () => {
      expect(brand).toHaveProperty('name');
      expect(brand).toHaveProperty('domain');
      expect(brand).toHaveProperty('tagline');
      expect(brand).toHaveProperty('heroCTA');
      expect(brand).toHaveProperty('demoVideo');
    });

    it('has correct brand values', () => {
      expect(brand.name).toBe('Photo2Profit');
      expect(brand.domain).toBe('photo2profit.online');
      expect(brand.tagline).toBe('Turn your camera roll into cashflow.');
      expect(brand.heroCTA).toBe('Upload photos. Earn daily.');
    });
  });

  describe('marketingAgent configuration', () => {
    it('has all required tools configured', () => {
      expect(marketingAgent.tools).toHaveProperty('copywriter');
      expect(marketingAgent.tools).toHaveProperty('imagePostGenerator');
      expect(marketingAgent.tools).toHaveProperty('newsletterWriter');
      expect(marketingAgent.tools).toHaveProperty('tweetThreadWriter');
      expect(marketingAgent.tools).toHaveProperty('productHuntLaunch');
      expect(marketingAgent.tools).toHaveProperty('seoPageGenerator');
      expect(marketingAgent.tools).toHaveProperty('contentScheduler');
    });

    it('has correct tone setting', () => {
      expect(marketingAgent.tone).toBe(
        'confident, clever, baddie-energy, founder-forward',
      );
    });

    it('has all function structures defined', () => {
      expect(marketingAgent.structure).toContain('createBrandPost()');
      expect(marketingAgent.structure).toContain('generateLaunchEmail()');
      expect(marketingAgent.structure).toContain('generateTweetThread()');
      expect(marketingAgent.structure).toContain('generateSEOPage()');
      expect(marketingAgent.structure).toContain('generateNewsletter()');
      expect(marketingAgent.structure).toContain('renderInstagramVisual()');
    });
  });

  describe('generateTweetThread', () => {
    it('returns an array of tweets', () => {
      const thread = generateTweetThread();
      expect(Array.isArray(thread)).toBe(true);
      expect(thread.length).toBeGreaterThan(0);
    });

    it('includes launch announcement', () => {
      const thread = generateTweetThread();
      expect(thread[0]).toContain('Photo2Profit');
    });

    it('includes demo video link', () => {
      const thread = generateTweetThread();
      const demoTweet = thread.find((tweet) => tweet.includes(brand.demoVideo));
      expect(demoTweet).toBeDefined();
    });

    it('includes domain link', () => {
      const thread = generateTweetThread();
      const siteTweet = thread.find((tweet) => tweet.includes(brand.domain));
      expect(siteTweet).toBeDefined();
    });

    it('includes hashtags', () => {
      const thread = generateTweetThread();
      const hashtagTweet = thread.find((tweet) => tweet.includes('#photo2profit'));
      expect(hashtagTweet).toBeDefined();
    });
  });

  describe('generateLaunchEmail', () => {
    it('returns email object with required fields', () => {
      const email = generateLaunchEmail();
      expect(email).toHaveProperty('subject');
      expect(email).toHaveProperty('preheader');
      expect(email).toHaveProperty('body');
    });

    it('includes brand name in subject', () => {
      const email = generateLaunchEmail();
      expect(email.subject).toContain(brand.name);
    });

    it('includes domain link in body', () => {
      const email = generateLaunchEmail();
      expect(email.body).toContain(brand.domain);
    });

    it('includes demo video link in body', () => {
      const email = generateLaunchEmail();
      expect(email.body).toContain(brand.demoVideo);
    });

    it('includes CTA in body', () => {
      const email = generateLaunchEmail();
      expect(email.body).toContain(brand.heroCTA);
    });
  });

  describe('generateSEOPage', () => {
    it('returns SEO page object with required fields', () => {
      const page = generateSEOPage();
      expect(page).toHaveProperty('title');
      expect(page).toHaveProperty('metaDescription');
      expect(page).toHaveProperty('h1');
      expect(page).toHaveProperty('h2');
      expect(page).toHaveProperty('content');
      expect(page).toHaveProperty('cta');
    });

    it('includes brand tagline as h1', () => {
      const page = generateSEOPage();
      expect(page.h1).toBe(brand.tagline);
    });

    it('includes brand name in title', () => {
      const page = generateSEOPage();
      expect(page.title).toContain(brand.name);
    });

    it('has CTA with correct URL', () => {
      const page = generateSEOPage();
      expect(page.cta.url).toContain(brand.domain);
    });

    it('has meaningful meta description', () => {
      const page = generateSEOPage();
      expect(page.metaDescription.length).toBeGreaterThan(50);
      expect(page.metaDescription.length).toBeLessThan(160);
    });
  });

  describe('generateNewsletter', () => {
    it('returns newsletter object with required fields', () => {
      const newsletter = generateNewsletter();
      expect(newsletter).toHaveProperty('subject');
      expect(newsletter).toHaveProperty('sections');
    });

    it('has multiple sections', () => {
      const newsletter = generateNewsletter();
      expect(Array.isArray(newsletter.sections)).toBe(true);
      expect(newsletter.sections.length).toBeGreaterThan(0);
    });

    it('each section has title and content', () => {
      const newsletter = generateNewsletter();
      newsletter.sections.forEach((section) => {
        expect(section).toHaveProperty('title');
        expect(section).toHaveProperty('content');
      });
    });

    it('includes brand name in content', () => {
      const newsletter = generateNewsletter();
      const hasbrandName = newsletter.sections.some((section) =>
        section.content.includes(brand.name),
      );
      expect(hasbrandName).toBe(true);
    });
  });

  describe('createBrandPost', () => {
    it('returns instagram post by default', () => {
      const post = createBrandPost();
      expect(post).toHaveProperty('caption');
      expect(post).toHaveProperty('hashtags');
    });

    it('returns instagram post when specified', () => {
      const post = createBrandPost('instagram');
      expect(post).toHaveProperty('caption');
      expect(post.caption).toContain(brand.tagline);
    });

    it('returns facebook post when specified', () => {
      const post = createBrandPost('facebook');
      expect(post).toHaveProperty('text');
      expect(post.text).toContain(brand.name);
    });

    it('returns linkedin post when specified', () => {
      const post = createBrandPost('linkedin');
      expect(post).toHaveProperty('text');
      expect(post.text).toContain(brand.name);
    });

    it('falls back to instagram for unknown platforms', () => {
      const post = createBrandPost('unknown');
      expect(post).toHaveProperty('caption');
    });

    it('includes domain in all posts', () => {
      const instagram = createBrandPost('instagram');
      const facebook = createBrandPost('facebook');
      const linkedin = createBrandPost('linkedin');

      expect(
        instagram.caption.includes(brand.domain) ||
          instagram.caption.includes('Link in bio'),
      ).toBe(true);
      expect(facebook.text).toContain(brand.domain);
      expect(linkedin.text).toContain(brand.domain);
    });
  });

  describe('renderInstagramVisual', () => {
    it('returns visual specification object', () => {
      const visual = renderInstagramVisual();
      expect(visual).toHaveProperty('format');
      expect(visual).toHaveProperty('dimensions');
      expect(visual).toHaveProperty('background');
      expect(visual).toHaveProperty('elements');
      expect(visual).toHaveProperty('callToAction');
    });

    it('has correct instagram post format', () => {
      const visual = renderInstagramVisual();
      expect(visual.format).toBe('instagram-post');
    });

    it('has square dimensions (1080x1080)', () => {
      const visual = renderInstagramVisual();
      expect(visual.dimensions.width).toBe(1080);
      expect(visual.dimensions.height).toBe(1080);
    });

    it('includes brand tagline in elements', () => {
      const visual = renderInstagramVisual();
      const headlineElement = visual.elements.find((el) => el.type === 'headline');
      expect(headlineElement).toBeDefined();
      expect(headlineElement.text).toBe(brand.tagline);
    });

    it('includes CTA in elements', () => {
      const visual = renderInstagramVisual();
      const ctaElement = visual.elements.find((el) => el.type === 'cta');
      expect(ctaElement).toBeDefined();
      expect(ctaElement.text).toBe(brand.heroCTA);
    });

    it('has brand domain as call to action', () => {
      const visual = renderInstagramVisual();
      expect(visual.callToAction).toBe(brand.domain);
    });
  });

  describe('marketingFunctions export', () => {
    it('exports all marketing functions', () => {
      expect(marketingFunctions).toHaveProperty('generateTweetThread');
      expect(marketingFunctions).toHaveProperty('generateLaunchEmail');
      expect(marketingFunctions).toHaveProperty('generateSEOPage');
      expect(marketingFunctions).toHaveProperty('generateNewsletter');
      expect(marketingFunctions).toHaveProperty('createBrandPost');
      expect(marketingFunctions).toHaveProperty('renderInstagramVisual');
    });

    it('all exported functions are callable', () => {
      expect(typeof marketingFunctions.generateTweetThread).toBe('function');
      expect(typeof marketingFunctions.generateLaunchEmail).toBe('function');
      expect(typeof marketingFunctions.generateSEOPage).toBe('function');
      expect(typeof marketingFunctions.generateNewsletter).toBe('function');
      expect(typeof marketingFunctions.createBrandPost).toBe('function');
      expect(typeof marketingFunctions.renderInstagramVisual).toBe('function');
    });
  });
});
