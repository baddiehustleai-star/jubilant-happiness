import { describe, it, expect } from 'vitest';
import firebaseConfig, { isFirebaseConfigured } from '../src/firebase.js';

describe('Firebase Configuration', () => {
  it('should have all required config keys', () => {
    expect(firebaseConfig).toHaveProperty('apiKey');
    expect(firebaseConfig).toHaveProperty('authDomain');
    expect(firebaseConfig).toHaveProperty('projectId');
    expect(firebaseConfig).toHaveProperty('storageBucket');
    expect(firebaseConfig).toHaveProperty('messagingSenderId');
    expect(firebaseConfig).toHaveProperty('appId');
  });

  it('should return false when Firebase is not configured', () => {
    // In test environment, env vars are not set, so this should return false
    expect(isFirebaseConfigured()).toBe(false);
  });

  it('should handle empty configuration values', () => {
    expect(firebaseConfig.apiKey).toBe('');
    expect(firebaseConfig.authDomain).toBe('');
  });
});
