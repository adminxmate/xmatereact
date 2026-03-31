import { useState, useEffect } from "react";
import { logout } from "../services/authService";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase realtime listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
        setUser(currentUser);
        // Refresh token in local storage on changes
        const token = await currentUser.getIdToken();
        localStorage.setItem("token", token);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("token");
      }
    });

    // Keeping custom event for immediate UI updates if triggered elsewhere
    const handleAuthChange = (e) => {
      if (!e.detail?.loggedIn) {
        setIsLoggedIn(false);
        setUser(null);
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

  return { isLoggedIn, user, logout: handleLogout };
};
