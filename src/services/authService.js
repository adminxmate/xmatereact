import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  confirmPasswordReset, 
  signInWithPopup, 
  sendEmailVerification,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

// Helper to save minimal info and dispatch event for consistency with old behavior
const dispatchAuthChange = (loggedIn) => {
  window.dispatchEvent(new CustomEvent("auth-state-changed", { detail: { loggedIn } }));
};

export const verifyLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem("token", token);
    dispatchAuthChange(true);
    return { success: true, data: { user: userCredential.user, token } };
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        return { success: false, message: "Invalid credentials" };
    }
    return { success: false, message: error.message || "Login failed" };
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with username
    await updateProfile(userCredential.user, { displayName: username });
    
    // Send email verification with redirect url back to dashboard
    await sendEmailVerification(userCredential.user, {
      url: window.location.origin + '/dashboard'
    });
    
    // Firebase auto signs in upon creation, we can dispatch status or sign them out to enforce verification
    // For now, let's keep them signed in but verification pending
    const token = await userCredential.user.getIdToken();
    localStorage.setItem("token", token);
    dispatchAuthChange(true);
    
    return { success: true, data: userCredential.user };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
        return { success: false, message: "Email is already registered" };
    }
    return { success: false, message: error.message || "Registration failed" };
  }
};

export const requestPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Check your email for the reset link" };
  } catch (error) {
    return { success: false, message: error.message || "Failed to send reset link" };
  }
};

export const resetPassword = async (oobCode, newPassword) => {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
    return { success: true, message: "Password reset successful. You can now login." };
  } catch (error) {
    return { success: false, message: error.message || "Failed to reset password. The link might be expired." };
  }
};

export const loginWithSSO = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem("token", token);
    dispatchAuthChange(true);
    return { success: true, data: { user: userCredential.user, token } };
  } catch (error) {
    return { success: false, message: error.message || "SSO Error" };
  }
};

export const handleSSOCallback = async (code, provider = "google") => {
    // Deprecated with Firebase since we use popup which handles its own callback
    return { success: false, message: "Use loginWithSSO for Firebase popup" };
};

export const verifyToken = async () => {
    // Replaced entirely by onAuthStateChanged in useAuth.js, fallback utility
    const user = auth.currentUser;
    if (user) {
        return { valid: true, user };
    }
    return { valid: false };
}

export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("token");
    dispatchAuthChange(false);
    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed", error);
  }
};
