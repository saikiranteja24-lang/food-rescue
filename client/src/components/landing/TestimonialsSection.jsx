import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Chef Marcus Vance',
      role: 'Executive Chef, Apex Convention Center',
      metric: 'Rescued 4,200kg buffet food',
      quote:
        'Replate transformed our end-of-event protocol. Instead of throwing away hundreds of portions of untouched gourmet dishes, Replate AI verified holding temps and a local shelter van arrived in 25 minutes. The ESG reporting is phenomenal.',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Operations Director, Beacon Hope Shelter',
      metric: 'Fed 18,000+ hot meals',
      quote:
        'Before Replate, coordinating with caterers was endless phone calls. Now, our dispatch gets instant notification when surplus is posted. The AI advisor even gave us proper safe reheat guidelines for large batch lasagna!',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'David Chen',
      role: 'General Manager, FreshMarket Deli',
      metric: 'Zero bakery waste for 6 months',
      quote:
        'Listing surplus baguettes and salads takes literally 45 seconds on mobile. The system handles all liability documentation under Good Samaritan laws, removing all legal hesitation for our franchise.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-100/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
            Voices from the Field
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Trusted by Chefs, Shelters & City Food Banks
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Real stories of surplus food turning into community nourishment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
              className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & Quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-brand-500/30" />
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {t.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  <p className="text-[11px] font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                    {t.metric}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
