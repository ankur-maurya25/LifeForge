# LifeForge: Technical Architecture & Implementation Notes

Technical explanation notes covering the architecture, data flow, security model, and failure-handling strategies in LifeForge.

---

## 1. Client-Server Communication & API Request Flow
- **HTTP Client Wrapper:** The frontend uses a centralized fetch wrapper located at [`lifeforge/src/services/api.js`](file:///c:/Users/user/Downloads/LifeForge/lifeforge/src/services/api.js) pointing to `http://localhost:5000/api`.
- **Request Headers:** Automatically sets `'Content-Type': 'application/json'` and injects `Authorization: Bearer <token>` for protected endpoints.
- **Error Interception:** Translates HTTP errors into user-friendly messages and catches server-offline network exceptions.

```text
User Action (React Component)
          ↓
API Service Wrapper (api.js)
          ↓ (Fetch HTTP Request with Bearer Token)
Express Router (routes/*.js)
          ↓
authMiddleware (protect / requireAdmin)
          ↓
Controller Logic (controllers/*.js)
          ↓
Mongoose ODM (models/*.js)
          ↓
MongoDB Collection
```

---

## 2. Authentication & JWT Session Flow
1. **User Registration:**
   - User submits `name`, `username`, `email`, and `password`.
   - Mongoose pre-save hook invokes `bcrypt.genSalt(10)` and hashes the password before persistence.
   - Signs a JWT with `{ id, role, username }` using `JWT_SECRET` and a 7-day expiration.
2. **User Login:**
   - Supports login by **either Email or Username**.
   - Queries `User.findOne({ $or: [{ email }, { username }] }).select('+password')`.
   - Compares raw candidate password with hashed password via `bcrypt.compare`.
   - Checks if user status is `'suspended'`; if suspended, returns HTTP `403 Forbidden`.
   - Issues signed JWT token and returns sanitized user object (password excluded).
3. **Session Management:**
   - Client stores token and user profile in React context state (`AuthContext.jsx`).
   - Logout clears user and token state immediately, resetting private access.

---

## 3. Role-Based Access Control (RBAC) Architecture
LifeForge enforces dual-tier authorization:
- **`protect` Middleware:**
  - Verifies presence and signature of `Authorization: Bearer <token>`.
  - Checks if database is reachable (returns 503 if offline).
  - Fetches the user by decoded ID, ensuring the account exists and is not suspended.
  - Attaches sanitized user document to `req.user`.
- **`requireAdmin` Middleware:**
  - Evaluates `req.user.role === 'admin'`.
  - If role is not admin, halts request and returns HTTP `403 Forbidden` (`Access denied: Admin privileges required.`).
- **Frontend Guard (`ProtectedRoute.jsx`):**
  - Evaluates `isAuthenticated` and redirects unauthenticated visitors to `/login`.
  - If `requireAdmin={true}`, evaluates `user?.role === 'admin'`. If standard user, displays the custom `ACCESS RESTRICTED` shield.

---

## 4. Database Models & Schema Design
All data structures are defined as Mongoose schemas in `backend/models/`:
- **`User.js`**: Core player data (`name`, `username`, `email`, `password`, `level`, `xp`, `streak`, `longestStreak`, `role: ['user', 'admin']`, `status: ['active', 'inactive', 'suspended']`).
- **`Goal.js`**: Strategic goals with category, difficulty, progress percentage, and an array of 4 milestone phases.
- **`Quest.js`**: Individual actionable tasks linked to a user and optionally to a goal, tracking difficulty, XP reward, and completion timestamps.
- **`Achievement.js` & `UserAchievement.js`**: System feat catalog (requirements, XP reward) and individual user unlock records preventing double claims.
- **`Notification.js`**: User activity alerts with read/unread flags and event categories.
- **`DailyChallenge.js`**: Daily micro-habits linked to date strings (`YYYY-MM-DD`).
- **`AICoachMessage.js`**: Persistent chat logs between the player and the AI Coach.

---

## 5. MongoDB Connection Lifecycle & Degraded Mode
LifeForge handles database connectivity gracefully:
- **Environment Resolution:** Reads `MONGO_URI` from `backend/.env`, supporting both local (`mongodb://127.0.0.1:27017/lifeforge`) and MongoDB Atlas URIs.
- **Safe URI Masking:** The database connector (`backend/config/db.js`) uses a regex sanitizer that masks passwords (`//***:***@`) before writing to console logs.
- **Event Listeners:** Registers single listeners for `connected`, `error`, and `disconnected` states.
- **Degraded Mode:** If MongoDB is unreachable, the Express server stays active:
  - `GET /api/health` reports `{ "status": "degraded", "database": "disconnected" }`.
  - Auth and data routes return HTTP `503 Service Unavailable` with diagnostic tips rather than crashing.

---

## 6. Seed Script (`backend/seedDemoUsers.js`)
- Uses an upsert pattern based on `$or: [{ email }, { username }]`.
- Hashes passwords using bcrypt before saving.
- Pre-configures the Grand Guardian Admin (`admin@lifeforge.com` / `admin123`) and Standard Player (`testuser@lifeforge.com` / `password123`).
- Can be safely run multiple times without creating duplicate records.

---

## 7. AI Life Coach Heuristic Fallback Engine
Located in `backend/utils/aiCoachService.js`:
- Collects sanitized user metrics (current level, active goals, pending quests, streak length) without private fields.
- If an external AI provider API key is absent or returns an error, the service invokes `generateRuleBasedRecommendations()`:
  - Evaluates active streaks: suggests streak-defense habits if streak > 3.
  - Evaluates boss health: recommends high-XP quest attacks if boss HP > 50%.
  - Delivers structured coaching responses and suggestions seamlessly.
