import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Landing from '../src/pages/Landing.jsx';

// Mock the UploadDemo component since it's imported
vi.mock('../src/pages/UploadDemo.jsx', () => {
  return {
    default: () => <div data-testid="upload-demo">Upload Demo Component</div>,
  };
});

// Mock the logo import
vi.mock('../src/assets/photo2profit-logo.svg', () => ({
  default: 'mocked-logo.svg',
}));

describe('Landing Component', () => {
  it('renders the main heading correctly', () => {
    render(<Landing />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('PHOTO2PROFIT');
  });

  it('displays the logo image', () => {
    render(<Landing />);

    const logo = screen.getByAltText('Photo2Profit Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'mocked-logo.svg');
  });

  it('shows the description text', () => {
    render(<Landing />);

    const description = screen.getByText(/Your Photos. Your Empire. Your Profit/i);
    expect(description).toBeInTheDocument();
  });

  it('renders the Get Started button', () => {
    render(<Landing />);

    const button = screen.getByRole('button', { name: /Start Earning Now/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('gem-button-primary');
  });

  it('switches to UploadDemo component when Try Demo is clicked', async () => {
    render(<Landing />);

    const button = screen.getByRole('button', { name: /Watch the Magic/i });
    fireEvent.click(button);

    // Wait for lazy loading and check for loading spinner first, then UploadDemo
    await waitFor(() => {
      expect(screen.getByText('Loading Photo2Profit...')).toBeInTheDocument();
    });

    // Landing content should no longer be visible
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });
  it('applies correct CSS classes for styling', () => {
    render(<Landing />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('bg-gradient-to-b from-blush via-rose-light to-blush text-dark');

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('font-diamond');
  });
});
