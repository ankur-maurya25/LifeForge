import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuests, getGoals, completeQuest } from '../services/api';
import BossArena from '../components/battle/BossArena';
import PlayerStatus from '../components/battle/PlayerStatus';
import QuestAttackCard from '../components/battle/QuestAttackCard';
import BattleLog from '../components/battle/BattleLog';
import VictoryState from '../components/battle/VictoryState';

const INITIAL_ATTACK_QUESTS = [
  {
    id: 'attack-1',
    title: 'Complete frontend UI',
    description: 'Implement responsive views, interactive components, and clean styling.',
    category: 'Coding',
    difficulty: 'Medium',
    xp: 50,
    damage: 10,
    completed: false
  },
  {
    id: 'attack-2',
    title: 'Practice 2 DSA problems',
    description: 'Solve dynamic programming and tree traversal challenges.',
    category: 'Problem Solving',
    difficulty: 'Medium',
    xp: 40,
    damage: 8,
    completed: false
  },
  {
    id: 'attack-3',
    title: 'Work on backend API',
    description: 'Structure controllers, write authentication middleware, and error handlers.',
    category: 'Development',
    difficulty: 'Hard',
    xp: 60,
    damage: 15,
    completed: false
  }
];

const INITIAL_LOGS = [
  {
    id: 1,
    icon: '🏰',
    message: 'You entered the boss arena.',
    subtext: 'The Procrastination King emerges from the shadows.',
    time: 'Combat Start',
    color: 'text-amber-400'
  }
];

