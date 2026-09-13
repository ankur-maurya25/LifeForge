# LifeForge: Goal-to-Boss RPG Productivity Engine

![LifeForge Banner](https://raw.githubusercontent.com/placeholder/lifeforge-banner.png)

> **"Forge your discipline. Slay your procrastination."**
> A modern full-stack productivity platform that converts real-world ambitions into epic RPG boss battles.

---

## ⚔️ The Problem
Maintaining consistency with long-term goals is hard. Traditional productivity tools (to-do lists, kanban boards, spreadsheets) are sterile and dry. They record tasks without providing any intrinsic motivation or immediate reward, leading to procrastination, broken streaks, and abandoned goals.

## 🛡️ The Solution
**LifeForge** bridges the gap between behavioral psychology and RPG game mechanics:
* **Goals Become Campaign Bosses**: Every goal has a concrete HP bar that depletes as you hit milestones.
* **Daily Habits Become Quests**: Checking off daily tasks strikes the boss and grants instant XP.
* **Progressive Leveling**: Accumulate XP to advance through character levels and earn prestige titles.
* **Social Synergy**: Compare XP on global leaderboards and build party accountability with friends.
* **AI Life Coach**: Get tactical daily guidance and motivational boosts from an in-character AI companion.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **🏰 Goal-to-Boss Engine** | Decompose big goals into milestones; watch boss health deplete in real-time. |
| **⚔️ Quest Management** | Full CRUD quest log categorized by difficulty (Easy, Medium, Hard) and tracks. |
| **🐉 Boss Battle Arena** | Live combat arena with hit feedback, floating damage numbers, and battle logs. |
| **🔥 Daily Challenges & Streaks** | Deterministic daily challenges with streak tracking and momentum bonuses. |
| **🏆 Hall of Feats** | 7 trophy categories with claimable bonus XP and unlocked date history. |
| **👑 Global Leaderboard** | Real-time user rankings sorted by Total XP, Level, Quests, or Streaks. |
| **🤝 Party & Social Hub** | Search users, send friend requests, and inspect peer player dossiers. |
| **📊 Progress Analytics** | Interactive charts for weekly quest completion, XP growth, and boss damage. |
| **🔮 AI Life Coach** | Contextual daily recommendations with resilient rule-based server fallback. |
| **🛡️ Admin Panel** | Secure guardian portal to monitor platform metrics and manage achievements. |

---

## 🏗️ Architecture & Tech Stack

```text
Client (React 18 + Vite + Tailwind CSS)
   │ (JWT Bearer Token / HTTPS)
   ▼
Express REST API (Node.js Gateway)
   ├── Security: CORS, 1MB Body Limit, bcrypt Password Hashing, RBAC
   ├── Progression Services: Level Engine (500 XP/lvl), Achievement Scanner
   ├── AI Engine: Player-Aware Context + Resilient Heuristic Fallback
   └── Database: MongoDB Atlas (10 Mongoose Collections)
```

* **Frontend**: React 18, Vite, React Router v6, Tailwind CSS
* **Backend**: Node.js, Express.js (REST API Architecture)
* **Database**: MongoDB Atlas with Mongoose ODM
* **Security**: JWT Authentication, bcryptjs, Role-Based Access Control

---

## 🚀 Quick Start Guide

### 1. Clone & Setup Backend
```bash
cd backend
npm install
copy .env.example .env
npm start
```
*Backend listens on `http://localhost:5000`. Verify with `curl http://localhost:5000/api/health`.*

### 2. Setup Frontend
```bash
cd lifeforge
npm install
npm run dev
```
*Frontend opens on `http://localhost:5173`.*

---



## 📸 Screenshots & UI Preview

| Command Center Dashboard | Boss Battle Arena |
|---|---|
| *(Screenshot Placeholder: Dashboard)* | *(Screenshot Placeholder: Boss Arena)* |

| Quest Management Board | Hall of Achievements |
|---|---|
| *(Screenshot Placeholder: Quests)* | *(Screenshot Placeholder: Trophies)* |

---

## 🔮 Future Roadmap
- [ ] Real-time multiplayer Guild Boss Raids via WebSockets.
- [ ] Mobile companion app built with React Native.
- [ ] Integration with Apple Health and Google Fit to convert steps into quest XP.
- [ ] Orchestral audio soundscape with voice-acted boss encounters.

---

## 📜 License
Distributed under the ISC License. Built with passion for high-performance productivity.
