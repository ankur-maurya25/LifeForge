import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BossSummaryRow from '../components/boss/BossSummaryRow';
import FeaturedBossCard from '../components/boss/FeaturedBossCard';
import BossCardItem from '../components/boss/BossCardItem';
import BossFiltersRow from '../components/boss/BossFiltersRow';
import BossDetailsModal from '../components/boss/BossDetailsModal';
import DefeatedBossesList from '../components/boss/DefeatedBossesList';

const INITIAL_BOSSES = [
  {
    id: 'boss-1',
    name: 'Procrastination Beast',
    difficulty: 'Hard',
    currentHp: 720,
    maxHp: 1000,
    damageDealt: 280,
    status: 'Active',
    icon: '🐉',
    description: 'The supreme lord of postponements and missed study sessions. Gains power each time you say "I will do it tomorrow".',
    weakness: '25-minute Pomodoro sprints and breaking big goals into sub-milestones.',
    reward: '+1,000 XP & Procrastination Slayer Title',
    recommendedAction: 'Launch 2 consecutive coding quests on the Quest Board today.'
  },
  {
    id: 'boss-2',
    name: 'Distraction Demon',
    difficulty: 'Medium',
    currentHp: 450,
    maxHp: 800,
    damageDealt: 350,
    status: 'Active',
    icon: '👁️',
    description: 'Manifests in notification pings, endless infinite reels, and 40 open browser tabs.',
    weakness: 'Airplane mode, shielded focus sessions, and morning deep work blocks.',
    reward: '+650 XP & Focus Aegis Sigil',
    recommendedAction: 'Conduct a 90-minute uninterrupted deep work sprint.'
  },
  {
    id: 'boss-3',
    name: 'Fear of Failure',
    difficulty: 'Hard',
    currentHp: 0,
    maxHp: 1200,
    damageDealt: 1200,
    status: 'Defeated',
    icon: '🗿',
    description: 'Paralyzes questers with self-doubt, over-planning, and perfectionism anxiety.',
    weakness: 'Shipping imperfect prototypes early and sharing public progress.',
    reward: '+500 XP & Imposter Slayer Trophy',
    recommendedAction: 'Conquered on Sep 05! Rematch available for streak multiplier.'
  },
  {
    id: 'boss-4',
    name: 'Inconsistency Monster',
    difficulty: 'Medium',
    currentHp: 0,
    maxHp: 800,
    damageDealt: 800,
    status: 'Defeated',
    icon: '⏳',
    description: 'Feeds on broken habit streaks and skipping two consecutive days of progress.',
    weakness: '2-minute daily minimum habit execution and automated habit tracking.',
    reward: '+350 XP & Habit Vanguard Sigil',
    recommendedAction: 'Conquered on Aug 28! Rematch available for streak multiplier.'
  },
  {
    id: 'boss-5',
    name: 'Overthinking Dragon',
    difficulty: 'Hard',
    currentHp: 0,
    maxHp: 1500,
    damageDealt: 1500,
    status: 'Defeated',
    icon: '🧠',
    description: 'Traps developers in infinite architecture reconsiderations and analysis paralysis.',
    weakness: 'Rapid prototyping, timeboxed decision timers, and frequent git commits.',
    reward: '+750 XP & Rapid Executioner Crest',
    recommendedAction: 'Conquered on Aug 18! Rematch available for streak multiplier.'
  },
  {
    id: 'boss-6',
    name: 'Comfort Zone Titan',
    difficulty: 'Epic',
    currentHp: 2500,
    maxHp: 2500,
    damageDealt: 0,
    status: 'Locked',
    icon: '🛡️',
    description: 'The colossal guardian of complacency. Defends familiar routines and resists scary ambitions.',
    weakness: 'Public product demos, cold professional reachouts, and competitive hackathon submissions.',
    reward: '+2,500 XP & Titan Conqueror Medallion',
    recommendedAction: 'Reach Character Level 10 to unlock this epic confrontation.'
  }
];

