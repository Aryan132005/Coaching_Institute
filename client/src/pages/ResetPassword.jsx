import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      showToast('Password reset successful! Please log in.', 'success');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Invalid or expired password reset link.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 px-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 p-3 rounded-2xl mb-1">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Choose New Password</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Set your new account password credentials below.
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs flex items-start space-x-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>Password reset successful! You can now sign in using your new credentials.</span>
            </div>
            <Link
              to="/login"
              className="block w-full py-3 bg-primary-600 hover:bg-primary-700 text-white text-center rounded-xl font-bold text-sm shadow-md transition-colors"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-rose-600 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                New Password (min. 6 chars)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-500/20 disabled:opacity-50 text-sm flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Updating Password...' : 'Save and Update'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;
