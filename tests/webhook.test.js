import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('webhook', () => {
  beforeEach(() => {
    // Reset environment variables
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_fake');
    vi.stubEnv('SENDGRID_API_KEY', 'SG.test');
    vi.stubEnv('DATABASE_URL', 'file:./test.db');
  });

  it('exports a handler function', async () => {
    // Dynamic import to ensure env vars are set
    const { default: handler } = await import('../api/webhook.js');
    expect(typeof handler).toBe('function');
  });

  it('returns 405 for non-POST requests', async () => {
    const { default: handler } = await import('../api/webhook.js');
    
    const req = {
      method: 'GET',
      headers: {},
    };
    
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
    };

    await handler(req, res);
    
    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('returns 400 for invalid webhook signature', async () => {
    const { default: handler } = await import('../api/webhook.js');
    
    const req = {
      method: 'POST',
      headers: {
        'stripe-signature': 'invalid',
      },
      body: JSON.stringify({ type: 'test' }),
      [Symbol.asyncIterator]: async function* () {
        yield Buffer.from(JSON.stringify({ type: 'test' }));
      },
    };
    
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await handler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('Webhook Error'),
      })
    );
  });
});
