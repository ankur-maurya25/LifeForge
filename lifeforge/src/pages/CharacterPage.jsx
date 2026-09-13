import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAchievements } from '../services/api';
import CharacterHeader from '../components/character/CharacterHeader';
import CharacterStats from '../components/character/CharacterStats';
import SkillTree from '../components/character/SkillTree';
import AchievementsList from '../components/character/AchievementsList';
import RecentProgress from '../components/character/RecentProgress';

const INITIAL_CHARACTER = {
  name: 'Ankur',
  title: 'The Goal Crusher',
  level: 8,
  currentXp: 640,
  maxXp: 1000,
  rank: 'RISING BUILDER',
  characterClass: 'Architect of Systems & Code'
};

const INITIAL_SKILLS = [
  {
    id: 'consistency',
    name: 'Consistency',
    description: 'Maintains daily quest streaks with 1.5x damage bonus against procrastination bosses.',
    icon: '⏳',
    status: 'unlocked',
    progress: 100,
    requirement: 'Mastered'
  },
  {
    id: 'deep-work',
    name: 'Deep Work',
    description: 'Enables 90-minute uninterrupted sprints with +20% focus attribute gain.',
    icon: '⚡',
    status: 'unlocked',
    progress: 100,
    requirement: 'Mastered'
  },
  {
    id: 'problem-solving-skill',
    name: 'Problem Solving',
    description: 'Deconstructs complex system challenges into manageable daily combat objectives.',
    icon: '🧩',
    status: 'in_progress',
    progress: 65,
    requirement: 'Complete 5 more DSA quests'
  },
  {
    id: 'project-building',
    name: 'Project Building',
    description: 'Translates architectural schemas into fully functioning production web apps.',
    icon: '🏗️',
    status: 'in_progress',
    progress: 40,
    requirement: 'Clear Milestone 3 in active goal'
  },
  {
    id: 'fast-learning',
    name: 'Fast Learning',
    description: 'Accelerates attribute gain from study quests by 25%.',
    icon: '📖',
    status: 'locked',
    progress: 0,
    requirement: 'Reach Character Level 10',
    canUnlock: false
  },
  {
    id: 'team-leadership',
    name: 'Team Leadership',
    description: 'Enables group campaigns, guild boss raids, and collaborative accountability.',
    icon: '👑',
    status: 'locked',
    progress: 0,
    requirement: 'Defeat 3 Campaign Bosses',
    canUnlock: false
  }
];

