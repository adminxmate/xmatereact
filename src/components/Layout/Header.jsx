import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout, verifyToken } from "../../services/authService.js";
import { Menu, X } from "lucide-react"; // icons for hamburger

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const checkAuth = async () => {
      const result = await verifyToken();
      setIsLoggedIn(result.valid);
    };
    checkAuth();

    const handleAuthChange = async () => {
      const result = await verifyToken();
      setIsLoggedIn(result.valid);
    };

    window.addEventListener("auth-state-changed", handleAuthChange);
    return () => window.removeEventListener("auth-state-changed", handleAuthChange);
  }, []);

  const navLinks = (
    <>
      <button
        onClick={() => navigate("/")}
        className={`uppercase ${
          isActive("/") ? "text-[#e23e44]" : "hover:text-gray-400"
        }`}
      >
        Home
      </button>

      <button
        onClick={() => navigate("/plans")}
        className={`uppercase ${
          isActive("/plans") ? "text-[#e23e44]" : "hover:text-gray-400"
        }`}
      >
        Pricing
      </button>

      {isLoggedIn ? (
        <>
          <button
            onClick={() => navigate("/dashboard")}
            className={`uppercase ${
              isActive("/dashboard") ? "text-[#e23e44]" : "hover:text-gray-400"
            }`}
          >
            Dashboard
          </button>
          <button onClick={logout} className="uppercase hover:text-gray-400">
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("open-login-modal", { detail: { reason: "manual" } })
            );
          }}
          className={`uppercase ${
            isActive("/login") ? "text-[#e23e44]" : "hover:text-gray-400"
          }`}
        >
          Login
        </button>
      )}
    </>
  );

  return (
    <nav className="w-full bg-black/10 px-6 py-4">
      <div className="flex justify-between items-center">
        <div
          className="cursor-pointer flex items-center"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo-light-50.png"
            alt="X-MATE Logo"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span className="text-2xl font-black italic tracking-tighter ml-2">
            X-MATE
          </span>
        </div>
        <div className="hidden md:flex gap-6 text-[13px] font-bold">
          {navLinks}
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-[13px] font-bold">
          {navLinks}
        </div>
      )}
    </nav>
  );
};

export default Header;