export default function BossBattlePage() {
  const { user, token, updateUser } = useAuth();

  // Combat State
  const initialHp = 720;
  const maxHp = 1000;
  const [currentHp, setCurrentHp] = useState(initialHp);
  const [playerXp, setPlayerXp] = useState(user?.xp || 640);
  const [quests, setQuests] = useState(INITIAL_ATTACK_QUESTS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  
  // Animation & Feedback
  const [isHit, setIsHit] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState(null);
  const [hasActiveGoal, setHasActiveGoal] = useState(true);

  // Sync real quests and active goals from backend
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    async function loadCombatData() {
      try {
        const [goalRes, questRes] = await Promise.all([
          getGoals(token).catch(() => null),
          getQuests(token).catch(() => null)
        ]);

        if (!isMounted) return;

        if (goalRes?.success && Array.isArray(goalRes.goals) && goalRes.goals.length > 0) {
          const primaryGoal = goalRes.goals.find(g => g.status === 'active') || goalRes.goals[0];
          if (primaryGoal) {
            const calculatedHp = Math.max(10, 100 - (primaryGoal.progress || 0)) * 10;
            setCurrentHp(calculatedHp);
            setHasActiveGoal(true);
          }
        }

        if (questRes?.success && Array.isArray(questRes.quests) && questRes.quests.length > 0) {
          const mappedQuests = questRes.quests.slice(0, 6).map((q) => {
            const dmg = q.difficulty === 'Hard' ? 15 : q.difficulty === 'Medium' ? 10 : 6;
            return {
              id: q._id,
              title: q.title,
              description: q.description || 'Target strike against the realm nemesis.',
              category: q.goalId?.category || 'Combat Quest',
              difficulty: q.difficulty || 'Medium',
              xp: q.xpReward || 50,
              damage: dmg,
              completed: q.status === 'completed'
            };
          });
          setQuests(mappedQuests);
        }
      } catch (err) {
        console.warn('Combat data sync notice:', err.message);
      }
    }

    loadCombatData();
    return () => { isMounted = false; };
  }, [token]);

  useEffect(() => {
    if (user?.xp !== undefined) {
      setPlayerXp(user.xp);
    }
  }, [user?.xp]);

  const handleExecuteAttack = async (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    // 1. Calculate new HP & XP
    const newHp = Math.max(0, currentHp - quest.damage * 10);
    const newXp = playerXp + quest.xp;

    // 2. Trigger visual damage feedback
    setFloatingDamage(`-${quest.damage * 10} HP CRITICAL!`);
    setIsHit(true);
    setTimeout(() => setIsHit(false), 400);
    setTimeout(() => setFloatingDamage(null), 1200);

    // 3. Update state
    setCurrentHp(newHp);
    setPlayerXp(newXp);
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, completed: true } : q));

    // 4. If this is a real backend quest (24 hex characters), complete via API
    if (token && typeof questId === 'string' && questId.length === 24) {
      try {
        const res = await completeQuest(questId, token);
        if (res?.success && res.user && updateUser) {
          updateUser(res.user);
        }
      } catch (e) {
        console.warn('Quest completion sync:', e.message);
      }
    }

    // 5. Append to Battle Log
    const newLogs = [
      {
        id: Date.now() + 1,
        icon: '⚔️',
        message: `${quest.title} completed.`,
        subtext: `The Nemesis lost ${quest.damage * 10} HP.`,
        time: 'Just now',
        color: 'text-red-400'
      },
      {
        id: Date.now() + 2,
        icon: '⚡',
        message: `You earned +${quest.xp} XP.`,
        subtext: 'Character discipline & focus heightened.',
        time: 'Just now',
        color: 'text-amber-400'
      }
    ];

    if (newHp === 0) {
      newLogs.unshift({
        id: Date.now() + 3,
        icon: '🏆',
        message: 'The Nemesis has been vanquished!',
        subtext: 'Victory achieved. Goal progress fulfilled.',
        time: 'Victory',
        color: 'text-emerald-400'
      });
    }

    setLogs(prev => [...newLogs, ...prev]);
  };

  const handleResetBattle = () => {
    setCurrentHp(initialHp);
    setPlayerXp(user?.xp || 640);
    setLogs(INITIAL_LOGS);
    setFloatingDamage(null);
  };

  // Instant simulation: drop boss HP to 0 for demo review of Victory state
  const handleInstantSimulateDefeat = () => {
    setCurrentHp(0);
    setLogs(prev => [
      {
        id: Date.now(),
        icon: '🏆',
        message: 'Direct mortal strike! The Procrastination King collapsed.',
        subtext: 'Victory achieved.',
        time: 'Victory',
        color: 'text-emerald-400'
      },
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 font-sans pb-24">
      
      {/* 1. TOP NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#0B0D14]/90 backdrop-blur-md border-b border-[#1E2538] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Back Link */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl text-red-600 font-serif leading-none">†</span>
              <span className="font-rpg text-xl font-bold tracking-wider text-red-600 group-hover:text-red-500 transition-colors">
                LifeForge
              </span>
            </Link>

            <span className="text-slate-700">/</span>

            <Link
              to="/dashboard"
              className="text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <span>←</span> Back to Dashboard
            </Link>

            <span className="text-slate-700 hidden sm:inline">/</span>

            <Link
              to="/quests"
              className="text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors hidden sm:flex items-center gap-1.5"
            >
              <span>📋</span> Quest Board
            </Link>

            <span className="text-slate-700 hidden sm:inline">/</span>

            <Link
              to="/bosses"
              className="text-xs font-mono text-slate-400 hover:text-red-400 transition-colors hidden sm:flex items-center gap-1.5"
            >
              <span>🐉</span> Boss Collection
            </Link>
          </div>

          {/* Profile & Demo Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHasActiveGoal(!hasActiveGoal)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-amber-400 transition-colors hidden sm:block"
            >
              {hasActiveGoal ? 'Preview Fallback State' : 'Preview Active Battle'}
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-bold text-xs font-rpg text-black">
                A
              </div>
              <span className="text-xs font-mono text-slate-300 hidden md:block">
                Ankur (Lv.8)
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN ARENA CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* 9. EMPTY / NO ACTIVE GOAL FALLBACK STATE */}
        {!hasActiveGoal ? (
          <div className="bg-[#0E111A] border border-slate-800 rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden my-12">
            <div className="w-16 h-16 rounded-2xl bg-red-950/50 border border-red-500/40 flex items-center justify-center mx-auto mb-4 text-3xl shadow-glow-crimson">
              🗡️
            </div>
            <h2 className="text-2xl font-bold font-rpg text-white mb-2">
              No active boss found.
            </h2>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              Your battle chamber is currently dormant. Forge an ambition to summon your next nemesis.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/create-goal"
                className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:brightness-110 active:scale-95 transition-all shadow-glow-crimson border border-red-500/50 cursor-pointer inline-flex items-center gap-2 font-mono uppercase"
              >
                <span>Create a New Goal</span>
                <span>→</span>
              </Link>
              <button
                onClick={() => setHasActiveGoal(true)}
                className="px-5 py-3 rounded-xl font-semibold text-xs text-slate-300 bg-slate-900 border border-slate-700 hover:text-white"
              >
                Return to Active Demo
              </button>
            </div>
          </div>
        ) : (
          <div>
            
            {/* 2. GOAL AND BOSS HEADER */}
            <div className="mb-8 p-6 rounded-2xl bg-[#0E111A] border border-[#1E2538] shadow-lg flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-400 px-2 py-0.5 rounded bg-red-950/50 border border-red-500/30">
                    BOSS BATTLE
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Every completed quest brings you closer to victory.
                  </span>
                </div>

                <h1 className="text-xl sm:text-3xl font-black font-rpg text-white mt-1">
                  “Build My First Full-Stack Project”
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Confronting: <strong className="text-red-400">THE PROCRASTINATION KING</strong>
                </p>
              </div>

              {/* Header Badges & Actions */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-mono font-semibold px-3 py-1 rounded-lg bg-blue-950/50 border border-blue-500/30 text-blue-300">
                  Category: Coding
                </span>
                <span className="text-xs font-mono font-semibold px-3 py-1 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300">
                  Difficulty: Epic
                </span>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-amber-950/50 border border-amber-500/30 text-amber-300">
                  ⏳ 18 days remaining
                </span>

                <button
                  type="button"
                  onClick={handleResetBattle}
                  className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 transition-colors ml-2"
                  title="Reset demo fight"
                >
                  ↺ Reset Demo Battle
                </button>
              </div>
            </div>

            {/* 8. CONDITIONAL VICTORY STATE */}
            {currentHp <= 0 ? (
              <div className="mb-12">
                <VictoryState
                  bossName="THE PROCRASTINATION KING"
                  goalTitle="Build My First Full-Stack Project"
                  onReset={handleResetBattle}
                />
              </div>
            ) : (
              /* MAIN 2-COLUMN COMBAT ARENA */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* ================= LEFT COLUMN: MAIN BOSS ARENA & QUEST ATTACKS (7 COLS) ================= */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* 3. MAIN BOSS ARENA CARD */}
                  <BossArena
                    bossName="THE PROCRASTINATION KING"
                    bossLevel="LEVEL 08"
                    currentHp={currentHp}
                    maxHp={maxHp}
                    initialHp={initialHp}
                    isHit={isHit}
                    floatingDamage={floatingDamage}
                  />

                  {/* 5. AVAILABLE QUEST ATTACKS */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold font-rpg text-white tracking-wide flex items-center gap-2">
                          <span>CHOOSE YOUR ATTACK</span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950/50 text-red-400 border border-red-500/30">
                            Combat Quests
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          Click "Complete Quest" to trigger boss damage in this demo
                        </p>
                      </div>

                      <button
                        onClick={handleInstantSimulateDefeat}
                        className="text-[11px] font-mono text-slate-500 hover:text-amber-400 underline cursor-pointer"
                      >
                        [Simulate Defeat]
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {quests.map(quest => (
                        <QuestAttackCard
                          key={quest.id}
                          quest={quest}
                          onExecuteAttack={handleExecuteAttack}
                          isBossDefeated={currentHp <= 0}
                        />
                      ))}
                    </div>
                  </div>

                </div>

                {/* ================= RIGHT COLUMN: PLAYER STATUS & BATTLE LOG (5 COLS) ================= */}
                <div className="lg:col-span-5 space-y-8">
                  
                  {/* 4. PLAYER STATUS CARD */}
                  <PlayerStatus
                    playerName="Ankur"
                    level="LEVEL 08"
                    currentXp={playerXp}
                    maxXp={1000}
                    rank="RISING BUILDER"
                    stats={{ coding: 72, focus: 64, discipline: 58 }}
                  />

                  {/* 7. LIVE BATTLE LOG */}
                  <BattleLog logs={logs} />

                  {/* Combat Mechanics Explainer Box */}
                  <div className="p-4 rounded-2xl bg-[#0E111A] border border-slate-800 text-xs font-mono text-slate-400 space-y-2">
                    <div className="text-amber-400 font-bold flex items-center gap-1.5">
                      <span>💡</span> Goal-to-Boss Engine Rule:
                    </div>
                    <p className="leading-relaxed">
                      Each completed quest strikes direct damage to the boss HP bar. Completing all daily quests prevents boss rage regeneration at midnight.
                    </p>
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                      Local React state active • Step 2 will sync damage to MongoDB
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
