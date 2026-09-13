import React, { useState } from 'react';

export default function ProfileCard({
  profile,
  onSaveProfile
}) {
  const [formData, setFormData] = useState({
    name: profile.name || 'Ankur Maurya',
    username: profile.username || 'ankur',
    email: profile.email || 'ankur@lifeforge.realm',
    bio: profile.bio || 'Building goals, completing quests and becoming better every day.'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-[#0E111A] border border-[#1E2538] rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-rpg text-white flex items-center gap-2">
            <span>PROFILE SETTINGS</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/30">
              Lv.8 Quester
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Your hero identity visible across the Realm of LifeForge
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-mono border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>{isEditing ? '✕ Cancel Edit' : '✏️ Edit Profile'}</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        
        {/* Avatar Section */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#07080E] border border-slate-800/80">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 via-purple-600 to-amber-500 p-0.5 shadow-glow-crimson/30">
              <div className="w-full h-full rounded-2xl bg-[#0B0D14] flex items-center justify-center text-2xl font-bold font-rpg text-amber-400">
                {formData.name.charAt(0)}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 text-[10px] font-mono font-bold text-white border border-[#0E111A]">
              Lv.8
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold font-rpg text-white">
              {formData.name}
            </h4>
            <p className="text-xs font-mono text-purple-400">
              @{formData.username}
            </p>
            <span className="text-[11px] font-mono text-slate-500 block mt-0.5">
              Avatar is linked to your character rank
            </span>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          {/* Full Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Full Name
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#07080E] border text-slate-200 transition-all focus:outline-none ${
                isEditing
                  ? 'border-purple-500/50 focus:border-purple-400 focus:ring-1 focus:ring-purple-500/30'
                  : 'border-slate-800 opacity-80 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                @
              </span>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#07080E] border text-slate-200 transition-all focus:outline-none ${
                  isEditing
                    ? 'border-purple-500/50 focus:border-purple-400 focus:ring-1 focus:ring-purple-500/30'
                    : 'border-slate-800 opacity-80 cursor-not-allowed'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="text-xs font-mono">
          <label className="block text-slate-300 font-semibold mb-1">
            Email Address
          </label>
          <input
            type="email"
            disabled={!isEditing}
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-[#07080E] border text-slate-200 transition-all focus:outline-none ${
              isEditing
                ? 'border-purple-500/50 focus:border-purple-400 focus:ring-1 focus:ring-purple-500/30'
                : 'border-slate-800 opacity-80 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Bio Textarea */}
        <div className="text-xs font-mono">
          <label className="block text-slate-300 font-semibold mb-1">
            Character Bio / Creed
          </label>
          <textarea
            rows={3}
            disabled={!isEditing}
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-[#07080E] border text-slate-200 transition-all resize-none focus:outline-none ${
              isEditing
                ? 'border-purple-500/50 focus:border-purple-400 focus:ring-1 focus:ring-purple-500/30'
                : 'border-slate-800 opacity-80 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Save Changes Button */}
        {isEditing && (
          <div className="flex justify-end pt-3 border-t border-slate-800/80">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold font-rpg text-xs text-white bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:brightness-110 active:scale-95 transition-all shadow-glow-crimson border border-red-500/40 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
