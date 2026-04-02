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
import API from "../api/horseApi";

// Helper to save minimal info and dispatch event for consistency with old behavior
const dispatchAuthChange = (loggedIn) => {
  window.dispatchEvent(new CustomEvent("auth-state-changed", { detail: { loggedIn } }));
};

// 1. Firebase email/password login (if still used)
export const firebaseLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem("token", token);
    dispatchAuthChange(true);
    return { success: true, data: { user: userCredential.user, token } };
  } catch (error) {
    return { success: false, message: error.message || "User Login failed" };
  }
};

// 2. Custom Backend Login
export const login = async (email, password) => {
  // 1. Attempt Firebase Login first (covers SSO reset users)
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem("token", token);
    dispatchAuthChange(true);
    return { success: true, data: { user: userCredential.user, token } };
  } catch (fbError) {
    // 2. Fallback to Custom Backend (covers legacy users)
    try {
      const response = await API.post("/auth/login", { email, password });
      const { token, user } = response.data.data || response.data;
      if (token) {
        localStorage.setItem("token", token);
        dispatchAuthChange(true);
        return { success: true, data: { user, token } };
      }
      return { success: false, message: "No token received" };
    } catch (error) {
      if (error.response?.status === 403) {
        return { success: false, message: "Please verify your email before logging in.", needsVerification: true };
      }
      // Return appropriate error message
      const finalMsg = error.response?.data?.message || fbError.message || "Login failed";
      return { success: false, message: finalMsg };
    }
  }
}

// 3. Custom Backend Signup
export const signup = async (username, email, password) => {
  try {
    const response = await API.post("/auth/signup", { username, email, password });
    return { success: true, data: response.data.data || response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Signup failed" };
  }
}

// 4. Role & Profile Fetch
export const getRole = async () => {
  try {
    const response = await API.get("/auth/role");
    return { success: true, data: response.data.data || response.data }; // Returns { role, id }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export const getUserProfile = async () => {
  try {
    const response = await API.get("/auth/userprofile");
    return { success: true, data: response.data.data || response.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export const registerUser = async (username, email, password) => {
  // Legacy Firebase registration wrapper
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: username });
    await sendEmailVerification(userCredential.user, {
      url: window.location.origin + '/dashboard'
    });
    const token = await userCredential.user.getIdToken();
    localStorage.setItem("token", token);
    dispatchAuthChange(true);
    return { success: true, data: userCredential.user };
  } catch (error) {
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

export const handleSSOCallback = async () => {
  return { success: false, message: "Use loginWithSSO for authentication popup" };
};

export const verifyToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return { valid: true, user };
  }
  const token = localStorage.getItem("token");
  if (token) {
    return { valid: true }; // Minimal check
  }
  return { valid: false };
}

export const resendVerification = async () => {
  try {
    // 1. Try Firebase first if user is logged in via Firebase
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser, {
        url: window.location.origin + '/dashboard'
      });
      return { success: true, message: "Verification email resent." };
    }
    // 2. Fallback to Custom Backend
    const response = await API.post("/auth/resend-verification");
    return { success: true, message: response.data?.message || "Verification email resent via Backend." };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to resend verification."
    };
  }
};

export const logout = async () => {
  try {
    await signOut(auth).catch(() => { }); // Optional catch for Firebase logout
    localStorage.removeItem("token");
    dispatchAuthChange(false);
    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed", error);
  }
};
