import React, { useState, useEffect } from 'react';
import { verifyLogin } from '../services/authService';

const LoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openReason, setOpenReason] = useState(null);
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', password: '' });

  useEffect(() => {
    const handleOpen = (e) => {
      setIsOpen(true);
      setOpenReason(e.detail?.reason || "auto");
    };
    window.addEventListener('open-login-modal', handleOpen);
    return () => window.removeEventListener('open-login-modal', handleOpen);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await verifyLogin(form.username, form.password);

    if (result.success) {
      setIsOpen(false);
      setForm({ username: '', password: '' });
      setOpenReason(null);
    } else {
      setError(result.message);
    }
    setLoading(false);
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
          <p className="mt-2 text-sm text-slate-500">Authentication Required. Please log in to continue.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Username</label>
              <input
                type="text"
                required
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
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

            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
