import React from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero-boss-bg.jpg';

export default function HeroSection() {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 overflow-hidden select-none">
      
      {/* 1. Full-Bleed Cinematic Dragon Boss Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-20 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* 2. Atmospheric Vignette & Smoke Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07080D] via-transparent to-black/80 -z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/90 -z-10 pointer-events-none" />

      {/* 3. Floating Vertical Diamond Runes on Bottom-Right (Exact match from reference) */}
      <div className="hidden sm:flex flex-col items-center gap-2 absolute right-8 sm:right-12 bottom-12 z-20 pointer-events-none text-red-500/70">
        <span className="w-1 h-1 rounded-full bg-red-500 animate-ping" />
        <svg className="w-5 h-16 text-red-600 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" viewBox="0 0 20 60" fill="none">
          <polygon points="10,2 18,12 10,22 2,12" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="10,20 18,30 10,40 2,30" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="10,38 18,48 10,58 2,48" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span className="w-1 h-1 rounded-full bg-red-500/60" />
      </div>

      {/* 4. Centerpiece Hero Content Positioned Above the Shadow Dragon */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center z-10 my-auto">
        
        {/* Large Bold Stacked White Typography (Matching reference) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-rpg tracking-wider text-white uppercase leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
          STEP INTO THE SHADOW <br />
          OF THE DRAGON
        </h1>

        {/* Cinematic Subtitle */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-200/90 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          Enter LifeForge, a dark action RPG where you master daily combat and take on powerful goal bosses in a world shaped by your choices.
        </p>

        {/* Dual Cinematic Action Buttons (Exact style from reference) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-5 max-w-md mx-auto">
          
          {/* Primary Action: Crimson Gradient with Crossed Swords */}
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-3.5 rounded bg-gradient-to-r from-[#6b0f15] via-[#8c161d] to-[#6b0f15] hover:brightness-125 border border-red-500/70 text-sm font-bold text-white tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2.5 group"
          >
            {/* Crossed Swords Icon */}
            <svg className="w-4 h-4 text-red-200 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
              <line x1="13" y1="19" x2="19" y2="13" />
              <line x1="16" y1="16" x2="20" y2="20" />
              <line x1="19" y1="21" x2="21" y2="19" />
              <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
              <line x1="5" y1="14" x2="9" y2="18" />
              <line x1="7" y1="17" x2="4" y2="20" />
              <line x1="3" y1="19" x2="5" y2="21" />
            </svg>
            <span>Play Now</span>
          </Link>

          {/* Secondary Action: Dark Charcoal with Red Border */}
          <button
            onClick={scrollToHowItWorks}
            className="w-full sm:w-auto px-8 py-3.5 rounded bg-[#130608]/90 hover:bg-[#1f090c] border border-red-900/80 hover:border-red-500 text-sm font-semibold text-slate-200 hover:text-white tracking-wider uppercase transition-all shadow-lg cursor-pointer"
          >
            Discover More
          </button>

        </div>

      </div>

      {/* Subtle bottom scroll indicator */}
      <div className="z-10 text-center text-xs font-mono text-red-500/60 uppercase tracking-widest flex items-center justify-center gap-2 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span>Scroll to Battle Arena</span>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      </div>

    </section>
  );
}
