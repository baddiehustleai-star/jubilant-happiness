/**
 * Branding Hook for Photo2Profit
 * Fetches and manages dynamic branding configuration
 */
import { useState, useEffect } from 'react';

// Default fallback branding (matches current hardcoded theme)
const DEFAULT_BRANDING = {
  companyName: 'Photo2Profit',
  tagline: 'Transform Your Photos Into Profit',
  colors: {
    primary: '#E8B4B8', // Rose
    secondary: '#F5E6D3', // Blush
    accent: '#D4A574', // Gold
    dark: '#2D3748', // Dark text
    light: '#FFFFFF', // White
  },
  fonts: {
    heading: 'Playfair Display, serif',
    body: 'Inter, sans-serif',
  },
};

export const useBranding = () => {
  const [branding, setBranding] = useState(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        setLoading(true);

        // Try to fetch from API, with fallback to default
        const response = await fetch('/api/branding', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          const brandingData = await response.json();
          setBranding(brandingData);

          // Apply dynamic CSS custom properties for real-time theming
          applyBrandingToCSS(brandingData);
        } else {
          console.warn('Failed to fetch branding, using defaults');
          setBranding(DEFAULT_BRANDING);
          applyBrandingToCSS(DEFAULT_BRANDING);
        }
      } catch (err) {
        console.warn('Branding API error, using defaults:', err);
        setError(err);
        setBranding(DEFAULT_BRANDING);
        applyBrandingToCSS(DEFAULT_BRANDING);
      } finally {
        setLoading(false);
      }
    };

    fetchBranding();
  }, []);

  return { branding, loading, error };
};

/**
 * Apply branding colors and fonts to CSS custom properties
 * This allows real-time theme switching without page reload
 */
const applyBrandingToCSS = (brandingData) => {
  const root = document.documentElement;

  if (brandingData.colors) {
    // Apply color variables
    Object.entries(brandingData.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }

  if (brandingData.fonts) {
    // Apply font variables
    Object.entries(brandingData.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });
  }
};

/**
 * Utility function to get branding-aware CSS classes
 */
export const getBrandingClasses = (branding) => ({
  // Background classes
  primaryBg: `bg-[${branding?.colors?.primary || DEFAULT_BRANDING.colors.primary}]`,
  secondaryBg: `bg-[${branding?.colors?.secondary || DEFAULT_BRANDING.colors.secondary}]`,
  accentBg: `bg-[${branding?.colors?.accent || DEFAULT_BRANDING.colors.accent}]`,

  // Text classes
  primaryText: `text-[${branding?.colors?.primary || DEFAULT_BRANDING.colors.primary}]`,
  darkText: `text-[${branding?.colors?.dark || DEFAULT_BRANDING.colors.dark}]`,

  // Font classes
  headingFont: `font-[${branding?.fonts?.heading || DEFAULT_BRANDING.fonts.heading}]`,
  bodyFont: `font-[${branding?.fonts?.body || DEFAULT_BRANDING.fonts.body}]`,
});

export default useBranding;
