import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, HeartHandshake } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CtaBanner = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-950 via-slate-900 to-accent-950 border border-brand-500/30 p-8 sm:p-14 text-center shadow-2xl">
          {/* Background Food Rescue Image Accent */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
            <img
              src="/hero-bg.jpg"
              alt=""
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-slate-950/80 to-accent-950/90" />
          </div>

          {/* Glowing Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full filter blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready to Make an Impact?</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight">
              Start Rescuing Surplus Food in Your City Today
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Join hundreds of restaurants, food banks, and volunteers working together to eradicate food hunger while safeguarding our planet.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to={isAuthenticated ? '/donate' : '/register'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-xl shadow-brand-500/30 hover:scale-[1.02] transition-all"
              >
                <span>{isAuthenticated ? 'Donate Surplus Food' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={isAuthenticated ? '/chat' : '/login'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-base border border-white/20 backdrop-blur-md transition-all"
              >
                <HeartHandshake className="w-5 h-5 text-brand-400" />
                <span>{isAuthenticated ? 'Ask Food Advisor AI' : 'Sign In'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
