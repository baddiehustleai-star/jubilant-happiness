# Photo2Profit Security Configuration Examples

This directory contains security configurations for various deployment platforms.

## Firebase Hosting

Add to your `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [
      {
        "source": "**",
        "headers": [
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "Referrer-Policy", "value": "origin-when-cross-origin" },
          { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
          {
            "key": "Content-Security-Policy",
            "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.stripe.com https://*.firebase.googleapis.com https://*.firebaseio.com https://vitals.vercel-insights.com; frame-src https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests"
          }
        ]
      }
    ]
  }
}
```

## Vercel

Add to your `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.stripe.com https://*.firebase.googleapis.com https://*.firebaseio.com https://vitals.vercel-insights.com; frame-src https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests"
        }
      ]
    }
  ]
}
```

## Netlify

Create a `public/_headers` file:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.stripe.com https://*.firebase.googleapis.com https://*.firebaseio.com https://vitals.vercel-insights.com; frame-src https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests
```

## Security Notes

- These headers help prevent XSS, clickjacking, and other common web vulnerabilities
- The CSP allows necessary external resources (Stripe, Google Fonts, Firebase, Vercel Analytics)
- Update the CSP if you add new external services
- Test thoroughly after implementing to ensure functionality isn't broken