export default function BossCollectionPage() {
  const navigate = useNavigate();
  const [bosses, setBosses] = useState(INITIAL_BOSSES);
  const [statusFilter, setStatusFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All Difficulties');
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [notice, setNotice] = useState(null);

  // Status counts
  const statusCounts = useMemo(() => {
    return {
      All: bosses.length,
      Active: bosses.filter((b) => b.status === 'Active').length,
      Defeated: bosses.filter((b) => b.status === 'Defeated').length,
      Locked: bosses.filter((b) => b.status === 'Locked').length
    };
  }, [bosses]);

  // Filter logic
  const filteredBosses = useMemo(() => {
    return bosses.filter((b) => {
      // Status filter
      if (statusFilter !== 'All' && b.status !== statusFilter) {
        return false;
      }
      // Difficulty filter
      if (difficultyFilter !== 'All Difficulties' && b.difficulty !== difficultyFilter) {
        return false;
      }
      return true;
    });
  }, [bosses, statusFilter, difficultyFilter]);

  // Action: Open Modal
  const handleViewBoss = (boss) => {
    setSelectedBoss(boss);
  };

  // Action: Start Battle
  const handleStartBattle = (boss) => {
    setSelectedBoss(null);
    navigate('/boss-battle');
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 font-sans pb-24">
      
      {/* 1. TOP COMMAND HEADER */}
      <header className="sticky top-0 z-40 bg-[#0B0D14]/90 backdrop-blur-md border-b border-[#1E2538] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Title */}
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
                <span className="text-red-500 text-sm">🐉</span>
                <h1 className="text-base sm:text-lg font-bold font-rpg text-white tracking-wide">
                  BOSS COLLECTION
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                  3 Bosses Defeated
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Defeat your distractions, habits and challenges
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/dashboard"
              className="px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Dashboard</span>
            </Link>

            <Link
              to="/boss-battle"
              className="px-3 py-1.5 rounded-xl border border-red-900/40 bg-red-950/30 hover:bg-red-950/60 text-xs font-mono text-red-300 hover:text-red-200 transition-colors hidden sm:flex items-center gap-1.5"
            >
              <span>⚔️</span>
              <span>Active Battle Arena</span>
            </Link>

            <Link
              to="/character"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800 transition-colors group"
              title="View Character Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-bold text-xs font-rpg text-black group-hover:scale-105 transition-transform">
                A
              </div>
              <span className="text-xs font-mono text-slate-300 group-hover:text-amber-300 hidden md:block transition-colors">
                Ankur (Lv.8)
              </span>
            </Link>
          </div>

        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Dynamic Alert Banner */}
        {notice && (
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-200 flex items-center gap-2 animate-in fade-in duration-200">
            <span>⚔️</span>
            <span>{notice}</span>
          </div>
        )}

        {/* 1. BOSS SUMMARY CARDS */}
        <BossSummaryRow
          totalBosses={6}
          activeBosses={2}
          defeatedBosses={3}
          totalDamageDealt={3850}
        />

        {/* 2. FEATURED MAIN BOSS */}
        <FeaturedBossCard
          bossName="Procrastination Beast"
          level={15}
          currentHp={720}
          maxHp={1000}
          daysRemaining={18}
        />

        {/* 3. FILTER CONTROLS */}
        <BossFiltersRow
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          difficultyFilter={difficultyFilter}
          onDifficultyChange={setDifficultyFilter}
          statusCounts={statusCounts}
        />

        {/* 4. BOSS COLLECTION GRID */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span>Catalogued Nemeses</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                {filteredBosses.length} {filteredBosses.length === 1 ? 'Boss' : 'Bosses'}
              </span>
            </h3>

            {(statusFilter !== 'All' || difficultyFilter !== 'All Difficulties') && (
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setDifficultyFilter('All Difficulties');
                }}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>

          {filteredBosses.length === 0 ? (
            <div className="bg-[#0E111A] border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xl">
              <span className="text-3xl block mb-2">🐉</span>
              <h4 className="text-base font-bold font-rpg text-white mb-1">
                No Nemeses Found
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                No bosses match your active filter parameters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredBosses.map((boss) => (
                <BossCardItem
                  key={boss.id}
                  boss={boss}
                  onViewBoss={handleViewBoss}
                />
              ))}
            </div>
          )}
        </section>

        {/* 5. DEFEATED BOSSES SECTION */}
        <DefeatedBossesList />

      </main>

      {/* 6. BOSS DETAILS MODAL */}
      <BossDetailsModal
        isOpen={Boolean(selectedBoss)}
        boss={selectedBoss}
        onClose={() => setSelectedBoss(null)}
        onStartBattle={handleStartBattle}
      />

    </div>
  );
}
