/**
 * Security configuration for Photo2Profit
 *
 * This file contains security headers and CSP policies for production deployment.
 * These should be implemented at the server/hosting level.
 */

export const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://*.firebase.googleapis.com https://*.firebaseio.com https://vitals.vercel-insights.com",
    'frame-src https://js.stripe.com',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; '),

  // Security headers
  'X-DNS-Prefetch-Control': 'off',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

  // HTTPS enforcement
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

/**
 * Firebase Hosting security configuration
 * Add to firebase.json hosting section
 */
export const firebaseSecurityConfig = {
  headers: Object.entries(securityHeaders).map(([key, value]) => ({
    source: '**',
    headers: [{ key: key, value: value }],
  })),
};

/**
 * Vercel security configuration
 * Add to vercel.json
 */
export const vercelSecurityConfig = {
  headers: [
    {
      source: '/(.*)',
      headers: Object.entries(securityHeaders).map(([key, value]) => ({
        key: key,
        value: value,
      })),
    },
  ],
};

/**
 * Netlify security configuration
 * Add to _headers file or netlify.toml
 */
export const netlifyHeaders = Object.entries(securityHeaders)
  .map(([key, value]) => `  ${key}: ${value}`)
  .join('\n');

export const netlifySecurityConfig = `/*\n${netlifyHeaders}`;

export default securityHeaders;
