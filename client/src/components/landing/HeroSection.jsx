import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  HeartHandshake,
  Bot,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const HeroSection = ({ stats }) => {
  const { isAuthenticated } = useAuth();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Cinematic NGO Food Supply & Shelter Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <img
          src="/hero-bg.jpg"
          alt="NGO team serving nutritious warm food to seniors and children in shelter"
          className="w-full h-full object-cover object-center scale-100 opacity-40 dark:opacity-30 transition-all duration-700"
        />
        {/* Soft Vignette & Mode-Responsive Radial/Linear Blends */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 via-slate-50/80 to-slate-50 dark:from-[#0a0e1a]/75 dark:via-[#0a0e1a]/85 dark:to-[#0a0e1a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/80 via-transparent to-slate-50/80 dark:from-[#0a0e1a]/85 dark:via-transparent dark:to-[#0a0e1a]/85" />
      </div>

      {/* Background Ambient Glows */}
      <div className="ambient-glow -top-24 -left-24 opacity-60 z-0" />
      <div className="ambient-glow -bottom-24 -right-24 opacity-40 bg-accent-500/20 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-6 text-center"
        >
          {/* Tagline Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-brand-500/30 text-xs font-semibold text-brand-600 dark:text-brand-300 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Next-Gen MERN Food Rescue • Powered by Groq AI</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          >
            Turn Surplus Food Into{' '}
            <span className="gradient-text">Life-Saving Nourishment</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mx-auto"
          >
            Replate connects restaurants, caterers, and supermarkets with local shelters and food banks in real-time.
            Featuring an intelligent <strong>Groq-powered AI Food Advisor</strong> for instant safety analysis, safe holding rules, and zero-waste culinary transformations.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              to={isAuthenticated ? '/donations' : '/login'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-600 text-white font-bold text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] transition-all"
            >
              <span>{isAuthenticated ? 'Browse Surplus Food' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={isAuthenticated ? '/chat' : '/register'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl glass-card text-slate-900 dark:text-white hover:text-brand-500 border border-slate-300 dark:border-slate-700/80 font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:scale-[1.02] transition-all"
            >
              <Bot className="w-5 h-5 text-brand-400" />
              <span>{isAuthenticated ? 'Ask Replate AI' : 'Create Account'}</span>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={itemVariants}
            className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Good Samaritan Legal Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>Under 2-Minute Listing</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-brand-400" />
              <span>100% Free for Non-Profits</span>
            </div>
          </motion.div>

          {/* Impact Stats Row */}
          <motion.div
            variants={itemVariants}
            className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="text-2xl font-black font-display text-slate-900 dark:text-white">
                {stats?.totalMealsRescued?.toLocaleString() || '14,250'}
              </p>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">Meals Rescued</p>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="text-2xl font-black font-display text-emerald-600 dark:text-emerald-400">
                {stats?.co2SavedKg?.toLocaleString() || '35,625'}
              </p>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">kg CO₂ Saved</p>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="text-2xl font-black font-display text-brand-600 dark:text-brand-400">
                {stats?.totalDonors?.toLocaleString() || '86'}
              </p>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">Partner Donors</p>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="text-2xl font-black font-display text-cyan-600 dark:text-cyan-400">
                {stats?.totalRecipients?.toLocaleString() || '64'}
              </p>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">Community Shelters</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
