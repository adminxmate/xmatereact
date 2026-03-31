# Implementation Plan: Error Boundaries, Lazy Loading, and Testing

This plan outlines the steps to stabilize and optimize the React application by introducing proper error handling, lazy loading for better performance, and a modern testing framework.

## User Review Required

> [!IMPORTANT]  
> Please review this plan. Adding test cases requires installing new development dependencies (Vitest and React Testing Library).

## Proposed Changes

### 1. Build & Testing Configuration

We will introduce **Vitest** (which works seamlessly with Vite) and **React Testing Library** for component testing.

#### [MODIFY] `package.json`
- Add dev dependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom`.
- Add test scripts: `"test": "vitest"`, `"test:ui": "vitest --ui"`, `"coverage": "vitest run --coverage"`.

#### [MODIFY] `vite.config.js`
- Add the `test` property to properly configure Vitest (environment set to `jsdom`, globals set to `true`, and setup files).

#### [NEW] `src/test/setup.js`
- Setup file for testing (e.g., importing `@testing-library/jest-dom`).

---

### 2. Components Layer

We will introduce a robust mechanism for catching rendering errors so the whole app doesn't crash on a single component failure.

#### [MODIFY] `package.json`
- Add dependency: `react-error-boundary` (an industry-standard package for modern functional-component error catching).

#### [NEW] `src/components/GlobalErrorBoundary.jsx`
- A reusable component displaying a user-friendly fallback UI (e.g., "Something went wrong") with an option to refresh the page or try again. 

#### [NEW] `src/components/LoadingFallback.jsx`
- A simple loading spinner to display while lazy-loaded components are being fetched over the network.

---

### 3. Application Routing Layer

We will implement code-splitting using `React.lazy` and `Suspense` to ensure initial bundle sizes remain small.

#### [MODIFY] `src/App.jsx`
- Wrap the entire application tree inside the new `GlobalErrorBoundary`.
- Replace all synchronous page imports (e.g., `import LandingPage from "./pages/LandingPage";`) with lazy imports (e.g., `const LandingPage = React.lazy(() => import("./pages/LandingPage"));`).
- Wrap the `<Routes>` block in a `<React.Suspense>` component, using `LoadingFallback` as the fallback UI.

---

### 4. Testing Layer

We will write foundational tests to ensure our configuration works and critical components render successfully.

#### [NEW] `src/components/GlobalErrorBoundary.test.jsx`
- Test that the fallback UI renders when an error is thrown by a child component.

#### [NEW] `src/App.test.jsx`
- A basic health-check test to ensure the `App` component mounts without crashing.

## Open Questions

> [!WARNING]  
> **1. Global vs Route-level Error Boundaries:** The plan includes a Global Error Boundary. Do you want granular error boundaries applied per-route (so if one page crashes, the user can still navigate using the header), or is global sufficient for now?
> 
> **2. Testing Focus:** After the initial setup, are there specific components or pages (e.g., Auth Modals, HorseData table) you'd like me to focus on creating test cases for right away?

## Verification Plan

### Automated Tests
- Run `npm run test` to execute the newly created tests and verify Vitest and React Testing Library setup is functioning correctly without errors.

### Manual Verification
- Boot up the local dev server (`npm run dev`).
- Navigate through different pages and verify via Network tab that `.js` chunks are being loaded on-demand (lazy loading).
- Temporarily force an error inside a component to verify the `GlobalErrorBoundary` UI appears instead of a blank white screen.
