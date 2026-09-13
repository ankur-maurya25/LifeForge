# LifeForge: Pitch Deck Content

Slide-by-slide presentation deck content for hackathon presentations.

---

## Slide 1 — Title
* **Project Name:** LifeForge
* **Tagline:** Forge your discipline. Slay your procrastination.
* **Introduction:** A gamified goal-tracking and habit-building web application that turns daily tasks into an RPG adventure.

---

## Slide 2 — Problem Statement
* **Traditional to-do apps feel like boring spreadsheets:** Checking a box gives momentary relief, but no real engagement.
* **Users lose motivation quickly:** Long-term goals take months, but traditional apps provide no immediate feedback loop.
* **Procrastination is unpunished and unaddressed:** When tasks pile up, users feel overwhelmed and abandon the tool.
* **Need for engaging habit formation:** People need a system that makes consistency feel rewarding every single day.

---

## Slide 3 — Our Solution
LifeForge translates personal goals and habits into an **immersive RPG experience**:
* **Goals as Campaign Bosses:** Large ambitions become formidable monsters with health bars.
* **Quests as Combat Attacks:** Daily tasks and study sessions deal real-time damage to the boss.
* **Experience & Levels:** Every completed quest awards XP and increases character level tiers.
* **Consistency Streaks:** Consecutive daily check-ins build streaks that protect progress.
* **Boss Battle Arena:** Turn-based combat where completed quests act as attack cards.
* **Feats & Achievements:** Claimable trophies rewarding consistency and milestone breakthroughs.
* **Global Leaderboard:** Friendly accountability rankings based on level and completed quests.
* **AI Life Coach:** Built-in guidance offering contextual habit suggestions with automatic heuristic fallback.

---

## Slide 4 — Target Users
* **Students:** Preparing for competitive exams, semester goals, or learning programming.
* **Beginners Building Habits:** People trying to read daily, work out regularly, or wake up consistently.
* **Goal Achievers:** Anyone with long-term projects needing structured milestone breakdowns.
* **Gamers & RPG Fans:** Users who thrive on progression bars, character stats, and unlockables.

---

## Slide 5 — Main User Flow
```text
Signup / Login
      ↓
Create Goal (e.g., "Learn Web Development")
      ↓
Auto-generated 4-Phase Milestones
      ↓
Execute & Complete Quests
      ↓
Earn Instant XP & Deal Boss Damage
      ↓
Level Up & Defend Daily Streak
      ↓
Unlock Feats & Compete on Leaderboard
```

---

## Slide 6 — Key Features
* **Dashboard:** Command center displaying Character Level, XP Progress Bar, Streak, and active Nemesis Boss.
* **Goal Creation:** Custom goal form with difficulty ratings, category tags, and automated 4-phase milestone generation.
* **Quest Board:** Quest list categorized by difficulty with instant completion triggers and XP awards.
* **Boss Battle:** Interactive combat arena using completed tasks to weaken the procrastination boss.
* **Achievements:** 7 categories of unlockable trophies with claimable bonus XP.
* **Leaderboard:** Global ranking table sorted by Level, XP, and Streaks with top 3 podium standings.
* **AI Life Coach:** Chat-based assistant providing goal advice and smart task recommendations.
* **Notifications:** Real-time bell dropdown alerts for level-ups, boss encounters, and quest finishes.
* **Admin Panel:** Administrative console for system statistics, user moderation, and achievement regulation.

---

## Slide 7 — User Roles
### 1. Standard User (`role: 'user'`)
* Accesses player dashboard, goals, quests, and boss arena.
* Earns XP, levels up, maintains streaks, and unlocks achievements.
* Blocked from admin routes with a dedicated `ACCESS RESTRICTED` security screen.

### 2. Admin User (`role: 'admin'`)
* Authenticated with admin privileges.
* Accesses the Admin Citadel Console (`/admin`).
* Views live aggregate statistics: total users, completed quests, vanquished bosses, and platform XP.
* Moderates user accounts and regulates the achievement catalog.

---

