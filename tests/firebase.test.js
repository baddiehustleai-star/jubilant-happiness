import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Firebase modules
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
}));

describe('Firebase Configuration', () => {
  beforeEach(() => {
    // Set up environment variables for testing
    import.meta.env.VITE_FIREBASE_API_KEY = 'test-api-key';
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
    import.meta.env.VITE_FIREBASE_PROJECT_ID = 'test-project';
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID = '123456';
    import.meta.env.VITE_FIREBASE_APP_ID = 'test-app-id';
  });

  it('exports firebase services', async () => {
    const firebase = await import('../src/config/firebase.js');
    
    expect(firebase.auth).toBeDefined();
    expect(firebase.db).toBeDefined();
    expect(firebase.storage).toBeDefined();
  });
});
