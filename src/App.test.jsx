import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';
import { GoogleOAuthProvider } from '@react-oauth/google';

describe('App Component', () => {
  it('renders without crashing', () => {
    // The App component might try to render routing logic.
    // In a full environment, memoryRouter might be needed, but since App creates its own Router, it should mount.
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <App />
      </GoogleOAuthProvider>
    );
    
    // We can confidently assume wait/suspense will start or the global layout loads.
    // For a basic smoke test, verifying no unhandled exceptions is enough.
    expect(true).toBe(true);
  });
});
