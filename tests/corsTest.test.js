/* eslint-env node */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testCorsConnection, testApiHealth, runAllCorsTests } from '../src/lib/corsTest';

// Mock fetch for testing
global.fetch = vi.fn();

describe('CORS Testing Utilities', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Mock console methods
    global.console.log = vi.fn();
    global.console.error = vi.fn();
  });

  describe('testCorsConnection', () => {
    it('should return success when API responds correctly', async () => {
      const mockResponse = {
        message: 'Photo2Profit API is alive!',
        timestamp: '2025-11-10T06:00:00.000Z',
        version: '1.0.0',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await testCorsConnection();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://photo2profit-api-758851214311.us-west2.run.app/api',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return error when API request fails', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await testCorsConnection();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should handle HTTP error responses', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const result = await testCorsConnection();

      expect(result.success).toBe(false);
      expect(result.error).toContain('404');
    });
  });

  describe('testApiHealth', () => {
    it('should return success when health endpoint responds', async () => {
      const mockHealthResponse = {
        status: 'healthy',
        uptime: 1234.56,
        timestamp: '2025-11-10T06:00:00.000Z',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockHealthResponse,
      });

      const result = await testApiHealth();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockHealthResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://photo2profit-api-758851214311.us-west2.run.app/api/health',
        expect.any(Object)
      );
    });

    it('should return error when health check fails', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Service unavailable'));

      const result = await testApiHealth();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Service unavailable');
    });
  });

  describe('runAllCorsTests', () => {
    it('should run all tests and return combined results', async () => {
      // Mock all API responses
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'API is alive!' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 'healthy' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      const results = await runAllCorsTests();

      expect(results.basicConnection.success).toBe(true);
      expect(results.healthCheck.success).toBe(true);
      expect(results.postRequest.success).toBe(true);
    });

    it('should handle mixed test results', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'API is alive!' }),
        })
        .mockRejectedValueOnce(new Error('Health check failed'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      const results = await runAllCorsTests();

      expect(results.basicConnection.success).toBe(true);
      expect(results.healthCheck.success).toBe(false);
      expect(results.postRequest.success).toBe(true);
    });
  });

  describe('API URL configuration', () => {
    it('should use correct API endpoint URL', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await testCorsConnection();

      const callUrl = global.fetch.mock.calls[0][0];
      expect(callUrl).toBe('https://photo2profit-api-758851214311.us-west2.run.app/api');
    });

    it('should use correct health endpoint URL', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await testApiHealth();

      const callUrl = global.fetch.mock.calls[0][0];
      expect(callUrl).toBe('https://photo2profit-api-758851214311.us-west2.run.app/api/health');
    });
  });
});
