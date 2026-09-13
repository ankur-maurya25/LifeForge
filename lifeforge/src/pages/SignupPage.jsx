import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STARTING_CLASSES = [
  {
    id: 'builder',
    title: 'The Builder',
    description: 'Project and coding focused',
    primaryStat: '+2 Initial Focus',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-950/30',
    icon: (
      <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    )
  },
  {
    id: 'scholar',
    title: 'The Scholar',
    description: 'Study and learning focused',
    primaryStat: '+2 Initial Wisdom',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-950/30',
    icon: (
      <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    )
  },
  {
    id: 'warrior',
    title: 'The Warrior',
    description: 'Fitness and discipline focused',
    primaryStat: '+2 Initial Discipline',
    badgeColor: 'border-red-500/40 text-red-400 bg-red-950/30',
    icon: (
      <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
        <line x1="13" y1="19" x2="19" y2="13" />
        <line x1="16" y1="16" x2="20" y2="20" />
      </svg>
    )
  },
  {
    id: 'explorer',
    title: 'The Explorer',
    description: 'Personal growth focused',
    primaryStat: '+2 Initial Vitality',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30',
    icon: (
      <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    )
  }
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedClass, setSelectedClass] = useState('builder');
  
  // Show/Hide Password States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Feedback
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessNotice('');
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full adventurer name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Adventurer email address is required.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address (e.g. hero@domain.com).';
    }

    if (!password) {
      newErrors.password = 'Master password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmation password is required.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!selectedClass) {
      newErrors.selectedClass = 'Please choose your starting adventurer class.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const generatedUsername = (username.trim() || fullName.trim().toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(100 + Math.random() * 900));

      const result = await register({
        name: fullName.trim(),
        username: generatedUsername,
        email: email.trim(),
        password
      });

      if (result.success) {
        setSuccessNotice(`Character forged for ${result.user.name}! Proceeding to onboarding...`);
        setTimeout(() => {
          navigate('/onboarding');
        }, 600);
      } else {
        setServerError(result.error);
      }
    }
  };

  const currentClassData = STARTING_CLASSES.find(c => c.id === selectedClass) || STARTING_CLASSES[0];

  return (
    <div className="min-h-[calc(100vh-160px)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden bg-[#07080D]">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-r from-red-600/10 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-5xl bg-[#0E111A] border border-[#1E2538] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* ================= LEFT COLUMN: CHARACTER CREATION FORM (7 COLS) ================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            
            {/* 1. Top Branding */}
            <div className="flex items-center gap-3 mb-6">
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

            {/* 2. Main Headings */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black font-rpg text-white tracking-wide">
                CREATE YOUR CHARACTER
              </h1>
              <p className="text-slate-400 text-sm mt-1.5 font-normal">
                Your real-life adventure starts with one decision.
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
                  <strong className="block text-red-200 font-semibold">Registration Failed</strong>
                  <p>{serverError}</p>
                  {serverError.toLowerCase().includes('database is offline') && (
                    <div className="mt-2 p-2.5 rounded-lg bg-black/40 border border-amber-500/30 text-[11px] text-amber-300/90 font-mono space-y-1">
                      <p className="font-bold text-amber-300">💡 Manual Setup Action Required:</p>
                      <p>1. Start local MongoDB (`net start MongoDB` or `mongod`), OR</p>
                      <p>2. Set MongoDB Atlas URI in <code className="bg-white/10 px-1 py-0.5 rounded text-white">backend/.env</code>: <code className="text-emerald-300">MONGO_URI=mongodb+srv://...</code></p>
                      <p>3. Restart backend or trigger signup again once connected.</p>
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
                  <strong className="block text-emerald-200 font-semibold mb-0.5">Character Initialized</strong>
                  <p>{successNotice}</p>
                </div>
              </div>
            )}

            {/* 3. Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              
              {/* Row 1: Full Name & Optional Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label 
                    htmlFor="signup-fullname"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="signup-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="e.g. Roland Vance"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? "name-error" : undefined}
                    className={`w-full bg-[#141824] border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                      errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#1E2538] focus:border-red-500 focus:ring-red-500'
                    }`}
                  />
                  {errors.fullName && (
                    <p id="name-error" className="mt-1 text-[11px] text-red-400 font-mono flex items-center gap-1">
                      <span>⚠</span> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Optional Username */}
                <div>
                  <label 
                    htmlFor="signup-username"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1"
                  >
                    Username <span className="text-slate-500 text-[10px] font-normal">(Optional)</span>
                  </label>
                  <input
                    id="signup-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. IronKnight"
                    className="w-full bg-[#141824] border border-[#1E2538] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label 
                  htmlFor="signup-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="adventurer@lifeforge.app"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "signup-email-error" : undefined}
                  className={`w-full bg-[#141824] border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#1E2538] focus:border-red-500 focus:ring-red-500'
                  }`}
                />
                {errors.email && (
                  <p id="signup-email-error" className="mt-1 text-[11px] text-red-400 font-mono flex items-center gap-1">
                    <span>⚠</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Row 2: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Password */}
                <div>
                  <label 
                    htmlFor="signup-password"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: '' });
                      }}
                      placeholder="••••••••••••"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "signup-password-error" : undefined}
                      className={`w-full bg-[#141824] border rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#1E2538] focus:border-red-500 focus:ring-red-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
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
                    <p id="signup-password-error" className="mt-1 text-[11px] text-red-400 font-mono flex items-center gap-1">
                      <span>⚠</span> {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label 
                    htmlFor="signup-confirm-password"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                      }}
                      placeholder="••••••••••••"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                      className={`w-full bg-[#141824] border rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#1E2538] focus:border-red-500 focus:ring-red-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                    >
                      {showConfirmPassword ? (
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
                  {errors.confirmPassword && (
                    <p id="confirm-error" className="mt-1 text-[11px] text-red-400 font-mono flex items-center gap-1">
                      <span>⚠</span> {errors.confirmPassword}
                    </p>
                  )}
                </div>

              </div>

              {/* 5. Character Class Selection Area */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                    Choose Your Starting Class <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">
                    Specialization Focus
                  </span>
                </div>

                {/* 4 Class Cards 2x2 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {STARTING_CLASSES.map((cls) => {
                    const isSelected = selectedClass === cls.id;
                    return (
                      <div
                        key={cls.id}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onClick={() => setSelectedClass(cls.id)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            setSelectedClass(cls.id);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 select-none ${
                          isSelected
                            ? 'bg-[#181D2C] border-amber-500 shadow-glow-gold/20 ring-1 ring-amber-500'
                            : 'bg-[#141824] border-[#1E2538] hover:border-slate-600 hover:bg-[#1A2030]'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                          {cls.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{cls.title}</span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                            {cls.description}
                          </p>
                          <span className={`inline-block text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded mt-1 border ${cls.badgeColor}`}>
                            {cls.primaryStat}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. Main Button: Create My Character */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-800 via-red-600 to-amber-600 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-glow-crimson border border-red-500/50 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Forging Character...</span>
                  </>
                ) : (
                  <>
                    <span>Create My Character</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 7. Login Link */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-red-400 hover:text-red-300 font-bold hover:underline">
                Enter the Realm
              </Link>
            </p>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: LEVEL 01 SIDE VISUAL (5 COLS) ================= */}
        {/* On desktop, sticky side showcase; on mobile, cleanly arranged below */}
        <div className="lg:col-span-5 bg-[#080A10] border-t lg:border-t-0 lg:border-l border-[#1E2538] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          
          {/* Ambient Lighting */}
          <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Level 01 Pill */}
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold px-2.5 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
                LEVEL 01 ADVENTURER
              </span>
              <span className="text-[10px] font-mono text-slate-500">Tier I Trainee</span>
            </div>

            <h2 className="text-xl font-bold font-rpg text-white mt-3">
              Every legend starts at level one.
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Equip your chosen class, establish your first daily habits, and begin dealing real damage to procrastination.
            </p>
          </div>

          {/* Centerpiece: Level 01 Novice Character Silhouette */}
          <div className="my-8 py-6 relative z-10 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 rounded-2xl bg-gradient-to-b from-[#1C0A14] via-[#100612] to-[#08080C] border border-red-500/30 shadow-glow-crimson flex items-center justify-center overflow-hidden">
              
              {/* Radial haze */}
              <div className="absolute inset-0 bg-radial from-red-600/20 via-purple-950/20 to-black/80" />
              
              {/* Level 01 Silhouette */}
              <svg className="w-28 h-32 text-slate-200 drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]" viewBox="0 0 100 120" fill="currentColor">
                {/* Cowl / Head */}
                <circle cx="50" cy="22" r="11" fill="#E2E8F0" />
                <path d="M43 22 L57 22 L50 30 Z" fill="#DC2626" />
                {/* Cloak & Tunic */}
                <path d="M32 40 L50 35 L68 40 L74 95 L63 110 L37 110 L26 95 Z" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                {/* Shoulder guard */}
                <path d="M26 42 Q34 32 46 38 L44 52 Z" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
                <path d="M74 42 Q66 32 54 38 L56 52 Z" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
                {/* Novice Shortsword */}
                <line x1="72" y1="26" x2="84" y2="86" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="70" y1="28" x2="82" y2="84" stroke="#FCA5A5" strokeWidth="1" strokeLinecap="round" />
                <line x1="66" y1="74" x2="84" y2="70" stroke="#F59E0B" strokeWidth="2.5" />
              </svg>

              {/* Level 01 Badge */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black/80 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 whitespace-nowrap">
                {currentClassData.title}
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs font-mono font-bold text-slate-200">
                Starting Character Profile
              </span>
              <span className="text-[11px] text-slate-500 block font-mono">
                XP: 0 / 100 to Level 2
              </span>
            </div>
          </div>

          {/* 8. Starting Stats: Discipline: 10, Focus: 10, Consistency: 10 */}
          <div className="bg-[#141824] rounded-xl border border-slate-800 p-4 relative z-10 space-y-3">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              Base Hero Attributes
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              
              {/* Discipline: 10 */}
              <div className="p-2 rounded-lg bg-slate-900/90 border border-red-500/30">
                <span className="text-red-400 font-bold block text-sm">10</span>
                <span className="text-[10px] text-slate-400 uppercase">Discipline</span>
              </div>

              {/* Focus: 10 */}
              <div className="p-2 rounded-lg bg-slate-900/90 border border-purple-500/30">
                <span className="text-purple-400 font-bold block text-sm">10</span>
                <span className="text-[10px] text-slate-400 uppercase">Focus</span>
              </div>

              {/* Consistency: 10 */}
              <div className="p-2 rounded-lg bg-slate-900/90 border border-amber-500/30">
                <span className="text-amber-400 font-bold block text-sm">10</span>
                <span className="text-[10px] text-slate-400 uppercase">Consistency</span>
              </div>

            </div>

            <div className="text-[10px] font-mono text-slate-500 pt-1 text-center">
              Stats increase with each daily quest completed.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
