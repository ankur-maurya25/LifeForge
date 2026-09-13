# LifeForge: Backup Demo & Contingency Plan

This document outlines practical, realistic contingency actions in case of technical issues during a live hackathon stage presentation.

---

## 🛑 Golden Rule During Technical Glitches
> **Be Transparent and Grounded:**  
> Never fabricate metrics or claim a failed feature is working. Judges appreciate honest engineering, clear architectural understanding, and calm problem-solving under pressure.

---

## 🚨 Contingency Scenarios & Immediate Solutions

### 1. MongoDB Connection Fails / Atlas Network Drop
* **Symptom:** Authentication shows: *"Database is offline. Please ensure MongoDB is running..."*
* **Root Cause:** Wi-Fi drop or blocked outbound port `27017` on hackathon venue network.
* **Backup Action:**
  1. Explain to the judges: *"Our backend features graceful degradation. Notice how it provides clean diagnostic feedback rather than crashing the Express server."*
  2. Switch to local MongoDB if available (`net start MongoDB`), OR
  3. Tether laptop to phone 4G/5G mobile hotspot to bypass venue firewall restrictions on Atlas ports.

---

### 2. Backend Server Process Fails or Crashes
* **Symptom:** Frontend displays *"Backend server is offline or unreachable on port 5000"*.
* **Backup Action:**
  1. Open a clean terminal in `backend/` and run:
     ```bash
     npm start
     ```
  2. Verify output: `Server listening on port 5000`.
  3. Refresh the React app at `http://localhost:5173`.

---

### 3. Frontend Client Fails to Load or Blank Screen
* **Symptom:** Browser shows a blank white page or React uncaught error.
* **Backup Action:**
  1. Open Browser DevTools (F12) to inspect the Console.
  2. Hard refresh with cache bypass: `Ctrl + Shift + R`.
  3. If Vite dev server stopped: run `npm run dev` inside `lifeforge/`.
  4. Fallback: Run the pre-compiled production build directly:
     ```bash
     cd lifeforge
     npx serve -s dist -l 5173
     ```

---

### 4. Demo Login Credentials Fail
* **Symptom:** *"Invalid email/username or password"* banner.
* **Backup Action:**
  1. Use the **1-Click Demo Fill** buttons: Click **"Demo: Admin"** or **"Demo: User"** right on the login form.
  2. If credentials were changed, run the instant seed script:
     ```bash
     cd backend
     npm run seed
     ```
  3. Re-submit the login form.

---

### 5. AI Life Coach Fails or Times Out
* **Symptom:** AI Coach spinner hangs or displays an API error.
* **Backup Action:**
  1. Explain the architectural safeguard: *"Our AI Coach includes a server-side heuristic fallback so that missing or rate-limited API keys never break user workflows."*
  2. The service automatically responds with intelligent rule-based habit recommendations based on the user's active goals and current streak.

---

### 6. Venue Wi-Fi Drops Completely
* **Symptom:** No internet connectivity inside the presentation hall.
* **Backup Action:**
  1. Ensure both frontend (`http://localhost:5173`) and backend (`http://localhost:5000`) are running locally on `localhost`.
  2. The entire application UI, animations, local role-based guards, and offline state handling run 100% locally without requiring internet access.

---

### 7. Projector Aspect Ratio or Small Screen Distortion
* **Symptom:** Low-resolution projector (e.g. 1024x768) truncates horizontal layout.
* **Backup Action:**
  1. Press `Ctrl + Minus (-)` in Chrome to zoom out to 90% or 80%.
  2. LifeForge utilizes responsive Tailwind layouts (`sm:`, `md:`, `lg:`) and collapses multi-column grids into clean vertical stacks on smaller viewports.

---

## 📋 Emergency Quick-Commands Reference Card

```bash
# Emergency Server Restart:
cd c:\Users\user\Downloads\LifeForge\backend && npm run dev

# Emergency Frontend Restart:
cd c:\Users\user\Downloads\LifeForge\lifeforge && npm run dev

# Re-Seed Demo Accounts:
cd c:\Users\user\Downloads\LifeForge\backend && npm run seed

# Test Health Endpoint:
curl http://localhost:5000/api/health
```
