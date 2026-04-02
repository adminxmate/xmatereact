import React, { useState, useEffect } from 'react';
import { resetPassword } from '../services/authService';

const ResetPasswordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Firebase sends password resets via link with oobCode parameter
    const params = new URLSearchParams(window.location.search);
    const oobCode = params.get('oobCode');
    const mode = params.get('mode');
    
    let timer;
    if (oobCode && mode === 'resetPassword') {
        timer = setTimeout(() => {
            setIsOpen(true);
            setToken(oobCode);
        }, 0);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const handleOpen = (e) => {
      setIsOpen(true);
      if (e.detail?.token) setToken(e.detail.token);
    };
    window.addEventListener('open-reset-password-modal', handleOpen);
    
    return () => {
        if (timer) clearTimeout(timer);
        window.removeEventListener('open-reset-password-modal', handleOpen);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    const result = await resetPassword(token, password);
    if (result.success) {
      setIsSuccess(true);
      setMessage("Password successfully reset! You can now log into your account.");
    } else {
      setMessage(result.message || "Failed to reset password.");
    }
    setLoading(false);
  };

  const handleGoToLogin = () => {
    setIsOpen(false);
    window.dispatchEvent(
      new CustomEvent("open-login-modal", { detail: { reason: "manual" } })
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative">
        <button 
          onClick={() => setIsOpen(false)} 
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-2"
        >
            ✕
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Reset Password</h2>
        <p className="mt-2 text-sm text-slate-500">
            Enter your new password below.
        </p>

        {isSuccess ? (
          <div className="mt-6 text-center space-y-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-blue-800 font-medium">
                Go back to login page and try to signin with your email and new password.
              </p>
            </div>
            <button 
              onClick={handleGoToLogin}
              className="w-full py-3 px-4 bg-[#e23e44] hover:bg-[#c13238] text-white font-bold rounded-lg transition-colors shadow-lg uppercase italic text-sm"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {message && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {message}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordModal;
