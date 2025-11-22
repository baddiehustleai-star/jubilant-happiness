import React, { createContext, useContext, useEffect, useState } from 'react';

const BrandingContext = createContext(null);

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState(null);

  useEffect(() => {
    fetch('/api/branding')
      .then((res) => res.json())
      .then((data) => {
        setBranding(data);
        // Apply branding to CSS custom properties
        if (data.colors) {
          Object.entries(data.colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--color-${key}`, value);
          });
        }
        if (data.fonts) {
          Object.entries(data.fonts).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--font-${key}`, value);
          });
        }
      })
      .catch(() => {
        // fallback if API fails
        setBranding({
          companyName: 'Photo2Profit',
          logoUrl: '/logo.png',
          primaryColor: '#E8B4B8',
          secondaryColor: '#F5E6D3',
          fontFamily: "'Playfair Display', serif",
          tagline: 'Transform Your Photos Into Profit',
          contactEmail: 'support@photo2profit.online',
        });
      });
  }, []);

  if (!branding) return null; // or a loading spinner

  return <BrandingContext.Provider value={branding}>{children}</BrandingContext.Provider>;
};

export const useBranding = () => useContext(BrandingContext);
