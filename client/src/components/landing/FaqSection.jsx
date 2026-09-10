import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Are food donors legally protected when donating leftover food?',
      a: 'Yes, absolutely. In the US, the Bill Emerson Good Samaritan Food Donation Act provides comprehensive civil and criminal liability protection for individuals, restaurants, and caterers who donate food in good faith. Similar Good Samaritan food rescue provisions exist globally (including India under FSSAI zero-waste regulations and the UK/EU food waste frameworks).',
    },
    {
      q: 'How does Groq AI assist donors and recipients on Replate?',
      a: 'Replate integrates Groq high-speed LLM inference (Llama 3.1) to analyze food safety parameters in real time. It assists with safe temperature thresholds (hot food >60°C/140°F, cold food <4°C/40°F), calculates safe holding hours (2-hour/4-hour rule), verifies allergen labeling, and suggests creative recipes for surplus ingredients.',
    },
    {
      q: 'What types of food can be donated on the platform?',
      a: 'Donors can list hot cooked meals from events, bakery bread and pastries, fresh farm produce, dairy, chilled packaged items, and buffet surplus. All food must be unserved to consumers, stored in clean food-grade containers, and kept within safe temperature ranges.',
    },
    {
      q: 'Who arranges the pickup and transport of the surplus food?',
      a: 'When a donor posts a listing, verified nearby non-profits, shelters, and volunteer drivers receive an instant alert. The claiming organization coordinates pickup at the designated address and time window. For high-volume donors, automated transport routing is available.',
    },
    {
      q: 'Does it cost anything for non-profits and shelters to receive food?',
      a: 'No. Replate is 100% free forever for all charitable organizations, soup kitchens, and community pantries. We believe access to nourishment is a fundamental human right.',
    },
    {
      q: 'How is environmental impact (CO2 offset) calculated?',
      a: 'Each meal rescued is calculated based on EPA and FAO lifecycle assessments: approximately 2.5 kg of CO2 equivalent emissions are prevented for every standard meal (approx. 400g) diverted from municipal landfills.',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Everything you need to know about food rescue safety, logistics, and legal protections.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-base text-slate-900 dark:text-white font-display">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
