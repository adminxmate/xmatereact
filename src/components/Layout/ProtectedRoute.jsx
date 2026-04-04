import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyToken } from "../../services/authService.js"; // same folder

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await verifyToken();
      setIsValid(result.valid);
    };
    checkAuth();
  }, []);

  if (isValid === null) {
    return (
      <div className="min-h-screen bg-[#333538] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin animate-shake"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Authenticating...</p>
        </div>
      </div>
    );
  }

  return isValid ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
