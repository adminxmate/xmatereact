import React, { useState, useEffect } from 'react';
import { resetPassword } from '../services/authService';

const ResetPasswordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
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
    setMessage(result.message || (result.success ? "Password reset successful." : "Failed to reset password."));
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative">
        <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3">✕</button>
        <h2 className="text-2xl font-bold">Reset Password</h2>
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
          <button type="submit" disabled={loading} className="w-full py-3 bg-green-600 text-white rounded-lg">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
