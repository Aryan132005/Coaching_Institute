import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Mail, Lock, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const res = await login(formData.email, formData.password);
    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Access Denied: You do not have administrator privileges');
      }
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6 text-white relative overflow-hidden">
        {/* Background graphic */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-primary-600/10 blur-[40px] rounded-full"></div>

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex bg-primary-950/60 border border-primary-500/30 text-primary-400 p-3.5 rounded-2xl mb-1">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Admin Console</h2>
          <p className="text-slate-400 text-xs">
            Authenticate to manage programs, review admissions, and announcements.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/30 text-rose-400 text-xs font-semibold relative z-10">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-white placeholder-slate-600"
                placeholder="admin@coaching.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Admin Secret Key</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-white placeholder-slate-600"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-500/20 disabled:opacity-50 text-sm flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Panel'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
