import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import DeepLinkValidator from '../src/pages/DeepLinkValidator.jsx';
import Dashboard from '../src/pages/Dashboard.jsx';
import TranslationService from '../src/pages/TranslationService.jsx';

describe('DeepLinkValidator', () => {
  it('renders without crashing', () => {
    const { container } = render(<DeepLinkValidator />);
    expect(container).toBeTruthy();
  });

  it('displays the validator title', () => {
    const { getByText } = render(<DeepLinkValidator />);
    expect(getByText('Deep Link Validator')).toBeTruthy();
  });

  it('shows supported platforms', () => {
    const { getByText } = render(<DeepLinkValidator />);
    expect(getByText('eBay')).toBeTruthy();
    expect(getByText('Poshmark')).toBeTruthy();
    expect(getByText('Mercari')).toBeTruthy();
  });
});

describe('Dashboard', () => {
  it('renders without crashing', () => {
    const { container } = render(<Dashboard />);
    expect(container).toBeTruthy();
  });

  it('displays dashboard title', () => {
    const { getByText } = render(<Dashboard />);
    expect(getByText('Your Dashboard')).toBeTruthy();
  });

  it('shows AI-Powered Insights section', () => {
    const { getByText } = render(<Dashboard />);
    expect(getByText('AI-Powered Insights')).toBeTruthy();
  });

  it('displays user points', () => {
    const { getByText } = render(<Dashboard />);
    expect(getByText(/Points/)).toBeTruthy();
  });

  it('shows rewards store', () => {
    const { getByText } = render(<Dashboard />);
    expect(getByText('Rewards Store')).toBeTruthy();
  });
});

describe('TranslationService', () => {
  it('renders without crashing', () => {
    const { container } = render(<TranslationService />);
    expect(container).toBeTruthy();
  });

  it('displays the translation service title', () => {
    const { getByText } = render(<TranslationService />);
    expect(getByText('Translation Service')).toBeTruthy();
  });

  it('shows Gemini AI badge', () => {
    const { getByText } = render(<TranslationService />);
    expect(getByText('Powered by Gemini AI')).toBeTruthy();
  });

  it('displays language options', () => {
    const { getByText } = render(<TranslationService />);
    expect(getByText(/Spanish/)).toBeTruthy();
    expect(getByText(/French/)).toBeTruthy();
    expect(getByText(/German/)).toBeTruthy();
  });

  it('has a translate button', () => {
    const { getByText } = render(<TranslationService />);
    expect(getByText(/Translate Now/)).toBeTruthy();
  });
});
