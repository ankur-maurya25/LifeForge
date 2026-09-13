import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Validation and error states
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const validateIdentifier = (val) => {
    // Allows either valid email or username (alphanumeric, underscores, min 3 chars)
    if (val.includes('@')) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }
    return val.trim().length >= 3;
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@lifeforge.com');
      setPassword('admin123');
    } else {
      setEmail('testuser@lifeforge.com');
      setPassword('password123');
    }
    setErrors({});
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessNotice('');
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Adventurer email or username is required.';
    } else if (!validateIdentifier(email)) {
      newErrors.email = 'Please enter a valid email or username (min 3 characters).';
    }

    if (!password) {
      newErrors.password = 'Master cipher (password) is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const result = await login(email.trim(), password);
      if (result.success) {
        setSuccessNotice(`Welcome back, ${result.user.name}! Entering realm...`);
        // If user came from a specific page, respect that. Otherwise, route Admin to /admin and normal user to /dashboard
        let targetRoute = location.state?.from?.pathname;
        if (!targetRoute || targetRoute === '/login' || targetRoute === '/') {
          targetRoute = result.user.role === 'admin' ? '/admin' : '/dashboard';
        }
        setTimeout(() => {
          navigate(targetRoute);
        }, 600);
      } else {
        setServerError(result.error);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden bg-[#07080D]">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-red-600/10 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-5xl bg-[#0E111A] border border-[#1E2538] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* ================= LEFT COLUMN: MAIN LOGIN FORM (7 COLS) ================= */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            
            {/* 1. Top Branding */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-purple-900 flex items-center justify-center border border-red-500/40 shadow-glow-crimson">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
                  <line x1="13" y1="19" x2="19" y2="13" />
                </svg>
              </div>
              <div>
                <span className="font-rpg text-lg font-bold tracking-wider text-white">
                  LIFE<span className="text-red-500">FORGE</span>
                </span>
                <span className="block text-[9px] font-mono tracking-[0.25em] text-slate-400 -mt-1 uppercase">
                  Goal-to-Boss RPG
                </span>
              </div>
            </div>

            {/* 2. Main Login Card Headings */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-black font-rpg text-white tracking-wide">
                WELCOME BACK, QUESTER
              </h1>
              <p className="text-slate-400 text-sm mt-1.5 font-normal">
                Your next victory is waiting.
              </p>
            </div>

            {/* Server Error Message Banner */}
            {serverError && (
              <div 
                role="alert"
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200"
              >
                <span className="text-base leading-none mt-0.5">⚠️</span>
                <div className="space-y-1">
                  <strong className="block text-red-200 font-semibold">Authentication Failed</strong>
                  <p>{serverError}</p>
                  {serverError.toLowerCase().includes('database is offline') && (
                    <div className="mt-2 p-2.5 rounded-lg bg-black/40 border border-amber-500/30 text-[11px] text-amber-300/90 font-mono space-y-1">
                      <p className="font-bold text-amber-300">💡 Manual Setup Action Required:</p>
                      <p>1. Start local MongoDB (`net start MongoDB` or `mongod`), OR</p>
                      <p>2. Set MongoDB Atlas URI in <code className="bg-white/10 px-1 py-0.5 rounded text-white">backend/.env</code>: <code className="text-emerald-300">MONGO_URI=mongodb+srv://...</code></p>
                      <p>3. Run seed: <code className="bg-white/10 px-1 py-0.5 rounded text-white">npm run seed</code> in backend.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success Notice Banner */}
            {successNotice && (
              <div 
                role="status"
                className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200"
              >
                <span className="text-base leading-none mt-0.5">⚔️</span>
                <div>
                  <strong className="block text-emerald-200 font-semibold mb-0.5">Access Granted</strong>
                  <p>{successNotice}</p>
                </div>
              </div>
            )}

            {/* 3. Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              
              {/* Email / Username Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label 
                    htmlFor="login-email" 
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono"
                  >
                    Email or Username
                  </label>
                  {/* Quick Demo Fill Buttons */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <span className="text-slate-400">Demo:</span>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials('user')}
                      className="text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
                      title="Fill demo user account credentials"
                    >
                      User
                    </button>
                    <span className="text-slate-500">|</span>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials('admin')}
                      className="text-red-400 hover:text-red-300 underline font-semibold cursor-pointer"
                      title="Fill demo admin account credentials"
                    >
                      Admin
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <input
                    id="login-email"
                    type="text"
                    name="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="admin@lifeforge.com or admin"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full bg-[#141824] border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-[#1E2538] focus:border-red-500 focus:ring-red-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-mono">
                    <span>⚠</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label 
                    htmlFor="login-password" 
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono"
                  >
                    Password
                  </label>
                  <Link
                    to="/signup"
                    className="text-xs text-red-400 hover:text-red-300 transition-colors font-mono"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="••••••••••••"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className={`w-full bg-[#141824] border rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-[#1E2538] focus:border-red-500 focus:ring-red-500'
                    }`}
                  />
                  
                  {/* Show/Hide Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white rounded-lg focus-visible:outline-red-500"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-mono">
                    <span>⚠</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-[#141824] text-red-600 focus:ring-red-500 focus:ring-offset-0 focus:outline-none cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  Remember my hero session on this device
                </label>
              </div>

              {/* 4. Main Button: Enter the Realm */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-800 via-red-600 to-amber-600 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-glow-crimson border border-red-500/50 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Enter the Realm</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 5. Signup Link */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              New to LifeForge?{' '}
              <Link to="/signup" className="text-amber-400 hover:text-amber-300 font-bold hover:underline">
                Create your character
              </Link>
            </p>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: VISUAL SIDE PANEL (5 COLS) ================= */}
        {/* Visible on desktop, neatly arranged below on mobile without horizontal scroll */}
        <div className="lg:col-span-5 bg-[#080A10] border-t lg:border-t-0 lg:border-l border-[#1E2538] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          
          {/* Ambient Purple/Red background haze */}
          <div className="absolute top-1/4 right-1/4 w-56 h-56 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Panel Title */}
          <div className="relative z-10">
            <span className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold px-2 py-0.5 rounded bg-red-950/40 border border-red-500/30">
              Active Adventurer Sync
            </span>
            <h2 className="text-xl font-bold font-rpg text-white mt-3">
              Level up your real life.
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Every completed task earns experience, sharpens your discipline, and weakens the obstacles in your way.
            </p>
          </div>

          {/* Centerpiece: Original Fictional RPG Hero Silhouette Illustration */}
          <div className="my-8 py-6 relative z-10 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 rounded-2xl bg-gradient-to-b from-[#1C0A14] via-[#100612] to-[#08080C] border border-red-500/30 shadow-glow-purple flex items-center justify-center overflow-hidden">
              
              {/* Radial portal backdrop */}
              <div className="absolute inset-0 bg-radial from-purple-600/20 via-red-950/20 to-black/80" />
              
              {/* Hero Silhouette with Glowing Amber Blade */}
              <svg className="w-28 h-32 text-slate-200 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]" viewBox="0 0 100 120" fill="currentColor">
                {/* Hero Helm / Cowl */}
                <circle cx="50" cy="22" r="12" fill="#E2E8F0" />
                <path d="M42 22 L58 22 L50 32 Z" fill="#991B1B" />
                {/* Cloak & Armor */}
                <path d="M30 40 L50 34 L70 40 L78 95 L65 110 L35 110 L22 95 Z" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                {/* Pauldron shoulders */}
                <path d="M24 42 Q32 30 46 36 L44 55 Z" fill="#1E293B" stroke="#DC2626" strokeWidth="1" />
                <path d="M76 42 Q68 30 54 36 L56 55 Z" fill="#1E293B" stroke="#DC2626" strokeWidth="1" />
                {/* Glowing Amber Blade */}
                <line x1="72" y1="20" x2="88" y2="90" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                <line x1="70" y1="22" x2="86" y2="88" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
                {/* Sword Guard */}
                <line x1="64" y1="78" x2="86" y2="72" stroke="#DC2626" strokeWidth="3" />
              </svg>

              {/* Floating Embers */}
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-8 left-8 animate-ping" />
              <span className="w-1 h-1 rounded-full bg-red-400 absolute bottom-10 right-10 animate-pulse" />
            </div>

            {/* Fictional Rank */}
            <div className="mt-4 text-center">
              <span className="text-xs font-mono font-bold text-amber-400">
                Rank IV Champion
              </span>
              <span className="text-[11px] text-slate-400 block font-mono">
                Class: Warrior of Focus
              </span>
            </div>
          </div>

          {/* Hero XP Bar & Stats Widget */}
          <div className="bg-[#141824] rounded-xl border border-slate-800 p-4 relative z-10 space-y-3">
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  HERO XP PROGRESS
                </span>
                <span className="text-amber-400 font-bold">380 / 500 XP (76%)</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full w-[76%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
                <span className="text-purple-400 block font-bold">⚡ Focus</span>
                Lv. 14 Sprints
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
                <span className="text-red-400 block font-bold">🛡️ Discipline</span>
                8-Day Streak
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
