import React, { useState } from 'react';
import { X, Swords, Shield, Mail, Lock, User, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'signup' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rpgClass, setRpgClass] = useState('Warrior of Focus');
  const [notice, setNotice] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (mode === 'signup' && !username)) {
      setNotice('Please fill in all fields to forge your credentials.');
      return;
    }

    setNotice(
      `Awesome! Credentials received for ${mode === 'signup' ? username : email}. (In Step 2, we will link this to our Node.js/Express + MongoDB API with JWT & bcrypt).`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-rpg-card border border-rpg-border rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 shadow-glow-gold">
            <Swords className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-2xl font-bold font-rpg text-white">
            {mode === 'signup' ? 'Create Adventurer Account' : 'Resume Your Quest'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'signup' 
              ? 'Begin your journey from ambitious goal to triumphant victory' 
              : 'Log in to continue striking down your bosses'}
          </p>
        </div>

        {/* Toggle Mode Tabs */}
        <div className="flex rounded-lg bg-slate-900/90 p-1 border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setMode('signup'); setNotice(''); }}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
              mode === 'signup' 
                ? 'bg-amber-500 text-black shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Character (Sign Up)
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setNotice(''); }}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
              mode === 'login' 
                ? 'bg-amber-500 text-black shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Informative notice message */}
        {notice && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{notice}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Adventurer Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. IronWillHunter"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
              Adventurer Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="adventurer@lifeforge.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Starting Character Specialization
              </label>
              <select
                value={rpgClass}
                onChange={(e) => setRpgClass(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Warrior of Focus">Warrior of Focus (Deep Work Sprints)</option>
                <option value="Paladin of Discipline">Paladin of Discipline (Daily Consistency)</option>
                <option value="Ranger of Vitality">Ranger of Vitality (Health & Fitness)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 active:scale-95 transition-all shadow-glow-gold flex items-center justify-center gap-2"
          >
            <span>{mode === 'signup' ? 'Forge Character & Enter' : 'Unlock Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info note */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          Step 1: Frontend Interface Active • Ready for Step 2 Backend
        </div>

      </div>
    </div>
  );
}
