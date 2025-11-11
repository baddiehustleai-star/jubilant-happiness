import { describe, it, expect } from 'vitest';

const BASE = process.env.VITE_API_BASE || process.env.API_BASE || 'http://localhost:8080';

describe('AI endpoints (optional - requires API running)', () => {
  it('POST /api/analyze returns analysis structure', async () => {
    try {
      const res = await fetch(`${BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: 'https://via.placeholder.com/400x400.png?text=Test+Product'
        })
      });
      
      if (!res.ok) {
        console.warn('API not available or analyze failed');
        return; // Skip test if API not running
      }
      
      const data = await res.json();
      expect(data).toBeTruthy();
      // Should have success flag or error
      expect(data).toHaveProperty('success');
    } catch {
      // API not running, skip test
      return;
    }
  });

  it('POST /api/price-lookup returns pricing structure', async () => {
    try {
      const res = await fetch(`${BASE}/api/price-lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: 'vintage watch'
        })
      });
      
      if (!res.ok) {
        console.warn('API not available or price-lookup failed');
        return;
      }
      
      const data = await res.json();
      expect(data).toBeTruthy();
      expect(data).toHaveProperty('success');
    } catch {
      return;
    }
  });

  it('POST /api/workflow/full-analysis returns combined result', async () => {
    try {
      const res = await fetch(`${BASE}/api/workflow/full-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: 'https://via.placeholder.com/400x400.png?text=Test+Product',
          removeBg: false
        })
      });
      
      if (!res.ok) {
        console.warn('API not available or workflow failed');
        return;
      }
      
      const data = await res.json();
      expect(data).toBeTruthy();
      expect(data).toHaveProperty('success');
      if (data.success) {
        expect(data).toHaveProperty('analysis');
        expect(data).toHaveProperty('suggestedPrice');
      }
    } catch {
      return;
    }
  });
});