## Slide 8 — Technology Stack (Verified in Codebase)
* **Frontend:** React 18, Vite 6, Tailwind CSS, React Router 7, Lucide Icons.
* **Backend:** Node.js, Express 4, Mongoose 8 (ODM).
* **Database:** MongoDB (Local or MongoDB Atlas).
* **Authentication:** Signed JWT (`jsonwebtoken`) with `id`, `role`, and `username`, plus `bcryptjs` password hashing.
* **Security Middleware:** CORS with whitelist matching, Helmet security headers, 1MB payload limits.
* **AI Integration:** Server-side AI provider service with an intelligent rule-based heuristic fallback.

---

## Slide 9 — Security Features
* **Bcrypt Password Hashing:** Passwords are pre-hashed with 10 salt rounds before storage; never saved in plain text.
* **JWT Tokens:** Authenticated sessions use signed tokens with 7-day expiration.
* **Server-Enforced Role Guards:** `requireAdmin` middleware verifies roles on the server, never trusting frontend values.
* **Account Status Filtering:** Suspended users are blocked with HTTP `403 Forbidden`.
* **Safe Logging:** Database connection strings mask passwords (`//***:***@`) in server console outputs.
* **Environment Isolation:** Secrets are managed via `.env` files and ignored in version control.

---

## Slide 10 — System Architecture
```text
React 18 / Vite Client (Tailwind CSS + React Router)
                ↓  HTTP / REST API (Port 5000)
Node.js & Express API Gateway (Helmet, CORS, 1MB Limit)
                ↓
Authentication & Role Middleware (protect, requireAdmin)
                ↓
Business Logic Controllers (auth, goals, quests, admin, aiCoach)
                ↓
Mongoose ODM Data Layer (User, Goal, Quest, Achievement, Notification)
                ↓
MongoDB Database Engine (Local or Cloud Atlas)
```
* **Degraded Mode:** If MongoDB is unavailable, backend stays online for health monitoring and returns clean HTTP 503 diagnostics.

---

## Slide 11 — Demo Walkthrough Sequence
1. **Landing Page:** Hero vision, problem context, and theme.
2. **Admin Login:** Click *"Demo: Admin"* → lands on `/admin`.
3. **Admin Citadel:** Platform metrics, user audits, and achievement catalog.
4. **Security Check:** Logout → attempt visiting `/admin` → Show *ACCESS RESTRICTED* screen.
5. **Player Login:** Click *"Demo: User"* → lands on `/dashboard`.
6. **Command Center:** Level, XP progress, active streak, and active boss health.
7. **Create Goal:** Add *"Master Distributed Systems"* with 4 automated milestone phases.
8. **Complete Quest:** Check off a quest card; show immediate +40 XP gain.
9. **Boss Arena:** Turn-based quest strikes against the procrastination boss.
10. **Achievements:** Claim unlocked trophy bonus XP.
11. **Leaderboard:** Inspect podium rankings.
12. **AI Life Coach:** Ask habit prompt and show personalized coaching.

---

## Slide 12 — Future Scope (Planned Enhancements)
* **Multiplayer Co-Op Raids:** Form guild parties with friends to fight boss monsters together.
* **Native Mobile Apps:** React Native client with push notifications for streak defense.
* **Calendar & GitHub Integrations:** Auto-complete quests from commit pushes or calendar events.
* **Custom Avatar Cosmetics:** Unlock armor sets and weapon skins using earned quest gold.
* **Advanced AI Recommendations:** Deep longitudinal habit analysis and personalized difficulty tuning.

---

## Slide 13 — Current Technical Limitation
* **MongoDB Persistence Dependency:** Full persistent data storage requires a connected local MongoDB instance or a cloud MongoDB Atlas cluster URI in `backend/.env`.
* **Degraded Diagnostic Mode:** In disconnected mode, the server accurately reports database state and health, but database CRUD operations require connection.
* **Demo Seeding:** Pre-configured admin and test accounts are seeded via `npm run seed` once MongoDB is connected.

---

## Slide 14 — Conclusion
> *"LifeForge turns daily tasks into an epic RPG journey, making personal growth and discipline engaging, visual, and rewarding every single day."*
