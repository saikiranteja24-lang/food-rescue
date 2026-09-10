import React from 'react';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  Cpu,
  HandHeart,
  Truck,
  CheckCircle2,
  Sparkles,
  CalendarClock,
  Building2,
} from 'lucide-react';

export const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Donor Lists Surplus Food',
      desc: 'Restaurants, caterers, or event venues enter food details, quantity, prep time, and pickup address in under 60 seconds.',
      icon: <PlusCircle className="w-6 h-6 text-brand-400" />,
      detail: 'Accurate food photo & dietary tags',
    },
    {
      step: '02',
      title: 'AI Verification & Routing',
      desc: 'RePlate AI calculates safe consumption windows and instantly alerts verified shelters and food banks in the area.',
      icon: <Cpu className="w-6 h-6 text-teal-400" />,
      detail: 'Instant safety & freshness check',
    },
    {
      step: '03',
      title: 'Shelter Claims & Schedules Pickup',
      desc: 'NGOs review dietary fit, claim the batch with pickup notes, and schedule driver/volunteer arrival times.',
      icon: <CalendarClock className="w-6 h-6 text-indigo-400" />,
      detail: 'Assigned driver contact & ETA coordination',
    },
    {
      step: '04',
      title: 'In-Transit Rescue & Tracking',
      desc: 'Volunteers collect surplus food using thermal containers and log the live transit status on the RePlate dashboard.',
      icon: <Truck className="w-6 h-6 text-cyan-400" />,
      detail: 'Real-time audit log & transit tracker',
    },
    {
      step: '05',
      title: 'Community Nourished & CO2 Saved',
      desc: 'Fresh meals reach individuals in need before quality degrades. Live carbon offset and meal count stats are recorded.',
      icon: <Building2 className="w-6 h-6 text-emerald-400" />,
      detail: 'Automated impact certificates & stats',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Rescue Lifecycle</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            How Surplus Food Gets Rescued
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            From buffet counter to community table before freshness fades — tracked every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 relative">
          {steps.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
              className="relative glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-brand-500/40 transition-all duration-300"
            >
              <div>
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-3xl font-black font-display text-slate-300 dark:text-slate-700/80">
                    {s.step}
                  </span>
                </div>

                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2 text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{s.detail}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
