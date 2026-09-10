import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Building2, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingSection = () => {
  const plans = [
    {
      name: 'Community & Volunteer',
      price: '$0',
      period: 'free forever',
      description: 'Perfect for local volunteers, individuals, and neighborhood pantries seeking food rescue.',
      icon: <Heart className="w-6 h-6 text-brand-400" />,
      features: [
        'Unlimited surplus food claiming',
        'Groq AI Food Safety Advisor (24/7)',
        'Dietary & allergen filtering',
        'Direct donor pickup messaging',
        'Standard community support',
      ],
      cta: 'Join as Volunteer',
      popular: false,
    },
    {
      name: 'Verified Shelter / NGO',
      price: '$0',
      period: 'subsidized / free',
      description: 'For registered food banks, homeless shelters, and charitable soup kitchens distributing meals.',
      icon: <Shield className="w-6 h-6 text-brand-400" />,
      features: [
        'Priority 15-minute alert advantage',
        'Bulk tray & pallet reservation',
        'Multiple volunteer pickup driver accounts',
        'Good Samaritan legal documentation',
        'Instant SMS & webhook alerts',
        'Dedicated NGO coordinator support',
      ],
      cta: 'Register Shelter',
      popular: true,
    },
    {
      name: 'Commercial Food Donor',
      price: '$89',
      period: 'per kitchen / month',
      description: 'For hotels, banquet halls, restaurants, and supermarkets aiming for zero landfill waste.',
      icon: <Building2 className="w-6 h-6 text-accent-500" />,
      features: [
        'Rapid 30-second surplus batch listing',
        'Automated ESG & Carbon offset reports',
        'IRS 170(e)(3) tax deduction records',
        'HACCP & food safety audit trail',
        'Custom courier/pickup integration',
        'Dedicated account manager & SLA',
      ],
      cta: 'Start Zero-Waste Trial',
      popular: false,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
            Plans & Impact Tiers
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Transparent for Every Stakeholder
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Food distribution is always 100% free for hungry families and community shelters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`relative glass-card rounded-3xl p-8 flex flex-col justify-between border ${
                plan.popular
                  ? 'border-brand-500 shadow-2xl shadow-brand-500/15 ring-2 ring-brand-500/30'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  Most Popular for Non-Profits
                </div>
              )}

              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6">
                  {plan.icon}
                </div>

                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl sm:text-5xl font-black font-display text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    / {plan.period}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6">
                <Link
                  to="/register"
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-brand-500 to-accent-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  <span>{plan.cta}</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
