# LifeForge: System Architecture

This document visualizes the complete system architecture, data flow, and component interactions of the LifeForge RPG Productivity Platform.

---

## 1. High-Level System Architecture Diagram

```mermaid
flowchart TB
    subgraph ClientLayer ["🖥️ Client Tier (React 18 + Vite SPA)"]
        User(("👤 Quester / Admin"))
        UI["React UI Views & Pages"]
        AuthCtx["Auth Context (JWT State)"]
        ApiClient["api.js Service Layer"]
        User -->|Interacts| UI
        UI -->|Reads Auth| AuthCtx
        UI -->|API Requests| ApiClient
    end

    subgraph GatewayLayer ["🛡️ Security & Middleware Gateway"]
        CORS["CORS Policy (CLIENT_URL)"]
        RateLimit["Body Limit (1MB)"]
        AuthMiddleware["protect (JWT Verification)"]
        AdminMiddleware["requireAdmin (RBAC)"]
        ApiClient -->|HTTP / HTTPS| CORS
        CORS --> RateLimit
        RateLimit --> AuthMiddleware
        AuthMiddleware -->|Admin Routes Only| AdminMiddleware
    end

    subgraph BackendLayer ["⚙️ Backend API Tier (Node.js + Express)"]
        AuthCtrl["Auth & Profile Controller"]
        GoalCtrl["Goal Controller"]
        QuestCtrl["Quest Controller"]
        ChallengeCtrl["Daily Challenge Controller"]
        BattleCtrl["Boss Battle & Combat Logic"]
        SocialCtrl["Friends & Party Controller"]
        AchCtrl["Achievements Controller"]
        AnalyticsCtrl["Analytics Controller"]
        AdminCtrl["Admin Controller"]

        AuthMiddleware --> AuthCtrl
        AuthMiddleware --> GoalCtrl
        AuthMiddleware --> QuestCtrl
        AuthMiddleware --> ChallengeCtrl
        AuthMiddleware --> BattleCtrl
        AuthMiddleware --> SocialCtrl
        AuthMiddleware --> AchCtrl
        AuthMiddleware --> AnalyticsCtrl
        AdminMiddleware --> AdminCtrl
    end

    subgraph ServicesLayer ["⚡ Core Game & Progression Engine"]
        LevelService["Level Engine (500 XP / Level Formula)"]
        NotificationService["Notification Dispatcher"]
        AchievementService["Achievement Milestone Scanner"]
        AiService["AI Coach & Tactician Engine"]

        QuestCtrl -->|XP Gain| LevelService
        QuestCtrl -->|Unlock Check| AchievementService
        QuestCtrl -->|Alert| NotificationService
        ChallengeCtrl -->|Streak Update| LevelService
        GoalCtrl -->|Conquest Alert| NotificationService
        AiService -->|Contextual Advice| UI
    end

    subgraph DatabaseLayer ["🗄️ Database Tier (MongoDB Atlas Cloud Cluster)"]
        Mongoose["Mongoose ODM Models"]
        UsersCol[("users")]
        GoalsCol[("goals")]
        QuestsCol[("quests")]
        ChallengesCol[("dailychallenges")]
        FriendsCol[("friendships & requests")]
        AchCol[("achievements & userachievements")]
        NotifCol[("notifications")]
        AiCol[("aicoachmessages")]

        BackendLayer -->|Queries & Updates| Mongoose
        Mongoose --> UsersCol
        Mongoose --> GoalsCol
        Mongoose --> QuestsCol
        Mongoose --> ChallengesCol
        Mongoose --> FriendsCol
        Mongoose --> AchCol
        Mongoose --> NotifCol
        Mongoose --> AiCol
    end

    subgraph ExternalServices ["🌐 External Providers"]
        AiProvider["OpenAI / Gemini API (Optional)"]
        AiService -.->|Live LLM Prompt| AiProvider
        AiService -->|Heuristic Fallback| AiService
    end

    classDef client fill:#1e1e2f,stroke:#7c3aed,stroke-width:2px,color:#fff;
    classDef gateway fill:#181824,stroke:#dc2626,stroke-width:2px,color:#fff;
    classDef backend fill:#111827,stroke:#2563eb,stroke-width:2px,color:#fff;
    classDef services fill:#1e293b,stroke:#059669,stroke-width:2px,color:#fff;
    classDef db fill:#0f172a,stroke:#d97706,stroke-width:2px,color:#fff;

    class ClientLayer client;
    class GatewayLayer gateway;
    class BackendLayer backend;
    class ServicesLayer services;
    class DatabaseLayer db;
```

---

## 2. Key Component Explanations

1. **Client Tier**:
   * Built with React 18, Vite, and Tailwind CSS.
   * State is managed through React Context (`AuthContext`) with zero tokens exposed in local files.
   * `api.js` serves as the single source of truth for all HTTP calls with dynamic URL resolution.
2. **Security & Gateway Tier**:
   * **CORS**: Enforces origin whitelisting in production via `CLIENT_URL`.
   * **Body Limit**: Restricts payloads to `1mb` to eliminate memory buffer exploits.
   * **Authentication**: Verifies JWT tokens and immediately blocks suspended accounts.
   * **RBAC**: Ensures admin routes are protected against client-side role forgery.
3. **Backend API Tier**:
   * Modular Express router and controllers strictly enforcing user data isolation (`userId: req.user._id`).
   * Clean RESTful conventions with appropriate HTTP response codes (`200`, `201`, `400`, `401`, `403`, `404`, `500`).
4. **Game & Progression Engine**:
   * **LevelService**: Calculates character level deterministically based on `500 XP` per level thresholds.
   * **AchievementService**: Scans user progress triggers after every quest or goal completion to automatically award trophies.
   * **NotificationService**: Generates activity feed entries for streaks, boss strikes, and party updates.
   * **AI Coach Service**: Combines user state (goals, quests, streaks) with prompts. Features automatic fallback if external API is unreachable.
5. **Database Tier**:
   * MongoDB replica set hosted on MongoDB Atlas.
   * Enforces schema validation, unique indexes (e.g. one daily challenge per date, unique email/username), and cascaded subdocuments.
