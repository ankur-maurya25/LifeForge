# LifeForge - Complete Production Deployment Guide

A step-by-step, beginner-friendly manual to deploy the **LifeForge RPG Productivity Platform** (Frontend, Backend, and MongoDB Database) to production cloud environments.

---

## Architecture Overview

* **Frontend Client**: React 18 + Vite SPA with Tailwind CSS (Hosted on Vercel or Netlify).
* **Backend API**: Node.js + Express REST API Engine (Hosted on Render, Railway, or Fly.io).
* **Database**: MongoDB Atlas Cloud Cluster (Hosted on AWS/GCP via MongoDB Atlas).

---

## 1. Prerequisites & Required Tools

Before starting deployment, ensure you have:
1. **Node.js**: v18.x or later installed locally.
2. **Git**: Installed and configured.
3. **GitHub Account**: To host your code repository.
4. **MongoDB Atlas Account**: Free cloud database at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
5. **Hosting Accounts**:
   * Frontend: [Vercel](https://vercel.com) or [Netlify](https://netlify.com) (Free tiers available).
   * Backend: [Render](https://render.com) or [Railway](https://railway.app) (Free/Hobby tiers available).

---

## 2. Step 1: Database Setup (MongoDB Atlas)

1. **Create an Atlas Account & Cluster**:
   * Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
   * Choose the **M0 Free** shared tier cluster.
   * Select a cloud provider and region closest to your backend hosting region.
2. **Create a Database User**:
   * Go to **Security** -> **Database Access**.
   * Click **Add New Database User**.
   * Choose **Password** authentication.
   * Set a username (e.g. `lifeforge_admin`) and a strong password. Save these credentials.
   * Assign the role: **Read and write to any database**.
3. **Configure Network Access**:
   * Go to **Security** -> **Network Access**.
   * Click **Add IP Address**.
   * Choose **Allow Access from Anywhere** (`0.0.0.0/0`) so your cloud backend container can connect.
4. **Get Connection String**:
   * Go to **Deployment** -> **Database** -> Click **Connect**.
   * Select **Drivers** -> Node.js.
   * Copy the connection URI:
     ```
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/lifeforge?retryWrites=true&w=majority
     ```
   * Replace `<username>` and `<password>` with your database credentials.

---

## 3. Step 2: Backend Deployment (e.g., Render)

1. **Push your repository to GitHub**.
2. **Create a Web Service on Render**:
   * Log into [dashboard.render.com](https://dashboard.render.com).
   * Click **New +** -> **Web Service**.
   * Connect your GitHub repository.
3. **Configure Build & Start Settings**:
   * **Root Directory**: `backend`
   * **Environment**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
4. **Configure Environment Variables in Render**:
   In the **Environment** tab, add the following variables:

   | Key | Value | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `PORT` | `5000` (or leave default) | Server listener port |
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | `your_strong_random_jwt_key` | High-entropy random secret key |
   | `CLIENT_URL` | `https://your-frontend.vercel.app` | Your production frontend URL for CORS |
   | `AI_COACH_API_KEY` | *(Optional)* | OpenAI/Gemini API key (uses built-in fallback if unset) |

5. **Deploy & Verify**:
   * Click **Create Web Service**.
   * Once build finishes, verify by opening:
     `https://<your-backend-service>.onrender.com/api/health`
   * It should return status `200` with `"status": "healthy"` and `"database": "connected"`.

---

## 4. Step 3: Frontend Deployment (e.g., Vercel)

1. **Create Project on Vercel**:
   * Log into [vercel.com](https://vercel.com).
   * Click **Add New...** -> **Project**.
   * Import your GitHub repository.
2. **Configure Build & Output Settings**:
   * **Root Directory**: Click edit and select `lifeforge`.
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. **Configure Environment Variables in Vercel**:
   Add the following environment variable:

   | Key | Value | Description |
   |---|---|---|
   | `VITE_API_URL` | `https://<your-backend-service>.onrender.com/api` | URL pointing to your deployed backend API |

4. **Deploy**:
   * Click **Deploy**.
   * Vercel will build and publish your frontend within 1-2 minutes.
   * Copy your frontend URL (e.g. `https://lifeforge-xyz.vercel.app`).

---

## 5. Step 4: Connect Frontend & Backend (CORS)

1. Return to your backend service dashboard on **Render**.
2. Update the **`CLIENT_URL`** environment variable with your actual Vercel URL:
   ```env
   CLIENT_URL=https://lifeforge-xyz.vercel.app
   ```
3. Trigger a redeploy of the backend so the updated CORS policy takes effect.

---

## 6. Verification & Health-Check URL

* **Backend Health Check**:
  ```
  GET https://<your-backend-service>.onrender.com/api/health
  ```
  Expected JSON Response:
  ```json
  {
    "status": "healthy",
    "success": true,
    "message": "LifeForge RPG backend operational",
    "timestamp": "2026-09-12T...",
    "uptime": 120,
    "database": "connected",
    "environment": "production"
  }
  ```
* **End-to-End Test**:
  1. Open your production frontend URL.
  2. Register a new user on `/signup`.
  3. Create a goal on `/create-goal`.
  4. Create a quest and complete it on `/quests`.
  5. Check `/leaderboard` and `/analytics`.
  6. Refresh the page on any sub-route (e.g. `/boss-battle`) to verify SPA rewrite rules.

---

## 7. Troubleshooting & Common Issues

| Issue | Cause | Resolution |
|---|---|---|
| **CORS error in browser console** | `CLIENT_URL` on backend does not match frontend domain. | Set `CLIENT_URL` in backend environment variables to match your exact frontend domain (including `https://`). |
| **Database disconnected in /api/health** | IP not whitelisted in MongoDB Atlas, or wrong password. | Ensure `0.0.0.0/0` is added in MongoDB Atlas Network Access, and verify username/password in `MONGO_URI`. |
| **404 Not Found on page reload** | Static host missing Single Page Application rewrite rules. | Included `lifeforge/public/_redirects` and `lifeforge/vercel.json` handle rewrites automatically. |
| **JWT Invalid / Auth fails** | `JWT_SECRET` not set in production backend. | Add `JWT_SECRET` in backend hosting environment variables. |
| **Cold start delays (Render free tier)** | Free tier spins down after 15 minutes of inactivity. | Allow 30-40 seconds for the first request to spin up, or use a health-check pinger like UptimeRobot. |

---

## 8. Production Security Checklist

- [x] Passwords hashed using bcrypt with salt rounds.
- [x] JWT token authentication enforced on all private routes.
- [x] Role-Based Access Control: Admin routes restricted to `admin` role only.
- [x] Admin self-protection: Admin cannot deactivate or demote own account.
- [x] Suspended accounts blocked in authentication middleware and login.
- [x] Request body payloads limited to `1mb` to prevent payload DoS.
- [x] Sensitive fields (passwords, salts, internal hash data) never returned in API responses.
- [x] Error handlers sanitized to never expose internal stack traces to users.
- [x] Graceful shutdown listeners (`SIGTERM` and `SIGINT`) implemented.
- [x] Dynamic CORS restricting origin access in production.
