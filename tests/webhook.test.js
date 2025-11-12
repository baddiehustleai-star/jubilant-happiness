/* eslint-env node */
/* eslint-disable no-undef */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Simple integration tests for webhook handler
// Note: Full testing would require proper mocking of Stripe and SendGrid,
// which is complex in serverless function context. These tests verify basic structure.

describe('webhook handler', () => {
  let handler;

  beforeEach(async () => {
    // Set required environment variables for tests
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
    process.env.SENDGRID_API_KEY = 'SG.test123';
    process.env.FRONTEND_URL = 'https://test.example.com';

    // Import handler fresh for each test
    const module = await import('../api/webhook.js?t=' + Date.now());
    handler = module.default;
  });

  it('rejects non-POST requests with 405', async () => {
    const req = { method: 'GET', headers: {} };
    const res = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
  });

  it('handles missing stripe signature without webhook secret', async () => {
    // Clear webhook secret to test fallback path
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const validEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          customer_details: {
            email: 'test@example.com',
          },
        },
      },
    };

    const req = {
      method: 'POST',
      headers: {},
      body: validEvent,
    };

    const res = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await handler(req, res);

    // Should succeed when no signature verification is required
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  it('processes unhandled event types gracefully', async () => {
    // Clear webhook secret for simplicity
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const req = {
      method: 'POST',
      headers: {},
      body: {
        type: 'payment_intent.succeeded',
        data: { object: {} },
      },
    };

    const res = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  it('exports a function as default', () => {
    expect(handler).toBeDefined();
    expect(typeof handler).toBe('function');
  });
});
