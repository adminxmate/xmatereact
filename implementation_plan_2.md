# Firebase Authentication Migration Plan

As a lead developer, replacing a custom JWT backend with Firebase Authentication is a great move for scalability, security, and reducing maintenance overhead. 

To achieve this **without removing current features**, we will swap out the underlying logic inside your existing `authService.js` file while keeping the React UI components (`LoginModal`, `SignupModal`, etc.) essentially the same. This ensures the user experience remains undisturbed while the engine underneath gets upgraded.

## User Review Required

> [!IMPORTANT]
> This is a core architectural change affecting how users log in and how your Node backend will eventually verify those users. Please review the strategy below. 

## Proposed Changes

### 1. Project Configuration
- **Install Dependency:** Add `firebase` to the project via npm.
- **Cleanup:** Remove `@react-oauth/google` as Firebase handles Google SSO natively.

#### [NEW] `src/config/firebase.js`
Create the Firebase initialization file using credentials loaded from your `.env` file (which you'll need to provide from your Firebase Console).

---

### 2. Core Service Layer Modification

We will completely rewrite `src/services/authService.js` so that the React components don't know the difference, but the API calls are routed to Firebase.

#### [MODIFY] `src/services/authService.js`
- **`verifyLogin`**: Replace `axios.post` with Firebase `signInWithEmailAndPassword()`.
- **`registerUser`**: Replace `axios.post` with Firebase `createUserWithEmailAndPassword()`. 
  - *New Feature:* Immediately call `sendEmailVerification()` after creation.
  - *New Feature:* Call `updateProfile()` to securely save the `username` to the Firebase user object.
- **SSO Login**: Replace the custom SSO callback flow with Firebase `signInWithPopup(auth, googleProvider)`.
- **`requestPasswordReset`**: Replace with Firebase `sendPasswordResetEmail()`.
- **`resetPassword`**: Replace with Firebase `confirmPasswordReset()` using the `oobCode` from the email link.
- **`logout`**: Call Firebase `signOut(auth)`.
- **JWT Handling**: After successful login, fetch the Firebase ID Token (`user.getIdToken()`) and save it to `localStorage`. This ensures that if your Node.js backend needs to fetch private horse data, it still receives a standard Bearer token in the headers.

---

### 3. Application State & UI Hook Modifications

#### [MODIFY] `src/hooks/useAuth.js`
- Currently, this performs a polling style `verifyToken()` on load. We will upgrade this to subscribe to Firebase's realtime `onAuthStateChanged()` listener. This makes your app's login state instantly reactive across tabs.

#### [MODIFY] `src/components/LoginModal.jsx`
- Remove the `<useGoogleLogin>` hook logic.
- Wire the generic "Sign in with Google" button directly to the updated Firebase SSO function in `authService`.

#### [MODIFY] `src/components/SignupModal.jsx`
- Handle Firebase-specific error codes (e.g., `auth/email-already-in-use`).
- On successful signup, show a message: "Account created! Please check your email to verify your account."

#### [MODIFY] `src/components/ResetPasswordModal.jsx`
- Update the component to read Firebase's `oobCode` query parameter from the URL instead of the generic `token` parameter.

---

## Open Questions

> [!WARNING]  
> 1. **Backend Integration:** Passing Firebase tokens to a Node.js backend requires the backend to use the `firebase-admin` SDK to verify the token. Are you already planning/working on updating the Node API to accept Firebase tokens, or do we need to formulate a plan for the backend later?
> 2. **Firebase Config:** I will set up the code to use `import.meta.env.VITE_FIREBASE_API_KEY` etc. Do you have a Firebase Project created to plug these environment variables in once we're done?

## Verification Plan
### Manual Verification
Once implemented, we will verify by:
1. Creating a new user via the Signup modal and ensuring the Verification Email arrives in the inbox.
2. Logging in via Google SSO and ensuring the dashboard loads.
3. Checking `localStorage` to ensure the `token` is being saved correctly for outgoing backend requests.
