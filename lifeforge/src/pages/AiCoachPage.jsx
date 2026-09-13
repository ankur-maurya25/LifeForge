import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  sendAiCoachMessage,
  getAiRecommendations,
  getAiCoachHistory,
  clearAiCoachHistory
} from '../services/api';

const PROMPTS = [
  'What should I do today?',
  'Help me complete my goals',
  'Suggest a quest',
  'How can I improve my streak?',
  'Motivate me'
];

export default function AiCoachPage() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [clearing, setClearing] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load chat history & initial smart recommendations
  const loadData = useCallback(async () => {
    if (!token) {
      setLoadingHistory(false);
      setLoadingRecs(false);
      return;
    }

    try {
      setLoadingHistory(true);
      setLoadingRecs(true);
      setErrorMessage('');

      const [historyRes, recsRes] = await Promise.all([
        getAiCoachHistory(token, 40).catch(() => null),
        getAiRecommendations(token).catch(() => null)
      ]);

      if (historyRes && historyRes.success && Array.isArray(historyRes.data)) {
        setMessages(historyRes.data);
      }

      if (recsRes && recsRes.success && Array.isArray(recsRes.data)) {
        setRecommendations(recsRes.data);
      }
    } catch (err) {
      console.error('Error loading AI coach data:', err);
      setErrorMessage('Unable to connect to AI Coach services right now.');
    } finally {
      setLoadingHistory(false);
      setLoadingRecs(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Send message handler
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputPrompt || '').trim();
    if (!query || loading || !token) return;

    if (query.length > 2000) {
      setErrorMessage('Prompt exceeds maximum length of 2000 characters.');
      return;
    }

    setErrorMessage('');
    setInputPrompt('');

    // Optimistic UI for user message
    const tempUserMsg = {
      _id: 'temp_' + Date.now(),
      role: 'user',
      message: query,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await sendAiCoachMessage(query, token);
      if (res && res.success && res.data) {
        setMessages((prev) => [...prev, res.data]);
      } else {
        setErrorMessage(res?.message || 'AI Coach was unable to process your question.');
      }
    } catch (err) {
      console.error('AI Coach error:', err);
      setErrorMessage(err?.message || 'Error occurred while communicating with AI Coach.');
    } finally {
      setLoading(false);
    }
  };

  // Clear chat history
  const handleClearHistory = async () => {
    if (!token || clearing) return;
    if (!window.confirm('Are you sure you want to clear your AI Coach conversation history?')) return;

    try {
      setClearing(true);
      const res = await clearAiCoachHistory(token);
      if (res && res.success) {
        setMessages([]);
      } else {
        setErrorMessage(res?.message || 'Failed to clear history.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Error clearing history.');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 pb-20 pt-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dark fantasy ambient background glows */}
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400/80 uppercase tracking-widest mb-1">
              <Link to="/dashboard" className="hover:text-purple-300 transition-colors">
                Command Center
              </Link>
              <span>/</span>
              <span className="text-slate-400">Oracle of the Forge</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-rpg tracking-wider text-white flex items-center gap-3">
              <span className="text-purple-400">🔮</span>
              <span>AI LIFE COACH & ADVISOR</span>
            </h1>
            <p className="text-sm font-mono text-slate-400 mt-1">
              Real-time tactical intelligence, habits advice, and quest recommendations tailored to your journey.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {messages.length > 0 && (
              <button
                onClick={handleClearHistory}
                disabled={clearing}
                className="px-3.5 py-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 text-xs font-mono text-red-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                {clearing ? 'Clearing...' : 'Clear History ✕'}
              </button>
            )}
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl bg-[#0F131D] hover:bg-[#161C2B] border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-all"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Global Error Banner if present */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-mono flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage('')}
              className="text-slate-400 hover:text-white cursor-pointer ml-4"
            >
              Dismiss ✕
            </button>
          </div>
        )}

        {/* Main 2-Column Layout: Chat Console & Smart Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN: CHAT INTERFACE (8 COLS) ================= */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#0C0F17] border border-[#1E2538] rounded-3xl shadow-2xl flex flex-col h-[650px] overflow-hidden relative">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 bg-[#080B12]/80 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-amber-600 p-0.5 flex items-center justify-center">
                    <div className="w-full h-full bg-[#080B12] rounded-[10px] flex items-center justify-center text-base">
                      🧙‍♂️
                    </div>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold font-rpg text-white flex items-center gap-2">
                      <span>Tactical Life Oracle</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h2>
                    <p className="text-[11px] font-mono text-slate-400">
                      Syncing with {user?.name || 'Hero'} (Lv.{user?.level || 1} • {user?.xp || 0} XP)
                    </p>
                  </div>
                </div>

                <div className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/40">
                  RPG Coach Engine
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
                {loadingHistory ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 text-center">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-mono text-slate-400">Consulting realm scrolls...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-6">
                    <div className="w-16 h-16 rounded-2xl bg-purple-950/50 border border-purple-500/40 flex items-center justify-center text-3xl shadow-glow-gold/10">
                      ✨
                    </div>
                    <div className="max-w-md space-y-1">
                      <h3 className="text-base font-bold font-rpg text-white">The Forge Oracle Awaits</h3>
                      <p className="text-xs font-mono text-slate-400 leading-relaxed">
                        Ask about your daily priorities, goal roadmaps, streak resilience, or quest deconstruction.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2 max-w-lg">
                      {PROMPTS.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(p)}
                          className="px-3 py-1.5 rounded-xl bg-[#121622] hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                          “{p}”
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => {
                      const isUser = msg.role === 'user';
                      return (
                        <div
                          key={msg._id || index}
                          className={`flex gap-3 items-start ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isUser && (
                            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-sm shrink-0 mt-1">
                              🔮
                            </div>
                          )}

                          <div
                            className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs font-mono leading-relaxed shadow-lg relative ${
                              isUser
                                ? 'bg-gradient-to-br from-red-600/90 to-amber-600/90 text-white rounded-tr-none'
                                : 'bg-[#121724] border border-slate-800 text-slate-200 rounded-tl-none space-y-2.5'
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{msg.message}</div>

                            {/* Suggestions from assistant */}
                            {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
                                {msg.suggestions.map((s, sIdx) => (
                                  <button
                                    key={sIdx}
                                    onClick={() => handleSendMessage(s)}
                                    className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-purple-950/60 border border-white/10 hover:border-purple-500/50 text-[10px] text-purple-300 hover:text-white transition-colors cursor-pointer"
                                  >
                                    ↳ {s}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Related Links */}
                            {!isUser && (msg.relatedData?.goalId || msg.relatedGoalId) && (
                              <div className="pt-1">
                                <Link
                                  to={`/goal/${msg.relatedData?.goalId || msg.relatedGoalId}`}
                                  className="text-[10px] font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
                                >
                                  <span>📜 Inspect Related Campaign Boss →</span>
                                </Link>
                              </div>
                            )}
                          </div>

                          {isUser && (
                            <div className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-xs font-bold font-rpg text-amber-400 shrink-0 mt-1">
                              {user?.name?.slice(0, 1).toUpperCase() || 'H'}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {loading && (
                      <div className="flex gap-3 items-start justify-start animate-in fade-in">
                        <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-sm shrink-0 mt-1">
                          🔮
                        </div>
                        <div className="rounded-2xl rounded-tl-none p-3.5 bg-[#121724] border border-slate-800 text-xs font-mono text-purple-300 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                          <span>Deciphering battle coordinates...</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Prompt Suggestions Bar */}
              <div className="px-4 py-2 border-t border-white/5 bg-[#090C14] flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">Quick Ask:</span>
                {PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p)}
                    className="px-2.5 py-1 rounded-lg bg-[#121622] hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-[11px] font-mono text-slate-400 hover:text-white whitespace-nowrap transition-all cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3.5 bg-[#080B12] border-t border-white/10 flex items-center gap-2.5"
              >
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Ask the Oracle (e.g. 'What should I focus on today?')..."
                  className="flex-1 bg-[#101420] border border-slate-800 focus:border-purple-500/70 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-colors"
                  maxLength={2000}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || loading}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 disabled:opacity-40 text-black font-rpg font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-glow-gold/20"
                >
                  <span>{loading ? 'Consulting...' : 'Dispatch'}</span>
                  <span>⚔️</span>
                </button>
              </form>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: SMART RECOMMENDATIONS PANEL (4 COLS) ================= */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#0C0F17] border border-[#1E2538] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-lg">💡</span>
                  <h3 className="text-base font-bold font-rpg text-white">
                    SMART DIRECTIVES
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40">
                  Live Engine
                </span>
              </div>

              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Adaptive directives calculated from your real goals, quests, and streak logs:
              </p>

              {loadingRecs ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-mono text-slate-400">Analyzing quest rhythms...</p>
                </div>
              ) : recommendations.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-slate-500 rounded-xl bg-black/30 border border-slate-800">
                  No critical directives detected. Continue your conquest!
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-2xl bg-[#101420] border border-slate-800/80 hover:border-amber-500/40 transition-all space-y-2.5 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold font-rpg text-white group-hover:text-amber-300 transition-colors">
                          {rec.title}
                        </h4>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.2 rounded-full font-bold uppercase border ${
                            rec.priority === 'urgent'
                              ? 'bg-red-950 text-red-400 border-red-500/40'
                              : rec.priority === 'high'
                              ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          {rec.priority}
                        </span>
                      </div>

                      <p className="text-[11px] font-mono text-slate-400 leading-relaxed">
                        {rec.description}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <span className="text-[9px] font-mono text-slate-500 uppercase">
                          {rec.category}
                        </span>
                        <Link
                          to={rec.actionRoute || '/dashboard'}
                          className="text-[11px] font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                        >
                          <span>{rec.actionLabel || 'Execute'}</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Prompt to Coach */}
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs font-mono space-y-2">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                  <span>⚡</span>
                  <span>Daily Habit Ritual</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Start every work session with a 15-minute quick win quest to prime your dopamine rhythm.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
