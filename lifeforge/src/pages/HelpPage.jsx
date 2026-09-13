import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactErrors, setContactErrors] = useState({});
  const [contactSuccess, setContactSuccess] = useState('');

  // Categories list
  const categories = ['All', 'General', 'Goals', 'Quests', 'Boss Battles', 'Rewards'];

  // Quick Help Cards
  const quickHelpCards = [
    {
      icon: '🚀',
      title: 'Getting Started',
      description: 'Learn the fundamentals of creating your adventurer and navigating realms.',
      category: 'General'
    },
    {
      icon: '🎯',
      title: 'Goals & Quests',
      description: 'How to break down huge real-life goals into bite-sized daily RPG quests.',
      category: 'Goals'
    },
    {
      icon: '🐉',
      title: 'Boss Battles',
      description: 'Understand how daily quest progress deals direct damage to procrastination titans.',
      category: 'Boss Battles'
    },
    {
      icon: '⚡',
      title: 'XP & Skills',
      description: 'Gain character levels, boost attributes, and earn rare milestone badges.',
      category: 'Rewards'
    },
  ];

  // At least 10 comprehensive FAQ questions
  const faqs = [
    {
      id: 1,
      category: 'General',
      question: 'What is LifeForge?',
      answer: 'LifeForge is a productivity SaaS application blended with a dark fantasy RPG engine. It turns your actual real-world goals and daily habits into epic boss battles and character skill progression.'
    },
    {
      id: 2,
      category: 'Goals',
      question: 'How do I create a goal?',
      answer: 'Navigate to "Create Goal" from the Dashboard or navigation bar. Choose your target objective, assign a category (Coding, Fitness, Study, etc.), choose difficulty, and our Goal-to-Boss engine will forge a custom boss threat representing that milestone.'
    },
    {
      id: 3,
      category: 'Quests',
      question: 'How are quests generated?',
      answer: 'When you create a goal, LifeForge automatically generates recurring daily quests and habit sprints. You can also manually add custom quests from your Quest Management Board.'
    },
    {
      id: 4,
      category: 'Boss Battles',
      question: 'How do quests damage the boss?',
      answer: 'Every completed quest strike deals physical and magical damage proportional to the quest difficulty. Checking off routine habits consistently depletes the boss HP bar until they are vanquished.'
    },
    {
      id: 5,
      category: 'Rewards',
      question: 'How is XP earned?',
      answer: 'XP is rewarded each time a daily quest is cleared, when daily streaks are preserved, when party raid milestones are conquered, or when an epic boss is defeated.'
    },
    {
      id: 6,
      category: 'Rewards',
      question: 'What are skills?',
      answer: 'Skills represent your real-life attributes such as Coding, Discipline, Deep Focus, Problem Solving, and Communication. Completing associated quests increases their levels and unlocks skill mastery ranks.'
    },
    {
      id: 7,
      category: 'General',
      question: 'How do streaks work?',
      answer: 'Completing at least one primary goal quest every consecutive day maintains your streak flame. Higher streaks grant percentage multipliers to your earned XP and special guild recognition.'
    },
    {
      id: 8,
      category: 'Boss Battles',
      question: 'What happens after defeating a boss?',
      answer: 'Defeating a boss awards legendary milestone XP, archives the triumph into your Boss Collection trophy room, and prompts you to level up your next major life horizon.'
    },
    {
      id: 9,
      category: 'Goals',
      question: 'Can I edit my goal?',
      answer: 'Yes! You can edit your active goal deadlines, descriptions, and linked habits anytime from the Settings or Goal Details view without losing your accumulated XP.'
    },
    {
      id: 10,
      category: 'Rewards',
      question: 'How does the leaderboard work?',
      answer: 'The Leaderboard ranks companions and adventurers across the global realm based on current Level, Weekly XP earned, and Active Streak count. Rankings refresh at midnight.'
    }
  ];

  // Accordion toggle: single question open at a time
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Filter & Search Logic
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const qLower = searchQuery.toLowerCase();
    const matchesSearch =
      faq.question.toLowerCase().includes(qLower) ||
      faq.answer.toLowerCase().includes(qLower) ||
      faq.category.toLowerCase().includes(qLower);

    return matchesCategory && matchesSearch;
  });

  // Contact Form Submit Handler
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!contactName.trim()) errs.name = 'Please enter your name.';
    if (!contactEmail.trim()) errs.email = 'Please enter your email address.';
    if (!contactMessage.trim()) errs.message = 'Please enter your inquiry message.';

    setContactErrors(errs);

    if (Object.keys(errs).length === 0) {
      setContactSuccess('Your message has been received by the Realm Sentinels. We will reply shortly.');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setContactSuccess(''), 4500);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-purple-500/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4">
          <Link to="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-purple-400 font-medium">Help & Knowledge Center</span>
        </div>

        {/* 1. Header & Search Input */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-2xl mx-auto mb-3 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            💡
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-wide bg-gradient-to-r from-white via-neutral-100 to-purple-300 bg-clip-text text-transparent mb-2">
            How can we help?
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mb-6">
            Find answers and learn how to use LifeForge
          </p>

          {/* Search Box */}
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your question..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-neutral-900/90 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500/50 shadow-xl"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-base">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* 2. Quick Help Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {quickHelpCards.map((card) => (
            <div
              key={card.title}
              className="p-5 rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveCategory(card.category);
                  setSearchQuery('');
                  // Smooth scroll down to FAQ section
                  document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-4 pt-3 border-t border-white/5 text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center justify-between cursor-pointer"
              >
                <span>Explore {card.category}</span>
                <span>→</span>
              </button>
            </div>
          ))}
        </div>

        {/* 3 & 4. FAQ Section with Category Filter Buttons */}
        <div id="faq-section" className="mb-14 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Browse our curated list of answers covering gameplay and mechanics.
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 overflow-x-auto max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-purple-600 text-white shadow-md font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;

                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/80 to-neutral-950/80 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/25">
                          {faq.category}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {faq.question}
                        </span>
                      </div>
                      <span className={`text-neutral-400 text-sm transform transition-transform duration-200 ${isOpen ? 'rotate-180 text-purple-400' : ''}`}>
                        ▼
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/5 bg-black/20 animate-in fade-in duration-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 rounded-2xl border border-white/10 bg-neutral-950/50">
                <span className="text-3xl block mb-2">🔍</span>
                <p className="text-sm font-semibold text-neutral-300">
                  No matching questions found.
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Try clearing your search query or switching to "All" categories.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 5. Contact Support Card */}
        <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-r from-neutral-900/90 via-purple-950/20 to-neutral-900/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl mb-12">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-3xl block mb-2">💬</span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Still need help?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Send us a message and our demo support team will get back to you.
              </p>
            </div>

            {contactSuccess && (
              <div className="p-3.5 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
                <span>✓</span>
                <span>{contactSuccess}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Ankur Maurya"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-white text-sm focus:outline-none transition-all ${
                    contactErrors.name ? 'border-red-500' : 'border-white/10 focus:border-purple-500/50'
                  }`}
                />
                {contactErrors.name && (
                  <p className="text-red-400 text-[11px] font-mono mt-1">⚠ {contactErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Your Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. ankur@lifeforge.realm"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-white text-sm focus:outline-none transition-all ${
                    contactErrors.email ? 'border-red-500' : 'border-white/10 focus:border-purple-500/50'
                  }`}
                />
                {contactErrors.email && (
                  <p className="text-red-400 text-[11px] font-mono mt-1">⚠ {contactErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-white text-sm focus:outline-none transition-all resize-none ${
                    contactErrors.message ? 'border-red-500' : 'border-white/10 focus:border-purple-500/50'
                  }`}
                />
                {contactErrors.message && (
                  <p className="text-red-400 text-[11px] font-mono mt-1">⚠ {contactErrors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* 6. Helpful Navigation Links */}
        <div className="p-5 rounded-2xl border border-white/10 bg-neutral-950/70 backdrop-blur-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-neutral-400 font-medium">Quick Realm Destinations:</span>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/dashboard"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors"
            >
              Back to Dashboard →
            </Link>
            <Link
              to="/quests"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors"
            >
              View Quests →
            </Link>
            <Link
              to="/bosses"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors"
            >
              View Bosses →
            </Link>
            <Link
              to="/settings"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors"
            >
              Open Settings →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
