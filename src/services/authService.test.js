import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, verifyToken } from './authService';
import API from '../api/horseApi';
import { signInWithEmailAndPassword } from 'firebase/auth';

vi.mock('../api/horseApi', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock('../config/firebase', () => ({
  auth: { currentUser: null },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('successfully logs in via custom backend', async () => {
      const mockResponse = {
        data: {
          token: 'mock-token',
          user: { id: 1, email: 'test@example.com' }
        }
      };
      API.post.mockResolvedValueOnce(mockResponse);

      const result = await login('test@example.com', 'password');

      expect(API.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password'
      });
      expect(localStorage.getItem('token')).toBe('mock-token');
      expect(result.success).toBe(true);
      expect(result.data.token).toBe('mock-token');
    });

    it('falls back to Firebase if custom backend fails', async () => {
      // Custom backend fails
      API.post.mockRejectedValueOnce({ response: { status: 401 } });
      
      // Firebase succeeds
      const mockUserCredential = {
        user: { 
          email: 'test@example.com',
          getIdToken: vi.fn().mockResolvedValue('firebase-token')
        }
      };
      vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce(mockUserCredential);

      const result = await login('test@example.com', 'firebase-pass');

      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(localStorage.getItem('token')).toBe('firebase-token');
      expect(result.success).toBe(true);
    });

    it('returns error if both fail', async () => {
      API.post.mockRejectedValueOnce(new Error('Backend Fail'));
      vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce(new Error('Firebase Fail'));

      const result = await login('test@example.com', 'wrong');

      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe('verifyToken', () => {
    it('returns valid if token exists in localStorage', async () => {
      localStorage.setItem('token', 'some-token');
      const result = await verifyToken();
      expect(result.valid).toBe(true);
    });

    it('returns invalid if no token', async () => {
      const result = await verifyToken();
      expect(result.valid).toBe(false);
    });
  });
});
