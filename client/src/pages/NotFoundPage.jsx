import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md glass-card p-10 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 p-1 border border-brand-500/20 shadow-lg shadow-brand-500/10 flex items-center justify-center mx-auto overflow-hidden">
          <img src="/logo.png" alt="Replate Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-4xl font-black font-display text-slate-900 dark:text-white">404</h1>
        <p className="text-sm text-slate-500">
          The page you are looking for does not exist or has been relocated.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};
