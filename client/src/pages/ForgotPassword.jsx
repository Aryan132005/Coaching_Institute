import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
  const { showToast } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      setSubmitted(true);
      showToast('Reset request submitted successfully!', 'success');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Failed to submit reset request. Please check email.';
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
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Reset Password</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Enter your account email to receive a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs leading-relaxed">
              {message}
            </div>
            <Link
              to="/login"
              className="block w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-center rounded-xl font-bold text-sm hover:opacity-90"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
                  placeholder="student@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-500/20 disabled:opacity-50 text-sm flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Submitting...' : 'Send Reset Link'}</span>
              <Send className="w-4 h-4" />
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center space-x-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 font-bold pt-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
