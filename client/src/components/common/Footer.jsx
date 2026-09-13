import React from 'react';
import { Swords, Sparkles } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black/90 border-t border-rpg-border/60 py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={scrollToTop}>
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shadow-glow-gold">
              <Swords className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xl font-bold font-rpg text-white tracking-wider">
                LIFE<span className="text-amber-500">FORGE</span>
              </span>
              <p className="text-xs text-slate-400">The Goal-to-Boss RPG System</p>
            </div>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a>
            <a href="#demo-arena" className="hover:text-amber-400 transition-colors">Combat Simulator</a>
            <a href="#boss-vault" className="hover:text-amber-400 transition-colors">Boss Bestiary</a>
            <a href="#features" className="hover:text-amber-400 transition-colors">Features</a>
          </div>

          {/* Hackathon Badge */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Hackathon Edition 2026</span>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 LifeForge. Built for disciplined achievers and gamers.</p>
          <p className="flex items-center gap-1">
            Crafted with React, Vite & Tailwind CSS
          </p>
        </div>

      </div>
    </footer>
  );
}
