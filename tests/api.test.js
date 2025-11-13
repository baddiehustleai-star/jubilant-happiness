import { describe, it, expect } from 'vitest';

describe('API endpoint structure', () => {
  it('health endpoint exports handler function', async () => {
    const healthModule = await import('../api/health.js');
    expect(healthModule.default).toBeDefined();
    expect(typeof healthModule.default).toBe('function');
  });

  it('seo refresh endpoint exports handler function', async () => {
    const seoModule = await import('../api/seo/refresh.js');
    expect(seoModule.default).toBeDefined();
    expect(typeof seoModule.default).toBe('function');
  });
});
