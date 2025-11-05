import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Landing from '../src/pages/Landing';

describe('Landing Page', () => {
  it('renders landing page with sign up and login buttons', () => {
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    expect(screen.getByText(/Turn your photos into profit/i)).toBeDefined();
    expect(screen.getByText('Start Now')).toBeDefined();
    expect(screen.getByText('Log In')).toBeDefined();
  });
});
