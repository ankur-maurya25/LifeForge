require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const goalRoutes = require('./routes/goalRoutes');
const questRoutes = require('./routes/questRoutes');
const dailyChallengeRoutes = require('./routes/dailyChallengeRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const friendsRoutes = require('./routes/friendsRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Initialize Express Application
const app = express();

// Set Port from environment or fallback to 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Core Middleware: Production CORS & Safe Origins
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://localhost:4173'
];

const envAllowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : [];

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envAllowedOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser calls (like curl, Postman, health check monitoring, or same-origin)
      if (!origin) return callback(null, true);
      if (
        process.env.NODE_ENV !== 'production' ||
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: Origin ${origin} is not allowed.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Payload size limits for DoS mitigation
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 1. Production Health Check Route
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: isDbConnected ? 'healthy' : 'degraded',
    success: true,
    message: isDbConnected
      ? 'LifeForge RPG backend operational'
      : 'LifeForge RPG backend running (Database offline/reconnecting)',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: isDbConnected ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to LifeForge Goal-to-Boss RPG API Engine'
  });
});

// 2. Authentication API Routes
app.use('/api/auth', authRoutes);

// 3. Goal API Routes (Protected)
app.use('/api/goals', goalRoutes);

// 4. Quest API Routes (Protected)
app.use('/api/quests', questRoutes);

// 5. Daily Challenge API Routes (Protected)
app.use('/api/daily-challenges', dailyChallengeRoutes);

// 6. Leaderboard API Routes (Protected)
app.use('/api/leaderboard', leaderboardRoutes);

// 7. Friends & Social API Routes (Protected)
app.use('/api/friends', friendsRoutes);

// 8. Analytics & Progress API Routes (Protected)
app.use('/api/analytics', analyticsRoutes);

// 9. Notifications API Routes (Protected)
app.use('/api/notifications', notificationRoutes);

// 10. Achievements & Level-Up API Routes (Protected)
const achievementRoutes = require('./routes/achievementRoutes');
app.use('/api/achievements', achievementRoutes);

// 11. AI Life Coach & Smart Recommendations API Routes (Protected)
const aiCoachRoutes = require('./routes/aiCoachRoutes');
app.use('/api/ai-coach', aiCoachRoutes);

// 12. Admin Management Panel API Routes (Protected/Admin)
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// 3. 404 Route Handler for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on LifeForge server.`
  });
});

// 4. Global Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('❌ [Server Error]:', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start listening
const server = app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 LifeForge RPG Server running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🛡️  Auth API:    http://localhost:${PORT}/api/auth`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=============================================`);
});

// Graceful process termination handlers for containerized production platforms
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 [${signal}] received. Closing LifeForge HTTP server gracefully...`);
  server.close(async () => {
    console.log('🔒 HTTP server connections closed.');
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close(false);
        console.log('🗄️  MongoDB connection closed cleanly.');
      }
      process.exit(0);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });

  // Force close if lingering connections exceed 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forcing shutdown after timeout.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

