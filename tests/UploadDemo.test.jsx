import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UploadDemo from '../src/pages/UploadDemo.jsx';

// Mock the stripe module
vi.mock('../src/lib/stripe', () => ({
  createCheckout: vi.fn(),
}));

describe('UploadDemo Component', () => {
  it('renders the upload demo heading', () => {
    render(<UploadDemo />);

    expect(screen.getByText('Upload Demo')).toBeInTheDocument();
  });

  it('renders descriptive text', () => {
    render(<UploadDemo />);

    expect(screen.getByText(/Sign in to save your uploads/)).toBeInTheDocument();
  });

  it('renders file input', () => {
    render(<UploadDemo />);

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('accept', 'image/*');
  });

  it('renders action buttons', () => {
    render(<UploadDemo />);

    expect(screen.getByText('Get share link')).toBeInTheDocument();
    expect(screen.getByText('Upgrade')).toBeInTheDocument();
  });
});
