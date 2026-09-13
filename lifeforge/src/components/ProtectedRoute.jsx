import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Wrapper
 * Redirects unauthenticated users to /login while saving intended location.
 * If requireAdmin is true, verifies user.role === 'admin' or renders Access Denied page.
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#07090E] text-slate-100 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0C0F17] border border-red-500/40 text-center shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-center justify-center text-3xl mx-auto shadow-glow-crimson">
            🛡️
          </div>
          <h2 className="text-2xl font-black font-rpg text-red-400">
            ACCESS RESTRICTED
          </h2>
          <p className="text-xs font-mono text-slate-300 leading-relaxed">
            The High Citadel requires <span className="text-amber-400 font-bold">Admin</span> authorization. Your character is currently registered as <span className="text-purple-300 font-bold">{user?.role || 'user'}</span>.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white font-rpg font-bold text-xs uppercase tracking-wider shadow-glow-crimson hover:brightness-110 transition-all"
            >
              ← Return to Realm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
