import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { SEO } from '../components/common/SEO.tsx';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] bg-[#FCFAF7] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <SEO title="Page Not Found | SK Brands" />
      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
        <Compass className="w-8 h-8" />
      </div>
      <span className="text-xs font-semibold tracking-widest text-[#F5B016] uppercase">
        Error 404
      </span>
      <h1 className="font-display text-3xl sm:text-4xl font-normal text-stone-900">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
        The page you are looking for might have been moved or is temporarily unavailable.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-widest rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

