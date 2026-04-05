import { useState, useEffect, useCallback } from "react";
import { logout, getRole, getUserProfile } from "../services/authService";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

let globalAuthCache = null;
let globalAuthPromise = null;

export const clearAuthCache = () => {
  globalAuthCache = null;
  globalAuthPromise = null;
};

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(globalAuthCache?.role || null);
  const [profile, setProfile] = useState(globalAuthCache?.profile || null);
  const [loading, setLoading] = useState(true);

  const fetchAuthDetails = useCallback(async (force = false) => {
    if (force) {
      clearAuthCache();
    }
    if (globalAuthCache && !force) {
      setRole(globalAuthCache.role);
      setProfile(globalAuthCache.profile);
      return;
    }

    if (!globalAuthPromise) {
      globalAuthPromise = (async () => {
        const cacheObj = { role: null, profile: null };
        try {
          const roleRes = await getRole();
          if (roleRes && roleRes.success) {
            cacheObj.role = roleRes.data.role;
          } else {
            alert(`Failed to fetch role: ${roleRes?.message || "No response received"}`);
          }

          const profileRes = await getUserProfile();
          if (profileRes && profileRes.success) {
            cacheObj.profile = profileRes.data;
          } else {
            alert(`Failed to fetch user profile: ${profileRes?.message || "No response received"}`);
          }

          globalAuthCache = cacheObj;
          return cacheObj;
        } catch (error) {
          globalAuthPromise = null;
          alert(`Error fetching auth details: ${error.message || "No response received"}`);
          throw error;
        }
      })();
    }

    try {
      const data = await globalAuthPromise;
      setRole(data.role);
      setProfile(data.profile);
    } catch (e) {
      console.error(e);
    }
  }, []);



  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
    }
    await fetchAuthDetails(true);
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
        const token = localStorage.getItem("token");
        if (token && !auth.currentUser) {
           setIsLoggedIn(true);
           await fetchAuthDetails();
        } else {
           setIsLoggedIn(false);
           setUser(null);
           setRole(null);
           setProfile(null);
           clearAuthCache();
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
        clearAuthCache();
      }
    };

    window.addEventListener("auth-state-changed", handleAuthChange);
    
    return () => {
        unsubscribe();
        window.removeEventListener("auth-state-changed", handleAuthChange);
    }
  }, [fetchAuthDetails]);

  const handleLogout = () => {
    clearAuthCache();
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
