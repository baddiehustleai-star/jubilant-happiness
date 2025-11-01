# Dashboard Implementation Guide

## Overview

This document provides instructions for using the newly implemented Dashboard feature for Photo2Profit.

## Features Implemented

### 1. User Dashboard (`/dashboard`)

- **Welcome Section**: Personalized greeting with user instructions
- **Statistics Cards**: Real-time tracking of:
  - Total Listings
  - Active Posts
  - Total Revenue
- **Photo Upload**: Drag-and-drop interface for uploading product photos
  - Supports PNG, JPG, JPEG formats
  - File validation (images only)
  - Visual feedback during drag operations
  - Photo preview with remove functionality
- **Subscription Card**: Premium plan promotion with pricing

### 2. Navigation

- React Router integration for seamless page transitions
- Navigation between Landing page and Dashboard
- Responsive header with logo and navigation links

### 3. Firebase Configuration

- Firebase configuration file ready for integration
- Environment variable support (Vite-compatible)
- Configuration validation helper function

## Usage

### Starting the Application

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the landing page.
Click "Start Now" to navigate to the Dashboard.

### Uploading Photos

1. Navigate to `/dashboard`
2. Use the upload section in one of two ways:
   - **Drag and Drop**: Drag image files into the dashed border area
   - **Click to Upload**: Click "Click to upload" to select files from your device
3. Uploaded photos will appear in a grid below the upload area
4. Remove photos by hovering and clicking the × button

### Environment Setup (Optional)

To enable Firebase integration:

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. To fully integrate Firebase SDK:

   ```bash
   npm install firebase
   ```

   Then update `src/firebase.js` to import and initialize Firebase SDK.

## Design System

The Dashboard follows the existing Photo2Profit design system:

- **Color Palette**: Rose-gold theme (blush, rose, gold)
- **Typography**: Cinzel Decorative for headings, Montserrat for body text
- **Components**: Consistent with luxe, elegant aesthetic

## Testing

Run tests to ensure everything works:

```bash
npm test
```

Tests cover:

- Dashboard file upload logic
- Firebase configuration validation
- Basic functionality smoke tests

## Next Steps

To extend the Dashboard functionality:

1. **Connect to Firebase**: Install Firebase SDK and complete the integration
2. **Add Authentication**: Implement user sign-up/sign-in
3. **Photo Storage**: Upload photos to Firebase Storage
4. **AI Integration**: Connect to AI services for listing generation
5. **Stripe Integration**: Implement payment processing for premium features
6. **Backend Functions**: Add Cloud Functions for serverless operations

## File Structure

```
src/
  pages/
    Landing.jsx       # Home page with CTA
    Dashboard.jsx     # Main dashboard with upload & stats
  firebase.js         # Firebase configuration
  main.jsx           # App entry with routing
  index.css          # Global styles

tests/
  dashboard.test.js   # Dashboard unit tests
  firebase.test.js    # Firebase config tests
```

## Support

For questions or issues, refer to the main README.md or contact support.
