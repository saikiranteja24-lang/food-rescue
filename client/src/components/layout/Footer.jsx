import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Send, ShieldCheck, Sparkles, CheckCircle, Github, Twitter, Linkedin } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    showToast('Subscribed to Replate Food Rescue updates! 🌱', 'success');
    setEmail('');
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070b14] text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col (2 cols wide on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 p-0.5 border border-brand-500/20 shadow-md shadow-brand-500/10 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                <img src="/logo.png" alt="Replate Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <span className="text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight group-hover:text-brand-500 transition-colors">
                Replate<span className="text-brand-500">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-slate-600 dark:text-slate-400">
              The digital ecosystem bridging food donors, community kitchens, and verified shelters.
              Powered by Groq High-Speed AI for real-time food safety and surplus matching.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
                <span>All Systems Operational • Groq AI Active</span>
              </div>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/donations" className="hover:text-brand-500 transition-colors">
                  Surplus Feed
                </Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-brand-500 transition-colors">
                  List Leftover Food
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-brand-500 transition-colors flex items-center gap-1.5">
                  AI Food Advisor <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 font-bold">New</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-500 transition-colors">
                  Impact Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Safety & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Safety & Standards
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                <span>Good Samaritan Protections</span>
              </li>
              <li><span>FSSAI / FDA Holding Guidelines</span></li>
              <li><span>Allergen Labeling Protocols</span></li>
              <li><span>Cold Chain Transport Safety</span></li>
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Zero Waste Newsletter
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Weekly surplus food rescue alerts, safety insights, and impact metrics.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chef@restaurant.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all"
              >
                <Send className="w-3 h-3" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Replate Inc. Built for zero hunger and zero waste.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-500">MERN Stack • Groq Llama 3.1 • Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
