import React, { useState } from 'react';
import { Lock, Mail, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { User, PageRoute } from '../types/ecommerce';

interface RegisterPageProps {
  onRegisterSuccess: (user: User) => void;
  onNavigate: (page: PageRoute) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigate
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide your first and last name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept the Terms of Purchase to proceed.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newUser: User = {
        id: `usr-${Date.now()}`,
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        createdAt: new Date().toISOString(),
        loyaltyTier: 'Silver Collector'
      };
      onRegisterSuccess(newUser);
      onNavigate('profile');
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-mono tracking-widest text-stone-400 font-semibold">
          Membership
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
          Create Your Atelier Profile
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed">
          Enjoy streamlined 1-click purchases, private workshop previews, and live courier tracking.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-4 shadow-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Elena"
              required
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 outline-none focus:border-stone-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Rostova"
              required
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 outline-none focus:border-stone-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena@example.com"
              required
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 outline-none focus:border-stone-900"
            />
            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Create Password</label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 outline-none focus:border-stone-900"
            />
            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="space-y-2 pt-1 text-xs text-stone-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={subscribeNewsletter}
              onChange={(e) => setSubscribeNewsletter(e.target.checked)}
              className="rounded text-stone-900"
            />
            <span>Receive limited edition lookbooks & workshop releases</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded text-stone-900"
            />
            <span>I agree to the Terms of Purchase & Privacy Policy</span>
          </label>
        </div>

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
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center text-xs text-stone-500">
        <span>Already have an account? </span>
        <button
          onClick={() => onNavigate('login')}
          className="text-stone-900 font-semibold underline cursor-pointer"
        >
          Sign In
        </button>
      </div>

    </div>
  );
};
