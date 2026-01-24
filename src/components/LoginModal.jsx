import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyLogin } from "../services/authService.js";
import { validateEmail } from "../utils/validation";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icons

const LoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openReason, setOpenReason] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const [showPassword, setShowPassword] = useState(false); // NEW state

  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = (e) => {
      setIsOpen(true);
      setOpenReason(e.detail?.reason || "auto");
      if (e.detail?.email) {
        setForm((prev) => ({ ...prev, email: e.detail.email }));
      }
    };
    window.addEventListener("open-login-modal", handleOpen);
    return () => window.removeEventListener("open-login-modal", handleOpen);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { valid, message, sanitized } = validateEmail(form.email);
    if (!valid) {
      setError(message);
      setLoading(false);
      return;
    }

    const result = await verifyLogin(sanitized, form.password);

    if (result.success) {
      setIsOpen(false);
      setForm({ email: "", password: "" });
      setOpenReason(null);

      window.dispatchEvent(
        new CustomEvent("auth-state-changed", {
          detail: { loggedIn: true },
        })
      );

      navigate("/dashboard", { replace: true });
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleSwitchToSignup = () => {
    setIsOpen(false);
    window.dispatchEvent(
      new CustomEvent("open-signup-modal", {
        detail: { email: form.email, reason: "manual" },
      })
    );
  };

  const handleForgotPassword = () => {
    setIsOpen(false);
    window.dispatchEvent(
      new CustomEvent("open-forgot-password-modal", {
        detail: { email: form.email },
      })
    );
  };

  const handleClose = () => {
    setIsOpen(false);
    setOpenReason(null);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden relative">
        {openReason === "manual" && (
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}

        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
          <p className="mt-2 text-sm text-slate-500">
            Authentication Required. Please log in to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-slate-600">
              Want to register a new account?{" "}
              <button
                onClick={handleSwitchToSignup}
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
            {/* <p className="text-sm text-slate-600">
              Forgot your password?{" "}
              <button
                onClick={handleForgotPassword}
                className="text-blue-600 font-semibold hover:underline"
              >
                Reset Password
              </button>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
