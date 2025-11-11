import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';

const TEST_PORT = process.env.E2E_API_PORT || '9090';
const BASE = `http://localhost:${TEST_PORT}`;

let child;

async function waitForHealth(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${url}/health`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.status === 'healthy') return json;
      }
    } catch {
      // ignore until timeout
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  return null;
}

beforeAll(async () => {
  child = spawn('node', ['api/server.js'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: TEST_PORT, NODE_ENV: 'test' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  // Optional: surface logs for debugging
  child.stdout.on('data', (d) => process.stdout.write(`[api] ${d}`));
  child.stderr.on('data', (d) => process.stderr.write(`[api-err] ${d}`));

  const healthy = await waitForHealth(BASE);
  if (!healthy) {
    throw new Error('API did not become healthy in time');
  }
}, 20000);

afterAll(async () => {
  if (child && !child.killed) {
    child.kill('SIGTERM');
  }
});

describe('e2e api (local spawn)', () => {
  it('GET /health returns healthy', async () => {
    const res = await fetch(`${BASE}/health`);
    expect(res.ok).toBe(true);
    const json = await res.json();
    expect(json.status).toBe('healthy');
  });
});
