import React from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Flame,
  ShieldCheck,
  TrendingDown,
  Navigation,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Bot className="w-6 h-6 text-brand-400" />,
      title: 'Groq AI Safety & Shelf-Life Advisor',
      description:
        'Powered by Groq high-speed inference (Llama 3.1). Get instant answers on safe holding temperatures, bacterial danger zones, and optimal donation windows.',
      badge: 'Groq Powered',
    },
    {
      icon: <Layers className="w-6 h-6 text-teal-400" />,
      title: 'Real-Time Surplus Listings',
      description:
        'Easily filter available food by category (cooked dishes, bakery, raw produce, dairy), dietary preferences (vegan, vegetarian, halal), and pickup radius.',
      badge: 'Real-time',
    },
    {
      icon: <Navigation className="w-6 h-6 text-cyan-400" />,
      title: 'Smart Geo-Matching',
      description:
        'Instantly alerts nearby food banks and verified community shelters when surplus food is posted, ensuring rapid pickup before expiry.',
      badge: 'Fast Logistics',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: 'HACCP & Legal Compliance',
      description:
        'Built-in safety protocols aligned with Good Samaritan laws and food hygiene acts, protecting both generous donors and recipients.',
      badge: 'Certified',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      title: 'Leftover Culinary Transformation',
      description:
        'Ask Replate AI how to transform surplus ingredients like excess bread, milk, or vegetables into safe, delicious soups, broths, and meals.',
      badge: 'Zero Waste',
    },
    {
      icon: <TrendingDown className="w-6 h-6 text-emerald-300" />,
      title: 'CO2 Emission & Impact Scorecard',
      description:
        'Measure your tangible ESG impact. Automatically track rescued meal equivalents and kilograms of greenhouse gas emissions prevented.',
      badge: 'ESG Metrics',
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-slate-100/50 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
            Architecture & Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Engineered to Solve Food Insecurity & Waste
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            A production-grade ecosystem combining cutting-edge LLM intelligence with real-world redistribution logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass-card p-7 rounded-3xl relative group hover:-translate-y-1.5 transition-all duration-300 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-500/20 transition-all duration-300">
                  {f.icon}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {f.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2.5">
                {f.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
