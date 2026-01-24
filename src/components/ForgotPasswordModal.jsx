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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative">
        <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3">✕</button>
        <h2 className="text-2xl font-bold">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            className="w-full px-4 py-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {message && <div className="text-sm text-red-600">{message}</div>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
