require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

/**
 * LifeForge Demo Users Seed Script
 * Upserts Admin and Test User without creating duplicates or storing plain text passwords.
 */
async function seedDemoUsers() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri === 'your_mongodb_connection_string') {
    console.error('❌ [Seed Error]: MONGO_URI is not set in backend/.env.');
    console.error('💡 Please set MONGO_URI to your local MongoDB or MongoDB Atlas cluster connection string.');
    process.exit(1);
  }

  if (mongoUri.includes('<db_password>') || mongoUri.includes('<password>')) {
    console.error('❌ [Seed Error]: MONGO_URI contains unreplaced placeholder <db_password>.');
    console.error('💡 Please edit backend/.env and replace <db_password> with your actual MongoDB Atlas database password.');
    process.exit(1);
  }

  // Auto-encode special characters in password if raw '@', ':', or '#' are present
  let normalizedUri = mongoUri;
  try {
    const protocolMatch = mongoUri.match(/^(mongodb(?:\+srv)?:\/\/)(.+)$/);
    if (protocolMatch) {
      const rest = protocolMatch[2];
      const lastAtIndex = rest.lastIndexOf('@');
      if (lastAtIndex !== -1) {
        const userPass = rest.substring(0, lastAtIndex);
        const hostAndQuery = rest.substring(lastAtIndex + 1);
        const firstColonIndex = userPass.indexOf(':');
        if (firstColonIndex !== -1) {
          const username = userPass.substring(0, firstColonIndex);
          const password = userPass.substring(firstColonIndex + 1);
          normalizedUri = `${protocolMatch[1]}${encodeURIComponent(decodeURIComponent(username))}:${encodeURIComponent(decodeURIComponent(password))}@${hostAndQuery}`;
        }
      }
    }
  } catch (e) {
    normalizedUri = mongoUri;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(normalizedUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✓ [Connected]: ${mongoose.connection.host}/${mongoose.connection.name}`);

    // Define Demo Accounts
    const demoAccounts = [
      {
        email: 'admin@lifeforge.com',
        username: 'admin',
        name: 'Grand Guardian Admin',
        rawPassword: 'admin123',
        role: 'admin',
        level: 50,
        xp: 12500,
        streak: 30,
        longestStreak: 45,
        status: 'active',
        avatar: 'AD'
      },
      {
        email: 'testuser@lifeforge.com',
        username: 'testuser',
        name: 'Test Quester Hero',
        rawPassword: 'password123',
        role: 'user',
        level: 5,
        xp: 1200,
        streak: 7,
        longestStreak: 14,
        status: 'active',
        avatar: 'TQ'
      }
    ];

    console.log('\n⚔️  Seeding / Upserting Demo Accounts into LifeForge...');

    for (const acc of demoAccounts) {
      // Check if user exists by email or username
      let existing = await User.findOne({
        $or: [{ email: acc.email }, { username: acc.username }]
      });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(acc.rawPassword, salt);

      if (existing) {
        existing.name = acc.name;
        existing.email = acc.email;
        existing.username = acc.username;
        existing.password = hashedPassword;
        existing.role = acc.role;
        existing.status = acc.status;
        existing.level = existing.level || acc.level;
        existing.xp = existing.xp || acc.xp;
        await existing.save();
        console.log(`   ✓ [UPDATED]: ${acc.role.toUpperCase()} -> ${acc.email} (Username: ${acc.username})`);
      } else {
        await User.create({
          name: acc.name,
          username: acc.username,
          email: acc.email,
          password: acc.rawPassword, // Pre-save hook will hash this securely
          role: acc.role,
          level: acc.level,
          xp: acc.xp,
          streak: acc.streak,
          longestStreak: acc.longestStreak,
          status: acc.status,
          avatar: acc.avatar
        });
        console.log(`   ✓ [CREATED]: ${acc.role.toUpperCase()} -> ${acc.email} (Username: ${acc.username})`);
      }
    }

    console.log('\n🎉 Demo users seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('1. Admin Account:');
    console.log('   Email / Username: admin@lifeforge.com  (or "admin")');
    console.log('   Password:         admin123');
    console.log('   Role:             admin');
    console.log('----------------------------------------------------');
    console.log('2. Standard Test User:');
    console.log('   Email / Username: testuser@lifeforge.com  (or "testuser")');
    console.log('   Password:         password123');
    console.log('   Role:             user');
    console.log('----------------------------------------------------\n');

    await mongoose.connection.close();
    console.log('✓ Database connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ [Seed Failed]: ${error.message}`);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

seedDemoUsers();
