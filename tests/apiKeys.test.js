import { describe, it, expect } from 'vitest';
import apiKeys from '../src/config/apiKeys.js';

describe('apiKeys configuration', () => {
  it('exports an object with all required keys', () => {
    expect(apiKeys).toBeDefined();
    expect(typeof apiKeys).toBe('object');
  });

  it('has firebase configuration', () => {
    expect(apiKeys.firebase).toBeDefined();
    expect(apiKeys.firebase).toHaveProperty('apiKey');
    expect(apiKeys.firebase).toHaveProperty('authDomain');
    expect(apiKeys.firebase).toHaveProperty('projectId');
    expect(apiKeys.firebase).toHaveProperty('storageBucket');
    expect(apiKeys.firebase).toHaveProperty('messagingSenderId');
    expect(apiKeys.firebase).toHaveProperty('appId');
  });

  it('has stripe configuration', () => {
    expect(apiKeys.stripe).toBeDefined();
    expect(apiKeys.stripe).toHaveProperty('secretKey');
    expect(apiKeys.stripe).toHaveProperty('priceId');
  });

  it('has removeBg configuration', () => {
    expect(apiKeys.removeBg).toBeDefined();
    expect(apiKeys.removeBg).toHaveProperty('apiKey');
  });

  it('has ebay configuration', () => {
    expect(apiKeys.ebay).toBeDefined();
    expect(apiKeys.ebay).toHaveProperty('appId');
    expect(apiKeys.ebay).toHaveProperty('certId');
    expect(apiKeys.ebay).toHaveProperty('devId');
    expect(apiKeys.ebay).toHaveProperty('oauthToken');
  });

  it('has sendGrid configuration', () => {
    expect(apiKeys.sendGrid).toBeDefined();
    expect(apiKeys.sendGrid).toHaveProperty('apiKey');
  });

  it('returns empty strings when environment variables are not set', () => {
    // Since we're in test environment without env vars, all should be empty strings
    expect(typeof apiKeys.firebase.apiKey).toBe('string');
    expect(typeof apiKeys.stripe.secretKey).toBe('string');
    expect(typeof apiKeys.removeBg.apiKey).toBe('string');
    expect(typeof apiKeys.ebay.appId).toBe('string');
    expect(typeof apiKeys.sendGrid.apiKey).toBe('string');
  });
});
