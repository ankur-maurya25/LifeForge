import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05060A] border-t border-[#1E2538] py-12 text-slate-400 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* LifeForge Logo */}
          <div 
            onClick={scrollToTop}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-purple-900 flex items-center justify-center border border-red-500/30">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
                <line x1="13" y1="19" x2="19" y2="13" />
              </svg>
            </div>
            <div>
              <span className="font-rpg text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                LIFE<span className="text-red-500">FORGE</span>
              </span>
              <p className="text-[11px] text-slate-500">Goal-to-Boss RPG</p>
            </div>
          </div>

          {/* Basic Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <a href="#how-it-works" className="hover:text-red-400 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-red-400 transition-colors">Features</a>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Signup</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </nav>

          {/* Hackathon Badge */}
          <div className="text-xs font-mono text-slate-500">
            Hackathon Edition
          </div>

        </div>

        {/* Short Copyright Placeholder */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 LifeForge. All rights reserved.</p>
          <p>Built with React, Vite & Tailwind CSS</p>
        </div>

      </div>
    </footer>
  );
}
