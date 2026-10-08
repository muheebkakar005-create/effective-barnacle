import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { SEO } from '../components/common/SEO.tsx';
import { SKBrandLogo } from '../components/common/SKBrandLogo.tsx';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await login({ email, password });
    setIsLoading(false);

    if (res.success) {
      showToast('Welcome back to SK Brands!', 'success');
      navigate(from, { replace: true });
    } else {
      setError(res.message || 'Invalid email or password.');
    }
  };

  const handleDemoCustomer = () => {
    setEmail('ayesha.malik@example.com');
    setPassword('customer123');
  };

  const handleDemoAdmin = () => {
    setEmail('admin@skbrands.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] py-12 sm:py-20 flex items-center justify-center px-4">
      <SEO title="Sign In | SK Brands" />

      <div className="w-full max-w-md bg-white rounded-xl border border-stone-200 p-8 shadow-sm">
        <div className="text-center space-y-2 mb-8">
          <div className="flex justify-center mb-1">
            <SKBrandLogo size="md" showText={true} />
          </div>
          <h1 className="font-display text-xl text-stone-800 pt-1">
            Welcome to Your Account
          </h1>
          <p className="text-xs text-stone-500">
            Sign in to track orders, manage addresses, and access VIP previews.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-300 rounded text-rose-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-stone-50 border border-stone-300 rounded pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-black font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className="w-full bg-stone-50 border border-stone-300 rounded pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-stone-900 hover:bg-black text-white font-semibold text-xs tracking-[0.2em] uppercase rounded transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#F5B016]" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Accounts One-Click Fill */}
        <div className="mt-6 pt-6 border-t border-stone-100 space-y-2">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block text-center">
            One-Click Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={handleDemoCustomer}
              className="p-2 border border-stone-200 hover:border-black rounded bg-stone-50 text-stone-800 font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F5B016]" />
              Customer Demo
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="p-2 border border-stone-200 hover:border-black rounded bg-stone-50 text-stone-800 font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#F5B016]" />
              Admin Portal
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-stone-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-black hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

