import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi } from '../services/api';
import ProfileCard from '../components/settings/ProfileCard';
import PreferencesCard from '../components/settings/PreferencesCard';
import AppearanceCard from '../components/settings/AppearanceCard';
import AccountInfoCard from '../components/settings/AccountInfoCard';
import DangerZoneCard from '../components/settings/DangerZoneCard';
import ResetConfirmModal from '../components/settings/ResetConfirmModal';

const INITIAL_PREFERENCES = {
  dailyReminders: true,
  soundEffects: true,
  showCompletedQuests: true,
  compactView: false
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, token, logout, updateUser } = useAuth();

  // Profile & Account state initialized from authenticated user
  const [profile, setProfile] = useState({
    name: user?.name || 'Valiant Quester',
    username: user?.username || 'quester',
    email: user?.email || '',
    bio: 'Building goals, completing quests and becoming better every day.'
  });

  const [preferences, setPreferences] = useState(INITIAL_PREFERENCES);
  const [selectedTheme, setSelectedTheme] = useState('dark');

  const [account, setAccount] = useState({
    accountType: user?.role === 'admin' ? 'Realm Guardian (Admin)' : 'Valiant Adventurer',
    characterName: user?.name || 'Hero',
    level: user?.level || 1,
    questsCompleted: user?.xp ? Math.floor(user.xp / 50) : 0,
    accountStatus: user?.status === 'suspended' ? 'Suspended' : 'Active',
    realmServer: 'LifeForge Global Realm (Cluster 1)',
    joinedDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'
  });

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        username: user.username || prev.username,
        email: user.email || prev.email
      }));

      setAccount({
        accountType: user.role === 'admin' ? 'Realm Guardian (Admin)' : 'Valiant Adventurer',
        characterName: user.name || 'Hero',
        level: user.level || 1,
        questsCompleted: user.xp ? Math.floor(user.xp / 50) : 0,
        accountStatus: user.status === 'suspended' ? 'Suspended' : 'Active',
        realmServer: 'LifeForge Global Realm (Cluster 1)',
        joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'
      });
    }
  }, [user]);

  // Modal & Notice States
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [notice, setNotice] = useState({
    message: '⚔️ Settings Command Center: customize profile parameters and gameplay preferences.',
    type: 'info'
  });

  // Action: Save Profile to backend
  const handleSaveProfile = async (updatedProfile) => {
    setProfile(updatedProfile);
    if (token) {
      try {
        const res = await updateProfileApi({ name: updatedProfile.name, bio: updatedProfile.bio }, token);
        if (res?.success && res.user) {
          if (updateUser) updateUser(res.user);
          setNotice({
            message: '✓ Profile changes saved securely to realm server!',
            type: 'success'
          });
          return;
        }
      } catch (err) {
        console.warn('Profile update sync:', err.message);
      }
    }
    setNotice({
      message: '✓ Profile changes saved locally.',
      type: 'success'
    });
  };

  // Action: Toggle Preference Switch
  const handleTogglePreference = (prefKey) => {
    setPreferences((prev) => {
      const nextVal = !prev[prefKey];
      const updated = { ...prev, [prefKey]: nextVal };
      setNotice({
        message: `⚙️ Preference updated: ${prefKey} is now ${nextVal ? 'enabled' : 'disabled'}.`,
        type: 'info'
      });
      return updated;
    });
  };

  // Action: Select Theme
  const handleSelectTheme = (themeId) => {
    setSelectedTheme(themeId);
    const themeNames = {
      dark: 'Dark Realm',
      purple: 'Void Purple',
      blue: 'Cyber Mana'
    };
    setNotice({
      message: `🎨 Visual aura set to ${themeNames[themeId] || themeId}.`,
      type: 'info'
    });
  };

  // Action: Reset Demo
  const handleConfirmReset = () => {
    setPreferences(INITIAL_PREFERENCES);
    setSelectedTheme('dark');
    setIsResetModalOpen(false);
    setNotice({
      message: '🔄 Preferences and theme restored to defaults.',
      type: 'info'
    });
  };

  // Action: Logout clicked
  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 font-sans pb-24">
      
      {/* 1. TOP COMMAND HEADER */}
      <header className="sticky top-0 z-40 bg-[#0B0D14]/90 backdrop-blur-md border-b border-[#1E2538] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo, Title & Subtitle */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl text-red-600 font-serif leading-none">†</span>
              <span className="font-rpg text-xl font-bold tracking-wider text-red-600 group-hover:text-red-500 transition-colors">
                LifeForge
              </span>
            </Link>

            <div className="hidden sm:block h-6 w-px bg-slate-800" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400 text-sm">⚙️</span>
                <h1 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide">
                  SETTINGS
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Manage your profile, preferences and account
              </p>
            </div>
          </div>

          {/* Navigation & Avatar */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Dashboard</span>
            </Link>

            <Link
              to="/character"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800 transition-colors group"
              title="View Character Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-bold text-xs font-rpg text-black group-hover:scale-105 transition-transform">
                {profile.name.charAt(0)}
              </div>
              <span className="text-xs font-mono text-slate-300 group-hover:text-amber-300 hidden md:block transition-colors">
                {profile.name.split(' ')[0]} (Lv.8)
              </span>
            </Link>
          </div>

        </div>
      </header>

      {/* 2. MAIN BODY CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Real-time Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-[#0E111A] border border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                notice.type === 'success'
                  ? 'bg-emerald-400'
                  : notice.type === 'danger'
                  ? 'bg-red-500'
                  : 'bg-purple-400'
              } animate-pulse shrink-0`}
            />
            <span className="text-slate-300">{notice.message}</span>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            Node.js & MongoDB integration in Step 2
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Profile & Preferences (7 COLS) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 2. Profile Settings Card */}
            <ProfileCard
              profile={profile}
              onSaveProfile={handleSaveProfile}
            />

            {/* 3. Game Preferences Card */}
            <PreferencesCard
              preferences={preferences}
              onTogglePreference={handleTogglePreference}
            />

            {/* 4. Appearance Card */}
            <AppearanceCard
              selectedTheme={selectedTheme}
              onSelectTheme={handleSelectTheme}
            />
          </div>

          {/* RIGHT COLUMN: Account Metrics & Danger Zone (5 COLS) */}
          <div className="lg:col-span-5 space-y-8">
            {/* 5. Account Information Card */}
            <AccountInfoCard account={account} />

            {/* 6. Danger Zone Card */}
            <DangerZoneCard
              onRequestReset={() => setIsResetModalOpen(true)}
              onLogoutClick={handleLogoutClick}
            />
          </div>

        </div>

      </main>

      {/* 7. RESET CONFIRMATION MODAL */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

    </div>
  );
}
