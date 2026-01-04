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
    return <div>Loading...</div>; // spinner while verifying
  }

  return isValid ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
