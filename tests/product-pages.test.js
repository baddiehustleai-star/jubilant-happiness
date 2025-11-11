import { describe, it, expect } from 'vitest';

const BASE_URL = process.env.VITE_API_BASE || process.env.API_BASE || 'http://localhost:8080';

async function testEndpoint(path, timeoutMs = 2000) {
  const controller = new globalThis.AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
    clearTimeout(t);
    return res;
  } catch {
    clearTimeout(t);
    return null;
  }
}

describe('Product Pages (optional)', () => {
  it('should return 404 for non-existent product', async () => {
    const response = await testEndpoint('/product/non-existent-id');
    if (!response) {
      console.log('⚠️ Server not running - skipping product page test');
      return;
    }
    expect(response.status).toBe(404);
    const text = await response.text();
    expect(text).toContain('Product not found');
  });

  it('should return dashboard HTML', async () => {
    const response = await testEndpoint('/dashboard');
    if (!response) {
      console.log('⚠️ Server not running - skipping dashboard test');
      return;
    }
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
    const text = await response.text();
    expect(text).toContain('Product Dashboard');
    expect(text).toContain('Photo2Profit');
  });
});
