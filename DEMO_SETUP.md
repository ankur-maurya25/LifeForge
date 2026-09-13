# LifeForge: Live Presentation & Demo Setup Guide

This guide details the exact steps to bring up the full LifeForge environment with database persistence for live hackathon demos.

---

## 📌 Prerequisites & MongoDB Requirement

> [!IMPORTANT]
> **Real Data Persistence Notice:**  
> LifeForge relies on MongoDB to persist user accounts, character stats (XP, levels, streaks), created goals, quest milestones, unlocked achievements, and admin moderation events.  
> Without MongoDB running, the backend functions in **Degraded Mode** (returning HTTP 503 for auth & data operations with diagnostic help).

---

## 🛠️ Step 1: Configure Environment Variables

1. Open `backend/.env`.
2. Configure your `MONGO_URI`. You can use either a free cloud **MongoDB Atlas** cluster or a local MongoDB service:

```env
PORT=5000
NODE_ENV=development

# Option A: Free Cloud MongoDB Atlas (Recommended for Hackathons)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/lifeforge?retryWrites=true&w=majority

# Option B: Local MongoDB Service
# MONGO_URI=mongodb://127.0.0.1:27017/lifeforge

JWT_SECRET=lifeforge_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

> [!TIP]
> If using **MongoDB Atlas**, ensure that under **Network Access** in Atlas, IP `0.0.0.0/0` (Allow access from anywhere) is enabled.

---

## ⚔️ Step 2: Seed Demo Accounts

LifeForge provides a safe upsert script that creates or updates both the Admin and Standard User accounts with bcrypt password hashes without creating duplicates:

```bash
cd backend
npm run seed
```

**Expected Console Output:**
```text
✓ [Connected]: cluster0.../lifeforge
⚔️  Seeding / Upserting Demo Accounts into LifeForge...
   ✓ [CREATED/UPDATED]: ADMIN -> admin@lifeforge.com (Username: admin)
   ✓ [CREATED/UPDATED]: USER  -> testuser@lifeforge.com (Username: testuser)
🎉 Demo users seeded successfully!
```

---

## 🚀 Step 3: Start Application Servers

Open two terminal windows:

### Terminal 1 — Backend API Engine
```bash
cd backend
npm run dev
```
* Backend starts at `http://localhost:5000`
* Console should display: `✓ [MongoDB Connected]: Database operational...`

### Terminal 2 — Frontend React Client
```bash
cd lifeforge
npm run dev
```
* Frontend starts at `http://localhost:5173`

---

## 🩺 Step 4: Health Check Verification

Verify system readiness by opening or running:
```bash
node -e "const http=require('http');http.get('http://localhost:5000/api/health',r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>console.log(r.statusCode,d))})"
```

* **When Database is Connected:**
  ```json
  {"status":"healthy","database":"connected","message":"LifeForge RPG backend operational"}
  ```
* **When Database is Offline:**
  ```json
  {"status":"degraded","database":"disconnected","message":"LifeForge RPG backend running (Database offline/reconnecting)"}
  ```

---

## 🔑 Demo Credentials Reference

### 👑 1. Grand Guardian Admin
* **Email / Username:** `admin@lifeforge.com` *(or `admin`)*
* **Password:** `admin123`
* **Role:** `admin`
* **Access Route:** `/admin` (High Citadel Console)

### ⚔️ 2. Standard Test Quester
* **Email / Username:** `testuser@lifeforge.com` *(or `testuser`)*
* **Password:** `password123`
* **Role:** `user`
* **Access Route:** `/dashboard` (Player Command Center)

> [!NOTE]
> The Login Page features **1-Click Demo Fill** buttons (`Demo: User | Admin`) above the email field to eliminate typing during presentations.

---

## ⚠️ Troubleshooting Database Offline Error

If the message **"Database is offline. Please ensure MongoDB is running or configure MONGO_URI in .env."** appears on login or signup:

1. **Check MongoDB Service:**
   - If running locally: run `net start MongoDB` or start `mongod`.
2. **Check MongoDB Atlas IP Whitelist:**
   - In Atlas dashboard, go to **Security > Network Access** and add `0.0.0.0/0`.
3. **Verify `.env` Loading:**
   - Ensure `backend/.env` is located in the `backend/` directory and contains no typos in `MONGO_URI`.
4. **Re-run the Seed Script:**
   - Run `npm run seed` in `backend/` to test direct database connectivity.
