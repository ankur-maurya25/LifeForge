import React, { useState } from 'react';
import { 
  Swords, 
  ShieldAlert, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Zap, 
  Flame, 
  RotateCcw,
  Trophy,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_QUESTS = [
  { id: 1, title: 'Code React frontend structure (45 mins)', xp: 40, damage: 35, attribute: 'Focus', completed: false },
  { id: 2, title: 'Drink 2L water & 15m stretch', xp: 25, damage: 20, attribute: 'Vitality', completed: false },
  { id: 3, title: 'Review MongoDB schema design', xp: 50, damage: 45, attribute: 'Discipline', completed: false },
];

export default function InteractiveDemo() {
  const [bossHp, setBossHp] = useState(100);
  const maxHp = 100;
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [playerXp, setPlayerXp] = useState(120);
  const [playerLevel, setPlayerLevel] = useState(3);
  const [hitEffect, setHitEffect] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState(null);
  const [attributes, setAttributes] = useState({
    Focus: 24,
    Vitality: 18,
    Discipline: 30
  });

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleToggleQuest = (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    if (!quest.completed) {
      // Mark completed & deal damage
      const newHp = Math.max(0, bossHp - quest.damage);
      setBossHp(newHp);
      
      // Floating damage notice
      setFloatingDamage(`-${quest.damage} HP CRITICAL!`);
      setHitEffect(true);
      setTimeout(() => setHitEffect(false), 400);
      setTimeout(() => setFloatingDamage(null), 1200);

      // Player XP and attributes
      const newXp = playerXp + quest.xp;
      if (newXp >= 200) {
        setPlayerLevel(prev => prev + 1);
        setPlayerXp(newXp - 200);
        triggerConfetti();
      } else {
        setPlayerXp(newXp);
      }

      setAttributes(prev => ({
        ...prev,
        [quest.attribute]: prev[quest.attribute] + 5
      }));

      // If boss dies
      if (newHp === 0) {
        triggerConfetti();
      }

      setQuests(quests.map(q => q.id === questId ? { ...q, completed: true } : q));
    } else {
      // Revert quest
      setBossHp(prev => Math.min(maxHp, prev + quest.damage));
      setPlayerXp(prev => Math.max(0, prev - quest.xp));
      setAttributes(prev => ({
        ...prev,
        [quest.attribute]: Math.max(0, prev[quest.attribute] - 5)
      }));
      setQuests(quests.map(q => q.id === questId ? { ...q, completed: false } : q));
    }
  };

  const handleReset = () => {
    setBossHp(100);
    setQuests(INITIAL_QUESTS);
    setPlayerXp(120);
    setPlayerLevel(3);
    setAttributes({ Focus: 24, Vitality: 18, Discipline: 30 });
    setFloatingDamage(null);
  };

  const hpPercentage = Math.round((bossHp / maxHp) * 100);

  return (
    <section id="demo-arena" className="py-20 bg-gradient-to-b from-rpg-dark via-rpg-surface/80 to-rpg-dark relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            Interactive Combat Simulator
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-rpg text-white tracking-wide">
            Try It Now: Slay A <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Virtual Boss</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Check off the quests below to strike the boss. Real productivity converted into real RPG progression.
          </p>
        </div>

        {/* The Combat Arena Card */}
        <div className="max-w-5xl mx-auto bg-rpg-card/90 border border-rpg-border rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-rpg-border/70">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400">Active Campaign Goal</span>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>"Build & Launch My Full-Stack Project in 30 Days"</span>
              </h3>
            </div>
            
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
              title="Reset simulator"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo
            </button>
          </div>

          {/* Arena Grid: Boss on Left/Top, Quests & Stats on Right/Bottom */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-center">
            
            {/* BOSS CONTAINER (5 cols) */}
            <div className={`lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-slate-900/60 border border-slate-800 relative transition-transform ${hitEffect ? 'animate-boss-hit ring-2 ring-red-500/50' : ''}`}>
              
              {/* Floating Damage Text */}
              {floatingDamage && (
                <div className="absolute -top-4 font-black text-xl text-red-500 animate-bounce tracking-wider drop-shadow-md">
                  {floatingDamage}
                </div>
              )}

              {/* Boss Avatar Visual */}
              <div className="relative mb-5 group">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-br from-red-950/70 via-red-900/40 to-slate-900 flex items-center justify-center border-2 border-red-500/40 shadow-glow-crimson overflow-hidden">
                  {bossHp === 0 ? (
                    <div className="text-center p-4">
                      <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce mb-2" />
                      <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest font-mono">
                        DEFEATED!
                      </span>
                    </div>
                  ) : (
                    <div className="relative flex flex-col items-center">
                      <ShieldAlert className="w-20 h-20 text-red-500 transition-transform group-hover:scale-110" />
                      <span className="mt-2 text-[10px] font-mono font-bold text-red-400 tracking-wider">
                        CR: DISASTER TIER
                      </span>
                    </div>
                  )}
                </div>

                {bossHp > 0 && (
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500 text-[11px] font-bold text-red-300 whitespace-nowrap">
                    Lv. 14 Dread
                  </div>
                )}
              </div>

              {/* Boss Name */}
              <h4 className="text-xl font-bold font-rpg text-slate-100 text-center">
                {bossHp === 0 ? 'Malakor Obliterated!' : 'Malakor: Demon of Procrastination'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 text-center">
                {bossHp === 0 ? 'Reward unlocked: +150 Gold, Epic Dev Badge' : 'Feeds on skipped days and unfinished drafts'}
              </p>

              {/* Boss HP Bar */}
              <div className="w-full mt-6">
                <div className="flex justify-between text-xs font-semibold mb-1.5 font-mono">
                  <span className="text-red-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-red-400" />
                    BOSS HP
                  </span>
                  <span className={bossHp === 0 ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {bossHp} / {maxHp} ({hpPercentage}%)
                  </span>
                </div>
                <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      hpPercentage > 50 ? 'bg-gradient-to-r from-red-600 to-amber-500' :
                      hpPercentage > 20 ? 'bg-gradient-to-r from-red-700 to-red-500' :
                      'bg-red-600 animate-pulse'
                    }`}
                    style={{ width: `${hpPercentage}%` }}
                  />
                </div>
              </div>

            </div>

            {/* QUESTS & PLAYER PROGRESS (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Player Mini Stats Header */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-rpg font-bold text-amber-400">
                    {playerLevel}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      Adventurer Status
                      <span className="text-xs font-mono text-amber-400 font-semibold px-1.5 py-0.2 rounded bg-amber-500/10">
                        Rank III
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">XP: {playerXp} / 200 to next level</div>
                  </div>
                </div>

                {/* Attribute chips */}
                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="px-2.5 py-1 rounded bg-blue-950/60 border border-blue-500/30 text-blue-400 font-semibold">
                    ⚡ Focus: {attributes.Focus}
                  </div>
                  <div className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 font-semibold">
                    🛡️ Disc: {attributes.Discipline}
                  </div>
                  <div className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-semibold">
                    💚 Vit: {attributes.Vitality}
                  </div>
                </div>
              </div>

              {/* Quests Container */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Swords className="w-4 h-4 text-amber-400" />
                    Today's Boss-Damaging Quests (Click to strike)
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {quests.filter(q => q.completed).length} / {quests.length} Completed
                  </span>
                </div>

                <div className="space-y-3">
                  {quests.map(quest => (
                    <button
                      key={quest.id}
                      onClick={() => handleToggleQuest(quest.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 group ${
                        quest.completed
                          ? 'bg-emerald-950/20 border-emerald-600/40 text-slate-300'
                          : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/80 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {quest.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500 group-hover:text-amber-400 shrink-0 transition-colors" />
                        )}
                        <div>
                          <p className={`text-sm font-semibold ${quest.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                            {quest.title}
                          </p>
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="text-amber-400 font-bold">+{quest.xp} XP</span>
                            <span>•</span>
                            <span className="text-blue-400">+{quest.attribute} Stat</span>
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                          quest.completed 
                            ? 'bg-slate-800 text-slate-400' 
                            : 'bg-red-500/10 border border-red-500/30 text-red-400 group-hover:bg-red-500 group-hover:text-black transition-colors'
                        }`}>
                          ⚔️ {quest.damage} DMG
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tips note */}
              <div className="text-xs text-slate-400 bg-slate-900/40 p-3 rounded-lg border border-slate-800/80 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Every goal you configure in LifeForge will automatically create a custom-themed boss encounter, split into milestone chapters.
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
