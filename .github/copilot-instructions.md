# Copilot Instructions for Photo2Profit

## Project Overview

Photo2Profit is a full-stack React application with serverless backend functions, built with Vite and TailwindCSS. The project features a luxe rose-gold theme and includes comprehensive CI/CD automation with multi-environment deployment to Firebase Hosting and Google Cloud Run.

## Architecture

### Frontend (React + Vite)

- **Framework**: React 18.3.1 with functional components and hooks
- **Build**: Vite 5.4.1 with ES modules (`"type": "module"`)
- **Styling**: TailwindCSS with custom rose-gold theme + Google Fonts
- **State**: Local component state (useState) - no global state management
- **Deployment**: Firebase Hosting via GitHub Actions

### Backend (Serverless Functions)

- **Runtime**: Node.js serverless functions in `/api/` directory
- **Payment**: Stripe integration for checkout sessions
- **External APIs**: Firebase, Remove.bg, eBay, SendGrid integration points
- **Deployment**: Google Cloud Run via GitHub Actions

## Critical Development Workflows

### Pre-deployment Verification

Always run before any deployment or PR merge:

```bash
npm run verify:deploy
```

This runs the complete verification pipeline: ESLint → Prettier → Vitest → Build. All checks must pass.

### Development Server

```bash
npm run dev    # Starts on localhost:5173 with HMR
```

### Testing Strategy

- **Unit Tests**: Vitest (`npm run test`) - minimal smoke tests currently
- **Integration**: API health checks in `/tests/api.test.js`
- **Manual**: Upload demo component tests file optimization (WebP conversion)

## Code Patterns & Conventions

### React Component Structure

```jsx
// Standard functional component pattern in src/pages/
import React, { useState } from 'react';

export default function ComponentName() {
  const [state, setState] = useState(null);
  // Component logic
  return <div className="tailwind-classes">Content</div>;
}
```

### Serverless API Functions

```javascript
// Pattern for /api/ functions (Vercel/Netlify compatible)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Function logic
}
```

### Custom Tailwind Theme Usage

```jsx
// Use custom color palette consistently:
className = 'bg-blush text-dark'; // Background + text
className = 'bg-rose hover:bg-gold'; // Interactive elements
className = 'text-rose-dark font-diamond'; // Headers with custom font
className = 'font-sans'; // Body text
```

## Configuration & Environment

### Essential Config Files

- `tailwind.config.js` - Custom color palette + font definitions (CommonJS format)
- `eslint.config.js` - Flat config with React plugin + environment-specific rules
- `vite.config.js` - Minimal React plugin configuration
- `.github/workflows/` - CI/CD pipeline definitions

### Environment Variables

Required for production deployment (set in GitHub Secrets):

- `GOOGLE_APPLICATION_CREDENTIALS_JSON` - GCP service account
- `FIREBASE_SERVICE_ACCOUNT` - Firebase deployment credentials
- `STRIPE_SECRET_KEY` - Payment processing
- Optional: `SLACK_WEBHOOK_URL`, API keys for external services

### State Management Pattern

Components use local state with `useState`. Example from `Landing.jsx`:

```jsx
const [showDemo, setShowDemo] = useState(false);
if (showDemo) return <UploadDemo />; // Component switching pattern
```

## Deployment Architecture

### Multi-Environment Setup

1. **Frontend**: Firebase Hosting (static build output)
2. **Backend**: Google Cloud Run (containerized serverless functions)
3. **CI/CD**: GitHub Actions with branch protection on `main`

### Deployment Verification

The `scripts/verify-deploy.js` script provides colored output and comprehensive pre-deployment checks. This pattern ensures deployment readiness and should be extended for new verification needs.

### Quality Gates

- Husky pre-commit hooks run Prettier on staged files
- GitHub Actions CI runs full verification pipeline on PRs
- Branch protection requires passing CI before merge to `main`

## Integration Patterns

### Client-Side File Processing

See `UploadDemo.jsx` for the pattern of client-side image optimization:

- Canvas API for WebP conversion and resizing
- `createObjectURL` for immediate preview
- Graceful fallback when optimization fails

### External Service Integration

- Stripe checkout sessions created via `/api/create-checkout-session.js`
- Firebase integration prepared in dependencies
- API endpoints follow serverless function patterns for multi-platform deployment