export default function CharacterPage() {
  const { user, token } = useAuth();
  // Character State
  const [character, setCharacter] = useState({
    name: user?.name || 'Ankur',
    title: 'The Goal Crusher',
    level: user?.level || 1,
    currentXp: user?.xp || 0,
    maxXp: ((user?.level || 1) * 500),
    rank: 'RISING BUILDER',
    characterClass: 'Architect of Systems & Code'
  });
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [backendAchievements, setBackendAchievements] = useState([]);
  const [notice, setNotice] = useState({
    message: '⚔️ Welcome to your Character & Skill Tree. Level up your real-life attributes through completed quests.',
    type: 'info'
  });

  useEffect(() => {
    if (user) {
      setCharacter((prev) => ({
        ...prev,
        name: user.name || prev.name,
        level: user.level || prev.level,
        currentXp: user.xp || prev.currentXp,
        maxXp: (user.level || 1) * 500
      }));
    }
  }, [user]);

  useEffect(() => {
    async function loadAchievements() {
      if (!token) return;
      try {
        const res = await getAchievements(token);
        if (res && res.success && res.data) {
          const mapped = res.data.slice(0, 5).map((a) => ({
            id: a._id,
            name: a.title,
            description: a.description,
            icon: a.icon,
            earned: a.isUnlocked,
            earnedDate: a.unlockedAt ? new Date(a.unlockedAt).toLocaleDateString() : undefined,
            requirement: `${Math.min(a.currentValue, a.requirementValue)}/${a.requirementValue} Completed`,
            reward: `+${a.xpReward} XP`
          }));
          setBackendAchievements(mapped);
        }
      } catch (err) {
        // Fallback to default mock in list
      }
    }
    loadAchievements();
  }, [token]);

  // Action: Gain XP demo test
  const handleGainDemoXp = () => {
    setCharacter((prev) => {
      const nextXp = prev.currentXp + 50;
      if (nextXp >= prev.maxXp) {
        setNotice({
          message: `🎉 LEVEL UP! You reached Level ${prev.level + 1}! A new skill slot has been unlocked.`,
          type: 'success'
        });
        return {
          ...prev,
          level: prev.level + 1,
          currentXp: nextXp - prev.maxXp,
          maxXp: prev.maxXp + 200
        };
      }
      setNotice({
        message: `⚡ +50 XP gained! Level ${prev.level} progress updated to ${nextXp} / ${prev.maxXp} XP. (Local demo state)`,
        type: 'success'
      });
      return {
        ...prev,
        currentXp: nextXp
      };
    });
  };

  // Action: Advance In-Progress Skill
  const handleAdvanceSkill = (skillId) => {
    setSkills((prev) =>
      prev.map((skill) => {
        if (skill.id === skillId) {
          const nextProgress = Math.min(100, skill.progress + 15);
          const isNowUnlocked = nextProgress >= 100;
          if (isNowUnlocked) {
            setNotice({
              message: `✨ Skill Mastered! “${skill.name}” is now UNLOCKED and fully active!`,
              type: 'success'
            });
            return {
              ...skill,
              progress: 100,
              status: 'unlocked',
              requirement: 'Mastered'
            };
          }
          setNotice({
            message: `⚡ Practiced “${skill.name}”. Progress advanced to ${nextProgress}%.`,
            type: 'info'
          });
          return {
            ...skill,
            progress: nextProgress
          };
        }
        return skill;
      })
    );
  };

  // Action: Unlock Skill
  const handleUnlockSkill = (skillId) => {
    setSkills((prev) =>
      prev.map((skill) => {
        if (skill.id === skillId) {
          setNotice({
            message: `✨ Skill Unlocked: “${skill.name}”! Passive perks are now active.`,
            type: 'success'
          });
          return {
            ...skill,
            status: 'unlocked',
            progress: 100,
            requirement: 'Mastered'
          };
        }
        return skill;
      })
    );
  };

  // Action: Reset Demo
  const handleResetDemo = () => {
    setCharacter(INITIAL_CHARACTER);
    setSkills(INITIAL_SKILLS);
    setNotice({
      message: '🔄 Character demo state has been reset to default values.',
      type: 'info'
    });
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 font-sans pb-20">
      
      {/* 1. TOP COMMAND HEADER */}
      <header className="sticky top-0 z-40 bg-[#0B0D14]/90 backdrop-blur-md border-b border-[#1E2538] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand & Breadcrumbs */}
          <div className="flex items-center gap-3 sm:gap-4">
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
              <span>←</span>
              <span className="hidden sm:inline">Back to</span> Dashboard
            </Link>
          </div>

          {/* Nav Links & Reset */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/quests"
              className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <span>📋</span>
              <span className="hidden sm:inline">Quest Board</span>
            </Link>

            <Link
              to="/boss-battle"
              className="px-3 py-1.5 rounded-xl border border-red-900/40 bg-red-950/20 hover:bg-red-950/40 text-xs font-mono text-red-300 hover:text-red-200 transition-colors flex items-center gap-1.5"
            >
              <span>⚔️</span>
              <span className="hidden sm:inline">Boss Battle</span>
            </Link>

            <button
              onClick={handleResetDemo}
              className="px-2.5 py-1.5 rounded-xl border border-slate-800 bg-black/40 hover:bg-slate-800 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Reset character demo state"
            >
              Reset
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN BODY CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Local Demo State Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-[#0E111A] border border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                notice.type === 'success' ? 'bg-emerald-400' : 'bg-amber-400'
              } animate-pulse shrink-0`}
            />
            <span className="text-slate-300">{notice.message}</span>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            Local React State • Zero localStorage
          </div>
        </div>

        {/* 1. CHARACTER HEADER */}
        <CharacterHeader
          character={character}
          onGainDemoXp={handleGainDemoXp}
        />

        {/* 2. CHARACTER ATTRIBUTES & STATS */}
        <CharacterStats />

        {/* 3. SKILL TREE SECTION */}
        <SkillTree
          skills={skills}
          onAdvanceSkill={handleAdvanceSkill}
          onUnlockSkill={handleUnlockSkill}
        />

        {/* 4. ACHIEVEMENTS SECTION */}
        <AchievementsList
          {...(backendAchievements.length > 0 ? { achievements: backendAchievements } : {})}
        />

        {/* 5. RECENT PROGRESS TIMELINE */}
        <RecentProgress />

      </main>
    </div>
  );
}
