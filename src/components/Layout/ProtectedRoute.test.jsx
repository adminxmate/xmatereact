import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { verifyToken } from '../../services/authService';

vi.mock('../../services/authService', () => ({
  verifyToken: vi.fn(),
  auth: { currentUser: null },
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children if authenticated', async () => {
    // Mock successful authentication
    vi.mocked(verifyToken).mockResolvedValueOnce({ valid: true });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/" element={<div>Root Page</div>} />
          <Route path="/protected" element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    // Initial state is "isValid === null", so it shows the loader
    expect(screen.getByText(/Authenticating.../i)).toBeInTheDocument();

    // After async useEffect, it should show content
    const content = await screen.findByText(/Protected Content/i);
    expect(content).toBeInTheDocument();
  });

  it('redirects to root if not authenticated', async () => {
    // Mock failed authentication
    vi.mocked(verifyToken).mockResolvedValueOnce({ valid: false });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/" element={<div>Root Page</div>} />
          <Route path="/protected" element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    // Initial state is "isValid === null", so it shows the loader
    expect(screen.getByText(/Authenticating.../i)).toBeInTheDocument();

    // After async useEffect, it should redirect to root
    const rootPage = await screen.findByText(/Root Page/i);
    expect(rootPage).toBeInTheDocument();
    expect(screen.queryByText(/Protected Content/i)).not.toBeInTheDocument();
  });
});
