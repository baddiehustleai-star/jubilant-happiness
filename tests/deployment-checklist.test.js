/**
 * Test for final deployment checklist script
 * Validates the checklist logic with a mock server
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import http from 'http';

let mockServer;
let serverUrl;

// Create a simple mock server for testing
beforeAll(async () => {
  return new Promise((resolve) => {
    mockServer = http.createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');

      if (req.url === '/health') {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'healthy' }));
      } else if (req.url === '/api/seo/refresh?limit=1') {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, refreshed: 1, examined: 5, errors: [] }));
      } else if (req.url?.startsWith('/share/')) {
        res.writeHead(404);
        res.end('<html><title>Not Found</title></html>');
      } else if (req.url === '/api/analyze-product' || req.url === '/api/cross-post') {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    mockServer.listen(0, () => {
      const port = mockServer.address().port;
      serverUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

afterAll(() => {
  if (mockServer) {
    mockServer.close();
  }
});

describe('Final Deployment Checklist', () => {
  it('should run with mock server', async () => {
    return new Promise((resolve, reject) => {
      const env = {
        ...process.env,
        CLOUD_RUN_URL: serverUrl,
        VITE_FIREBASE_PROJECT_ID: 'test-project',
        VITE_FIREBASE_API_KEY: 'test-key',
        VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_key',
      };

      const child = spawn('node', ['scripts/final-deployment-checklist.js'], {
        env,
        cwd: process.cwd(),
      });

      let output = '';

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        // Check that the output contains expected sections
        expect(output).toContain('Photo2Profit Final Deployment Checklist');
        expect(output).toContain('Checking Environment Variables');
        expect(output).toContain('Checking API Deployment');
        expect(output).toContain('FINAL DEPLOYMENT REPORT');

        // Should pass with our mock server
        expect(code).toBe(0);
        expect(output).toContain('ALL CHECKS PASSED');

        resolve();
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        child.kill();
        reject(new Error('Test timeout'));
      }, 30000);
    });
  }, 35000);

  it('should fail gracefully with invalid URL', async () => {
    return new Promise((resolve, reject) => {
      const env = {
        ...process.env,
        CLOUD_RUN_URL: 'http://invalid-url-that-does-not-exist.local',
        VITE_FIREBASE_PROJECT_ID: 'test-project',
        VITE_FIREBASE_API_KEY: 'test-key',
        VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_key',
      };

      const child = spawn('node', ['scripts/final-deployment-checklist.js'], {
        env,
        cwd: process.cwd(),
      });

      let output = '';

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        // Should fail with invalid URL
        expect(code).toBe(1);
        expect(output).toContain('DEPLOYMENT NOT READY');
        expect(output).toContain('Cannot reach API');

        resolve();
      });

      setTimeout(() => {
        child.kill();
        reject(new Error('Test timeout'));
      }, 30000);
    });
  }, 35000);
});
