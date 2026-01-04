import React, { useState, useEffect } from 'react';
import { registerUser } from '../services/authService'; // Assuming this exists
import { validateEmail } from '../utils/validation';

const SignupModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const handleOpen = (e) => {
      setIsOpen(true);
      // Pre-fill email if passed from Landing Page or Login Modal
      if (e.detail?.email) {
        setForm(prev => ({ ...prev, email: e.detail.email }));
      }
    };

    window.addEventListener('open-signup-modal', handleOpen);
    return () => window.removeEventListener('open-signup-modal', handleOpen);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Logic Validation
    const { valid, message, sanitized } = validateEmail(form.email);
    if (!valid) {
      setError(message);
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    // 2. Service Call
    const result = await registerUser(sanitized, form.password);

    if (result.success) {
      setIsOpen(false);
      setForm({ email: '', password: '', confirmPassword: '' });
      // Usually, you'd auto-login the user or show a success message here
    } else {
      setError(result.message || "Registration failed. Try again.");
    }
    setLoading(false);
  };

  const handleSwitchToLogin = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('open-login-modal', { 
      detail: { email: form.email, reason: "manual" } 
    }));
  };

  const handleClose = () => {
    setIsOpen(false);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden relative">
        
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-2"
        >
          ✕
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
          <p className="mt-2 text-sm text-slate-500">Join us to start searching our database.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
              <input
                type="email"
                required
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
              <input
                type="password"
                required
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Confirm Password</label>
              <input
                type="password"
                required
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>

            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <button 
                onClick={handleSwitchToLogin}
                className="text-blue-600 font-semibold hover:underline"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;