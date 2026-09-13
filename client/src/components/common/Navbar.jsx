import React, { useState } from 'react';
import { Swords, Sparkles, Shield, Menu, X, Flame } from 'lucide-react';

export default function Navbar({ onOpenAuthModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-rpg-dark/90 border-b border-rpg-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-glow-gold transition-transform group-hover:scale-105 border border-amber-400/40">
              <Swords className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-wider font-rpg text-slate-100 group-hover:text-amber-400 transition-colors">
                LIFE<span className="text-amber-500">FORGE</span>
              </span>
              <span className="hidden sm:block text-[10px] tracking-widest uppercase font-semibold text-amber-500/80 -mt-1">
                Goal-to-Boss RPG
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="hover:text-amber-400 transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('demo-arena')} 
              className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Live Demo
            </button>
            <button 
              onClick={() => scrollToSection('boss-vault')} 
              className="hover:text-amber-400 transition-colors"
            >
              Boss Archive
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="hover:text-amber-400 transition-colors"
            >
              Features
            </button>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onOpenAuthModal('login')}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Adventurer Login
            </button>

            <button
              onClick={() => onOpenAuthModal('signup')}
              className="relative group px-5 py-2.5 rounded-lg font-bold text-sm text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 active:scale-95 transition-all shadow-glow-gold flex items-center gap-2"
            >
              <Flame className="w-4 h-4 fill-black" />
              <span>Forge Your Goal</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-rpg-surface border-b border-rpg-border px-4 pt-2 pb-6 space-y-3">
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className="block w-full text-left py-2 text-base font-medium text-slate-200 hover:text-amber-400"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('demo-arena')} 
            className="block w-full text-left py-2 text-base font-medium text-slate-200 hover:text-amber-400 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Live Demo Arena
          </button>
          <button 
            onClick={() => scrollToSection('boss-vault')} 
            className="block w-full text-left py-2 text-base font-medium text-slate-200 hover:text-amber-400"
          >
            Boss Archive
          </button>
          <button 
            onClick={() => scrollToSection('features')} 
            className="block w-full text-left py-2 text-base font-medium text-slate-200 hover:text-amber-400"
          >
            Features
          </button>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuthModal('login');
              }}
              className="w-full py-2.5 rounded-lg border border-slate-700 text-center font-semibold text-slate-200 hover:bg-slate-800"
            >
              Adventurer Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuthModal('signup');
              }}
              className="w-full py-2.5 rounded-lg bg-amber-500 text-black font-bold text-center shadow-glow-gold hover:bg-amber-400"
            >
              Forge Your Goal
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
