import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import HeroSection from './components/landing/HeroSection';
import InteractiveDemo from './components/landing/InteractiveDemo';
import HowItWorks from './components/landing/HowItWorks';
import BossShowcase from './components/landing/BossShowcase';
import FeaturesSection from './components/landing/FeaturesSection';
import Footer from './components/common/Footer';
import AuthModal from './components/auth/AuthModal';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');

  const handleOpenAuth = (mode = 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSelectBoss = (bossName) => {
    handleOpenAuth('signup');
  };

  return (
    <div className="min-h-screen bg-rpg-dark text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar onOpenAuthModal={handleOpenAuth} />

      {/* Main Landing Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection onOpenAuthModal={handleOpenAuth} />

        {/* Live Interactive Combat Simulator */}
        <InteractiveDemo />

        {/* How It Works Gameplay Loop */}
        <HowItWorks />

        {/* Boss Showcase & Bestiary */}
        <BossShowcase onSelectBoss={handleSelectBoss} />

        {/* Features Showcase */}
        <FeaturesSection />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Authentication Modal (Sign In / Sign Up) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
