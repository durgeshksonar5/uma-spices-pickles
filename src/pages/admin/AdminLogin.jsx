import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { businessConfig } from '../../config/businessConfig';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('admin@gajananservices.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden">
      {/* Decorative Warm Accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#9A6428]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A6428] hover:text-[#5E3718] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Website</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E8DDCF] shadow-xl p-6 sm:p-8 space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#5E3718] text-[#F9EFDD] mx-auto flex items-center justify-center shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E3718]">
            {businessConfig.brandName} Admin Panel
          </h1>
          <p className="text-xs text-[#777166]">
            Sign in to access your administrative control panel.
          </p>
        </div>

        {/* Demo Credentials Alert Box */}
        <div className="bg-[#F9EFDD]/60 border border-[#E8DDCF] rounded-2xl p-4 text-xs text-[#5E3718] space-y-1">
          <p className="font-bold flex items-center gap-1">
            <span>🔑 Default Admin Credentials:</span>
          </p>
          <p>Email: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#E8DDCF]">admin@gajananservices.com</code></p>
          <p>Password: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#E8DDCF]">admin123</code></p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
              Admin Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777166]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gajananservices.com"
                className="w-full pl-10 pr-4 py-3 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777166]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#777166] hover:text-[#171717]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-[#9A6428] hover:bg-[#80511D] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Authenticating...</span>
              </span>
            ) : (
              <span>Sign In to Admin Panel</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
