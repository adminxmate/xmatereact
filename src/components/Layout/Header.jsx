import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-black/10">
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

      <div className="flex gap-6 text-[13px] font-bold">
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
      </div>
    </nav>
  );
};

export default Header;
