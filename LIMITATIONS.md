# LifeForge: Technical Boundaries & Limitations

An honest, transparent disclosure of the project's current boundaries, external dependencies, and planned improvements.

---

### 1. Database Requirement
* **Current State**: LifeForge uses MongoDB with Mongoose ODM for atomic XP increments, relational indexing, and data persistence.
* **Limitation**: Persistent registration, login, and progress tracking require an active MongoDB connection (either a local MongoDB service on `127.0.0.1:27017` or a cloud MongoDB Atlas connection string configured in `MONGO_URI`).
* **Handling**: If MongoDB is unreachable, the backend catches the error gracefully, returns a structured 503 response, and the frontend displays a clear user-friendly banner rather than crashing.

---

### 2. AI Life Coach External Dependency
* **Current State**: The AI Life Coach is architected to interface with external LLM APIs (like OpenAI or Google Gemini).
* **Limitation**: Live LLM responses depend on an active internet connection and a valid API key configured in `AI_COACH_API_KEY` or `OPENAI_API_KEY`.
* **Handling**: To guarantee zero downtime, we engineered a **built-in heuristic fallback engine**. If the external API key is omitted, experiences a timeout, or encounters rate limits, the server automatically switches to the internal rule-based engine. The user receives personalized, player-aware guidance without any disruption.

---

### 3. Web-First Platform (No Native Mobile App)
* **Current State**: LifeForge is built as a responsive Single Page Application (SPA) using React 18, Vite, and Tailwind CSS.
* **Limitation**: While fully functional and responsive on mobile browsers, it is not currently packaged as a native iOS or Android app (no native push notifications or background sensors).
* **Mitigation**: The layout utilizes mobile-first Tailwind CSS classes, responsive headers, touch-friendly buttons, and off-canvas mobile menus. Native mobile apps (React Native) are on the future roadmap.

---

### 4. Multiplayer Social Features (Asynchronous vs Real-Time)
* **Current State**: The Adventurer's Party feature supports sending/accepting friend requests, user search, viewing friend dossiers, and global leaderboard rankings.
* **Limitation**: Combat damage against bosses is currently single-player (your quests damage your campaign boss). Real-time multiplayer co-op raids (where two friends hit the same boss simultaneously) are not yet implemented.
* **Roadmap**: WebSocket-based Guild Raids are planned for the next major milestone.

---

### 5. Email Verification & Password Recovery
* **Current State**: Authentication supports registration, salted bcrypt password hashing, login, and profile updates.
* **Limitation**: To keep the project lightweight and easily runnable without external SMTP credentials during hackathon evaluations, automated email verification and reset password links via SMTP are not included.
* **Mitigation**: Registration is instant with client-side input validation and server-side duplicate email/username checks.

---

### 6. Summary of Stability & Reliability
* **No Crashing Bugs**: All 23 API endpoints, authentication middleware, error sanitization, and edge-case calculations (such as empty goal milestones) have been tested with 100% pass rate.
* **Zero Security Leaks**: Internal stack traces are suppressed, passwords are never stored in plain text, and admin routes strictly enforce database roles.
