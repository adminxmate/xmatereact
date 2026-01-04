import { useState, useEffect } from "react";
import { verifyToken, logout } from "../services/authService";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await verifyToken();
      if (result.valid) {
        setIsLoggedIn(true);
        setUser(result.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkAuth();

    const handleAuthChange = (e) => {
      setIsLoggedIn(e.detail?.loggedIn || false);
      if (!e.detail?.loggedIn) {
        setUser(null);
      } else {
        checkAuth();
      }
    };

    window.addEventListener("auth-state-changed", handleAuthChange);
    return () => window.removeEventListener("auth-state-changed", handleAuthChange);
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  return { isLoggedIn, user, logout: handleLogout };
};
