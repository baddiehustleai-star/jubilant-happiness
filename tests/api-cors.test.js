import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

describe('API Server CORS', () => {
  let serverProcess;
  const PORT = 9191;
  const BASE_URL = `http://localhost:${PORT}`;

  beforeAll(async () => {
    // Start the server
    serverProcess = spawn('node', ['api/server.js'], {
      env: {
        ...process.env,
        PORT: PORT.toString(),
        STRIPE_SECRET_KEY: 'sk_test_dummy',
      },
      stdio: 'pipe',
    });

    // Wait for server to start
    await setTimeout(2000);
  });

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
  });

  it('should respond to health check', async () => {
    const response = await fetch(BASE_URL);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.message).toContain('Photo2Profit API');
  });

  it('should allow CORS from localhost:5173', async () => {
    const response = await fetch(`${BASE_URL}/api/create-checkout-session`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
      },
    });

    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173');
    expect(response.headers.get('Access-Control-Allow-Credentials')).toBe('true');
  });

  it('should allow CORS from Firebase hosting', async () => {
    const response = await fetch(`${BASE_URL}/api/create-checkout-session`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://photo2profitbaddie.web.app',
        'Access-Control-Request-Method': 'POST',
      },
    });

    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(
      'https://photo2profitbaddie.web.app'
    );
    expect(response.headers.get('Access-Control-Allow-Credentials')).toBe('true');
  });

  it('should block CORS from unauthorized origins', async () => {
    const response = await fetch(`${BASE_URL}/api/create-checkout-session`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://evil-site.com',
        'Access-Control-Request-Method': 'POST',
      },
    });

    // When CORS is blocked, the Access-Control-Allow-Origin header should not be present
    expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });
});
