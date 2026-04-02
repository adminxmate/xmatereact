import React, { useState, useEffect } from 'react';
import { requestPasswordReset } from '../services/authService';
import { validateEmail } from '../utils/validation';

const ForgotPasswordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleOpen = (e) => {
      setIsOpen(true);
      if (e.detail?.email) setEmail(e.detail.email);
    };
    window.addEventListener('open-forgot-password-modal', handleOpen);
    return () => window.removeEventListener('open-forgot-password-modal', handleOpen);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { valid, message: validationMsg, sanitized } = validateEmail(email);
    if (!valid) {
      setMessage(validationMsg);
      setLoading(false);
      return;
    }

    const result = await requestPasswordReset(sanitized);
    setMessage(result.message || (result.success ? "Check your email for reset link." : "Failed to send reset link."));
    setLoading(false);
  };

  const handleReturnToLogin = () => {
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
        <h2 className="text-2xl font-bold">Forgot Password</h2>
        {message && !message.toLowerCase().includes('failed') && !message.toLowerCase().includes('valid') ? (
          <div className="mt-6 text-center space-y-6">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <p className="text-green-800 font-medium">{message}</p>
            </div>
            <p className="text-slate-500 text-sm">
              Please check your inbox (and spam folder) for further instructions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {message && (
              <div className="text-sm p-3 rounded-lg border text-red-600 bg-red-50 border-red-100">
                {message}
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold rounded-lg shadow-lg">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleReturnToLogin}
              className="text-sm text-slate-500 hover:text-blue-600 font-semibold"
            >
              ← Back to Login
            </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
