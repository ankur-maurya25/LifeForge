import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import CreateGoalPage from '../pages/CreateGoalPage';
import BossBattlePage from '../pages/BossBattlePage';
import QuestBoardPage from '../pages/QuestBoardPage';
import CharacterPage from '../pages/CharacterPage';
import SettingsPage from '../pages/SettingsPage';
import LeaderboardPage from '../pages/LeaderboardPage';
import NotificationsPage from '../pages/NotificationsPage';
import DailyChallengePage from '../pages/DailyChallengePage';
import BossCollectionPage from '../pages/BossCollectionPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import FriendsPage from '../pages/FriendsPage';
import AdminPage from '../pages/AdminPage';
import OnboardingPage from '../pages/OnboardingPage';
import HelpPage from '../pages/HelpPage';
import GoalDetailsPage from '../pages/GoalDetailsPage';
import AchievementsPage from '../pages/AchievementsPage';
import AiCoachPage from '../pages/AiCoachPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages with Standard Header/Footer */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* RPG Command Center Dashboard - Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Goal-to-Boss Engine: Create Goal Page - Protected */}
      <Route
        path="/create-goal"
        element={
          <ProtectedRoute>
            <CreateGoalPage />
          </ProtectedRoute>
        }
      />

      {/* Goal Details & Progress Tracking - Protected */}
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <GoalDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goal/:id"
        element={
          <ProtectedRoute>
            <GoalDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goal-details"
        element={
          <ProtectedRoute>
            <GoalDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* Boss Battle Arena Page - Protected */}
      <Route
        path="/boss-battle"
        element={
          <ProtectedRoute>
            <BossBattlePage />
          </ProtectedRoute>
        }
      />

      {/* Quest Management Board - Protected */}
      <Route
        path="/quests"
        element={
          <ProtectedRoute>
            <QuestBoardPage />
          </ProtectedRoute>
        }
      />

      {/* Character Profile & Skill Tree - Protected */}
      <Route
        path="/character"
        element={
          <ProtectedRoute>
            <CharacterPage />
          </ProtectedRoute>
        }
      />

      {/* Achievements & Hall of Feats - Protected */}
      <Route
        path="/achievements"
        element={
          <ProtectedRoute>
            <AchievementsPage />
          </ProtectedRoute>
        }
      />

      {/* AI Life Coach & Smart Recommendations - Protected */}
      <Route
        path="/ai-coach"
        element={
          <ProtectedRoute>
            <AiCoachPage />
          </ProtectedRoute>
        }
      />

      {/* Settings & Profile Page - Protected */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Leaderboard & Community - Protected */}
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        }
      />

      {/* Notifications & Activity Center - Protected */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Daily Challenge & Quest Details - Protected */}
      <Route
        path="/daily-challenge"
        element={
          <ProtectedRoute>
            <DailyChallengePage />
          </ProtectedRoute>
        }
      />

      {/* Boss Collection & Registry - Protected */}
      <Route
        path="/bosses"
        element={
          <ProtectedRoute>
            <BossCollectionPage />
          </ProtectedRoute>
        }
      />

      {/* Progress Analytics & Metrics - Protected */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      {/* Friends, Party & Social Hub - Protected */}
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <FriendsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin / Achievement Management Center - Protected (Admin only) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* Onboarding / Welcome Flow - Protected */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      {/* Help & FAQ Center - Public */}
      <Route path="/help" element={<HelpPage />} />

      {/* Fallback Route */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}




