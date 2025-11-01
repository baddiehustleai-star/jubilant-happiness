import { describe, it, expect } from 'vitest';

describe('Firebase and Stripe Integration', () => {
  it('should export firebase config modules', async () => {
    const firebaseModule = await import('../src/config/firebase.js');
    // Module should have these exports even if they're undefined
    expect(firebaseModule).toHaveProperty('auth');
    expect(firebaseModule).toHaveProperty('db');
    expect(firebaseModule).toHaveProperty('storage');
  });

  it('should export stripe promise', async () => {
    const stripeModule = await import('../src/config/stripe.js');
    // Module should have this export even if it's undefined
    expect(stripeModule).toHaveProperty('stripePromise');
  });

  it('should export storage utilities', async () => {
    const { uploadPhoto, uploadMultiplePhotos } = await import('../src/utils/storage.js');
    expect(typeof uploadPhoto).toBe('function');
    expect(typeof uploadMultiplePhotos).toBe('function');
  });
});

describe('Components', () => {
  it('should export PhotoUpload component', async () => {
    const PhotoUpload = await import('../src/components/PhotoUpload.jsx');
    expect(PhotoUpload.default).toBeDefined();
  });

  it('should export Billing component', async () => {
    const Billing = await import('../src/components/Billing.jsx');
    expect(Billing.default).toBeDefined();
  });

  it('should export Landing page', async () => {
    const Landing = await import('../src/pages/Landing.jsx');
    expect(Landing.default).toBeDefined();
  });
});
