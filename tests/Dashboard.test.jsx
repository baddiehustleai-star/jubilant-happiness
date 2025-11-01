import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../src/pages/Dashboard.jsx';

describe('Dashboard', () => {
  it('renders dashboard header with logo and title', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText(/PHOTO/)).toBeDefined();
    expect(screen.getByAltText('Photo2Profit Logo')).toBeDefined();
  });

  it('renders all stat cards', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('Total Listings')).toBeDefined();
    expect(screen.getByText('Active Sales')).toBeDefined();
    expect(screen.getByText('Revenue')).toBeDefined();
    expect(screen.getByText('Saved Time')).toBeDefined();
  });

  it('renders all tab buttons', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('📸 Upload Photos')).toBeDefined();
    expect(screen.getByText('📋 My Listings')).toBeDefined();
    expect(screen.getByText('🔄 Cross-Post')).toBeDefined();
    expect(screen.getByText('📊 Analytics')).toBeDefined();
  });

  it('renders upload tab content by default', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('Upload Your Photos')).toBeDefined();
    expect(screen.getByText(/Drag & drop photos here/)).toBeDefined();
  });
});
