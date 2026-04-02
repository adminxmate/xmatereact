import { useState, useEffect } from "react";
import { logout, getRole, getUserProfile } from "../services/authService";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAuthDetails = async () => {
    const roleRes = await getRole();
    if (roleRes.success) {
      setRole(roleRes.data.role);
    }
    const profileRes = await getUserProfile();
    if (profileRes.success) {
      setProfile(profileRes.data);
    }
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
    }
    await fetchAuthDetails();
  };

  useEffect(() => {
    // 1. Listen to Firebase SSO
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        setUser(currentUser);
        await fetchAuthDetails();
      } else {
        // ... (existing localStorage check)
        const token = localStorage.getItem("token");
        if (token && !auth.currentUser) {
           setIsLoggedIn(true);
           await fetchAuthDetails();
        } else {
           setIsLoggedIn(false);
           setUser(null);
           setRole(null);
           setProfile(null);
        }
      }
      setLoading(false);
    });

    const handleAuthChange = async (e) => {
      if (e.detail?.loggedIn) {
        setIsLoggedIn(true);
        await fetchAuthDetails();
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setRole(null);
        setProfile(null);
      }
    };

    window.addEventListener("auth-state-changed", handleAuthChange);
    
    return () => {
        unsubscribe();
        window.removeEventListener("auth-state-changed", handleAuthChange);
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  // Helper flags
  const is_admin = role === "admin";
  const is_owner = role === "owner";
  const is_trainer = role === "trainer";
  // Check both Firebase and Profile backends for verification status
  const is_verified = user?.emailVerified || profile?.is_verified || profile?.email_verified || false;
  
  // 14-day window logic
  let daysSinceCreation = 0;
  if (profile?.created_at) {
      const created = new Date(profile.created_at);
      const now = new Date();
      daysSinceCreation = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  }
  const needs_verification_warning = !is_verified && daysSinceCreation <= 14;
  const is_suspended = !is_verified && daysSinceCreation > 14;

  return { 
    isLoggedIn, 
    user, 
    role, 
    profile, 
    loading,
    is_admin,
    is_owner,
    is_trainer,
    is_verified,
    needs_verification_warning,
    is_suspended,
    refreshUser,
    logout: handleLogout 
  };
};
