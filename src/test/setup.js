import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase to avoid "invalid-api-key" errors during tests
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
    onAuthStateChanged: vi.fn((auth, cb) => {
      // Transition to non-loading state immediately in tests
      cb(null);
      return () => {};
    }),
  })),
  onAuthStateChanged: vi.fn((auth, cb) => {
    cb(null);
    return () => {};
  }),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));
