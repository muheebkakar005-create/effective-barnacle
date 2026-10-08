import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { SEO } from '../../components/common/SEO.tsx';
import { SKBrandLogo } from '../../components/common/SKBrandLogo.tsx';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('admin@skbrands.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await login({ email, password });
    setIsLoading(false);

    if (res.success) {
      showToast('Admin session authenticated.', 'success');
      navigate('/admin');
    } else {
      setError(res.message || 'Access denied. Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 font-sans">
      <SEO title="Admin Login | SK Brands" />

      <div className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-2xl p-8 shadow-2xl text-white">
        <div className="text-center space-y-3 mb-8">
          <div className="flex justify-center mb-1">
            <SKBrandLogo size="lg" light={true} stacked={true} />
          </div>
          <h1 className="text-sm font-semibold text-[#F5B016] uppercase tracking-widest pt-2">
            Executive Admin Portal
          </h1>
          <p className="text-xs text-stone-400">
            Store management, inventory & dispatch portal for SK Brand Sami Khan.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-950/60 border border-rose-500/40 rounded text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5B016]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5B016]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#F5B016] hover:bg-[#a68453] text-white font-semibold text-xs tracking-widest uppercase rounded transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Authorizing...
              </>
            ) : (
              <>
                Enter Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-800/80 text-center text-xs text-stone-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F5B016]" />
          <span>Demo Credentials: admin@skbrands.com / admin123</span>
        </div>
      </div>
    </div>
  );
};

