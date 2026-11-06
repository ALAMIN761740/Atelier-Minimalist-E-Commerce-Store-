import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { User, PageRoute } from '../types/ecommerce';
import { DEMO_USER } from '../data/products';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigate: (page: PageRoute) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigate
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user: User = {
        ...DEMO_USER,
        email: email.trim(),
        firstName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())
      };
      onLoginSuccess(user);
      onNavigate('profile');
    }, 600);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(DEMO_USER);
      onNavigate('profile');
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-mono tracking-widest text-stone-400 font-semibold">
          Client Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
          Sign In to Your Atelier Account
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed">
          Access private previews, order telemetry, and your saved collection wishlist.
        </p>
      </div>

      {/* 1-Tap Quick Demo Login Shortcut */}
      <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="font-semibold text-stone-900 block">Instant Portfolio Demo</span>
            <span className="text-stone-500 text-[11px]">Sign in as Elena Rostova (Verified Client)</span>
          </div>
        </div>

        <button
          onClick={handleDemoLogin}
          className="px-3 py-1.5 bg-stone-900 text-white font-semibold rounded-lg text-[11px] hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
        >
          1-Tap Demo
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-4 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="elena@example.com"
              required
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 outline-none focus:border-stone-900"
            />
            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-stone-700">Password</label>
            <button
              type="button"
              onClick={() => alert("Password reset link sent to registered email.")}
              className="text-[11px] text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
              required
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 outline-none focus:border-stone-900"
            />
            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded text-stone-900"
          />
          <span>Keep me signed in on this device</span>
        </label>

        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Registration */}
      <div className="text-center text-xs text-stone-500">
        <span>Don't have an Atelier account yet? </span>
        <button
          onClick={() => onNavigate('register')}
          className="text-stone-900 font-semibold underline cursor-pointer"
        >
          Create an Account
        </button>
      </div>

    </div>
  );
};
