/* eslint-env node */
/* global global */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../src/pages/Dashboard.jsx';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = vi.fn();

// Mock createCheckout
vi.mock('../src/lib/stripe', () => ({
  createCheckout: vi.fn(),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    global.fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('displays user email and paid status for paid user', async () => {
    const mockUser = {
      id: 1,
      email: 'paid@example.com',
      paid: true,
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    localStorageMock.getItem.mockReturnValue('paid@example.com');

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('paid@example.com')).toBeTruthy();
      expect(screen.getByText('✅ Paid Member')).toBeTruthy();
    });
  });

  it('displays user email and free status for free user', async () => {
    const mockUser = {
      id: 2,
      email: 'free@example.com',
      paid: false,
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    localStorageMock.getItem.mockReturnValue('free@example.com');

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('free@example.com')).toBeTruthy();
      expect(screen.getByText('❌ Free User')).toBeTruthy();
      expect(screen.getByText('Upgrade to Pro')).toBeTruthy();
    });
  });

  it('displays error message when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    localStorageMock.getItem.mockReturnValue('test@example.com');

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error/)).toBeTruthy();
    });
  });
});
