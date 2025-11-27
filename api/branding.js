/**
 * Branding API Endpoint
 * Serves dynamic branding configuration for Photo2Profit
 * Allows runtime theming without redeployment
 */

export default async function handler(req, res) {
  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only GET requests are supported',
    });
  }

  try {
    // Photo2Profit branding configuration
    const brandingConfig = {
      // Company Identity
      companyName: 'Photo2Profit',
      tagline: 'Transform Your Photos Into Profit',
      description: 'Professional photo editing and cross-platform social media automation',

      // Visual Assets
      logoUrl: 'https://www.photo2profit.online/logo.svg',
      faviconUrl: 'https://www.photo2profit.online/favicon.svg',

      // Soft Pink Blush Palette
      colors: {
        primary: '#E8C4B8', // Soft pink - main brand color
        secondary: '#F5E6EE', // Light pink cream
        accent: '#D4A8B8', // Dusty rose
        dark: '#6B4A54', // Warm brown-pink text
        light: '#FFF8FA', // Pink-tinted white
        success: '#B8D4A8', // Soft sage green
        warning: '#F5C78E', // Soft peach accent
        error: '#E8A8B8', // Soft rose red
      },

      // Typography
      fonts: {
        heading: 'Playfair Display, serif', // Diamond - luxury serif for headings
        body: 'Inter, sans-serif', // Clean sans-serif for body text
        mono: 'Fira Code, monospace', // Monospace for code
      },

      // Social Media & Contact
      contact: {
        email: 'support@photo2profit.online',
        website: 'https://www.photo2profit.online',
        social: {
          instagram: '@photo2profit',
          tiktok: '@photo2profit',
          facebook: 'photo2profit',
          youtube: '@photo2profit',
        },
      },

      // Feature Branding
      features: {
        backgroundRemoval: {
          name: 'Smart Background Removal',
          description: 'AI-powered background removal with professional results',
        },
        crossPosting: {
          name: 'Multi-Platform Publishing',
          description: 'Automatically post to Instagram, TikTok, Facebook, and more',
        },
        analytics: {
          name: 'Performance Analytics',
          description: 'Track engagement and optimize your social media strategy',
        },
      },

      // API Configuration
      meta: {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        cacheMaxAge: 3600, // 1 hour cache suggestion
      },
    };

    // Set cache headers for performance
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.setHeader('ETag', `"${Buffer.from(JSON.stringify(brandingConfig)).toString('base64')}"`);

    return res.status(200).json(brandingConfig);
  } catch (error) {
    console.error('Branding API error:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve branding configuration',
    });
  }
}
