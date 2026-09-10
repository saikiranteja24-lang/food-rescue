import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { AiDemoSection } from '../components/landing/AiDemoSection';
import { PricingSection } from '../components/landing/PricingSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { FaqSection } from '../components/landing/FaqSection';
import { CtaBanner } from '../components/landing/CtaBanner';
import { donationAPI } from '../services/api';

export const LandingPage = () => {
  const [stats, setStats] = useState({
    totalMealsRescued: 14250,
    co2SavedKg: 35625,
    activeDonations: 18,
    totalDonors: 86,
    totalRecipients: 64,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await donationAPI.getStats();
        if (res.data?.success && res.data.stats) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to load live stats, using fallback defaults', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero section with animated headline & dynamic preview */}
      <HeroSection stats={stats} />

      {/* 2. Features showcase */}
      <FeaturesSection />

      {/* 3. How it works */}
      <HowItWorksSection />

      {/* 4. AI demo preview (interactive in-landing widget powered by Groq) */}
      <AiDemoSection />

      {/* 5. Pricing cards */}
      <PricingSection />

      {/* 6. Testimonials */}
      <TestimonialsSection />

      {/* 7. FAQ accordion */}
      <FaqSection />

      {/* 8. Final CTA Banner */}
      <CtaBanner />
    </div>
  );
};
