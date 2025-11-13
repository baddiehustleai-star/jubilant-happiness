import { describe, it, expect, vi } from 'vitest';

// Mock Firebase modules before importing firebase.js
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: 'mock-app' })),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ type: 'auth' })),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({ type: 'firestore' })),
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({ type: 'storage' })),
}));

describe('Firebase Configuration', () => {
  it('exports auth service', async () => {
    const { auth } = await import('../src/firebase.js');
    expect(auth).toBeDefined();
    expect(auth.type).toBe('auth');
  });

  it('exports db (firestore) service', async () => {
    const { db } = await import('../src/firebase.js');
    expect(db).toBeDefined();
    expect(db.type).toBe('firestore');
  });

  it('exports storage service', async () => {
    const { storage } = await import('../src/firebase.js');
    expect(storage).toBeDefined();
    expect(storage.type).toBe('storage');
  });

  it('exports default app instance', async () => {
    const firebaseModule = await import('../src/firebase.js');
    expect(firebaseModule.default).toBeDefined();
    expect(firebaseModule.default.name).toBe('mock-app');
  });
});
