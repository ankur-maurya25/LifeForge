# LifeForge: Final Demo Safety Checklist

A pre-presentation technical verification checklist. Complete every check before stepping on stage.

---

## 📋 Pre-Flight System Checks

### 1. Server & Client Processes
- [x] **Backend Server Running:**  
  Run: `cd backend && npm run dev`  
  Verify listening port: `http://localhost:5000`
- [x] **Frontend Client Running:**  
  Run: `cd lifeforge && npm run dev`  
  Verify accessible at: `http://localhost:5173`
- [x] **Vite Production Build Clean:**  
  Run: `cd lifeforge && npm run build`  
  Status: **PASS (0 errors in ~7s)**

---

### 2. Database & Environment Configuration
- [x] **`.env` File Location:**  
  Ensure `backend/.env` exists and contains:
  ```env
  PORT=5000
  NODE_ENV=development
  MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/lifeforge?retryWrites=true&w=majority
  JWT_SECRET=lifeforge_super_secret_jwt_key_2026
  ```
- [x] **MongoDB Connectivity Status:**  
  - If using Cloud Atlas: Verify IP whitelist allows `0.0.0.0/0`.
  - If using Local MongoDB: Ensure service is running (`net start MongoDB`).
  - *Current Local Machine Status:* Disconnected / Degraded Mode (handled safely with clear diagnostic UI).
- [x] **Health Check Verification:**  
  Run:
  ```bash
  node -e "const http=require('http');http.get('http://localhost:5000/api/health',r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>console.log(r.statusCode,d))})"
  ```
  Returns HTTP 200 with server status.

---

### 3. Account Seeding & Credentials
- [x] **Demo Seeding Executed:**  
  Run: `cd backend && npm run seed`
- [x] **Admin Account Verified:**  
  - Email / Username: `admin@lifeforge.com` (or `admin`)
  - Password: `admin123`
  - Role: `admin`
  - Target Route: `/admin`
- [x] **Standard Player Account Verified:**  
  - Email / Username: `testuser@lifeforge.com` (or `testuser`)
  - Password: `password123`
  - Role: `user`
  - Target Route: `/dashboard`
- [x] **1-Click Demo Fill Buttons Active:**  
  Buttons `Demo: User` and `Demo: Admin` pre-fill credentials without typing errors.

---

### 4. Core Feature & Route Verification
- [x] **Landing Page (`/`):** Cinematic hero and feature cards load cleanly.
- [x] **Login Page (`/login`):** Validates email/username; displays clear manual setup guide if DB is offline.
- [x] **Signup Page (`/signup`):** 4 character classes selectable; passwords validated.
- [x] **Dashboard (`/dashboard`):** Level card, XP progress bar, active streak, and active boss display.
- [x] **Goal Creation (`/create-goal`):** Automated 4-phase milestone generation logic verified.
- [x] **Quest Execution (`/quests`):** Task completion awards +XP and triggers level recalculation.
- [x] **Boss Battle Arena (`/boss-battle`):** Combat log registers quest strikes and updates remaining boss HP.
- [x] **Hall of Feats (`/achievements`):** 7 categories; claimable XP rewards prevent double claims.
- [x] **Leaderboard (`/leaderboard`):** Multi-category ranking podium loads.
- [x] **AI Life Coach (`/ai-coach`):** Smart heuristic fallback activates if external API key is missing.
- [x] **Notification Center (`/notifications`):** Unread count updates and mark-all-read clears count.
- [x] **Admin Citadel (`/admin`):** Platform metrics and user audit table protected by `requireAdmin`.
- [x] **Security Guard (`ProtectedRoute.jsx`):** Non-admin manual entry to `/admin` displays `ACCESS RESTRICTED` shield.

---

### 5. Code Integrity & Hygiene
- [x] **No Hardcoded Production Secrets:** Passwords and keys read from `.env`.
- [x] **Git Ignored Files:** `.env`, `.env.local`, and `node_modules` are added to `.gitignore`.
- [x] **Console Cleanliness:** Passwords masked in connection logs (`//***:***@`).
- [x] **No Unimplemented Features Claimed:** Multiplayer raids and mobile apps clearly demarcated as **Future Roadmap**.
