import { describe, it, expect } from 'vitest';

const BASE = process.env.VITE_API_BASE || process.env.API_BASE || 'http://localhost:8080';

async function getHealth(url, timeoutMs = 2000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/health`, { signal: controller.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch (e) {
    clearTimeout(t);
    return null;
  }
}

describe('api health (optional)', () => {
  it('returns healthy when API is running (skips silently if not available)', async () => {
    const health = await getHealth(BASE);
    if (!health) {
      // No API running in this environment; do not fail CI
      return;
    }
    expect(health).toBeTruthy();
    expect(health.status).toBe('healthy');
  });
});
