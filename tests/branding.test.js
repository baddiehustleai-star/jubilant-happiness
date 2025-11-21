/**
 * Test suite for branding API endpoint
 * Ensures dynamic branding configuration works correctly
 */
import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';

// Mock the API handler
const mockResponse = {
  setHeader: vi.fn(),
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
  end: vi.fn(),
};

describe('Branding API', () => {
  it('should return branding configuration for GET request', async () => {
    // Import the handler
    const handler = (await import('../api/branding.js')).default;

    const mockRequest = {
      method: 'GET',
    };

    await handler(mockRequest, mockResponse);

    // Verify response structure
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalled();

    const responseData = mockResponse.json.mock.calls[0][0];

    // Check required branding fields
    expect(responseData).toHaveProperty('companyName', 'Photo2Profit');
    expect(responseData).toHaveProperty('tagline');
    expect(responseData).toHaveProperty('colors');
    expect(responseData).toHaveProperty('fonts');
    expect(responseData).toHaveProperty('contact');

    // Verify color palette
    expect(responseData.colors).toHaveProperty('primary', '#E8B4B8');
    expect(responseData.colors).toHaveProperty('secondary', '#F5E6D3');
    expect(responseData.colors).toHaveProperty('accent', '#D4A574');

    // Verify fonts
    expect(responseData.fonts).toHaveProperty('heading');
    expect(responseData.fonts).toHaveProperty('body');

    // Verify meta information
    expect(responseData.meta).toHaveProperty('version');
    expect(responseData.meta).toHaveProperty('lastUpdated');
  });

  it('should return 405 for non-GET requests', async () => {
    const handler = (await import('../api/branding.js')).default;

    const mockRequest = {
      method: 'POST',
    };

    await handler(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(405);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Method not allowed',
      message: 'Only GET requests are supported',
    });
  });

  it('should handle OPTIONS preflight requests', async () => {
    const handler = (await import('../api/branding.js')).default;

    const mockRequest = {
      method: 'OPTIONS',
    };

    await handler(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.end).toHaveBeenCalled();
  });

  it('should set appropriate CORS headers', async () => {
    const handler = (await import('../api/branding.js')).default;

    const mockRequest = {
      method: 'GET',
    };

    await handler(mockRequest, mockResponse);

    // Verify CORS headers are set
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'Access-Control-Allow-Methods',
      'GET,OPTIONS'
    );
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      expect.stringContaining('public')
    );
  });
});
