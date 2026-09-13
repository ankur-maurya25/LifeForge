import React from 'react';
import HeroSection from '../components/HeroSection';
import BossVisual from '../components/BossVisual';
import HowItWorks from '../components/HowItWorks';
import FeaturesSection from '../components/FeaturesSection';
import FinalCTA from '../components/FinalCTA';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Main Boss Visual (The Procrastination King) */}
      <BossVisual />

      {/* 3. How It Works (3 Steps) */}
      <HowItWorks />

      {/* 4. Features Section (4 Pillars) */}
      <FeaturesSection />

      {/* 5. Final Call-to-Action */}
      <FinalCTA />
    </div>
  );
}
