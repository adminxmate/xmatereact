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
    
    if (oobCode && mode === 'resetPassword') {
        setIsOpen(true);
        setToken(oobCode);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const handleOpen = (e) => {
      setIsOpen(true);
      if (e.detail?.token) setToken(e.detail.token);
    };
    window.addEventListener('open-reset-password-modal', handleOpen);
    return () => window.removeEventListener('open-reset-password-modal', handleOpen);
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
        <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3">✕</button>
        <h2 className="text-2xl font-bold">Reset Password</h2>
        {isSuccess ? (
          <div className="mt-6 text-center space-y-6">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <p className="text-green-800 font-medium">{message}</p>
            </div>
            <button 
              onClick={handleGoToLogin}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              Log In With New Password
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              required
              className="w-full px-4 py-3 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
            />
            <input
              type="password"
              required
              className="w-full px-4 py-3 border rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
            {message && <div className="text-sm text-red-600">{message}</div>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-green-600 hover:bg-green-700 transition-colors text-white font-bold rounded-lg">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordModal;
