const mongoose = require('mongoose');
const dns = require('dns');

// On Windows or restrictive networks, system DNS can fail SRV record resolution for mongodb+srv://
// Set trusted public DNS fallback servers (Cloudflare / Google)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Silent fallback
}

/**
 * Reusable MongoDB Connection Function
 * Connects to MongoDB using connection URI from environment variables.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri === 'your_mongodb_connection_string') {
      console.warn('⚠️  [MongoDB Warning]: MONGO_URI is not configured in backend/.env.');
      console.warn('⚠️  Backend is running in degraded mode. Health checks will report database: "disconnected".');
      return false;
    }

    if (mongoUri.includes('<db_password>') || mongoUri.includes('<password>')) {
      console.warn('⚠️  [MongoDB Warning]: MONGO_URI contains unreplaced password placeholder (<db_password>).');
      console.warn('💡  [Action Required]: Please edit backend/.env and replace <db_password> with your actual MongoDB Atlas database user password.');
      return false;
    }

    // Safe masking helper so credentials are never exposed in console/logs
    const maskUri = (uri) => {
      try {
        const lastAt = uri.lastIndexOf('@');
        if (lastAt !== -1) {
          const hostPart = uri.substring(lastAt + 1);
          return `mongodb+srv://***:***@${hostPart}`;
        }
        return 'mongodb://***:***@[masked]';
      } catch {
        return 'mongodb://***:***@[masked]';
      }
    };

    // Auto-encode special characters in password (such as '@', ':', '#') safely
    let normalizedUri = mongoUri.trim();
    try {
      const lastAtIndex = normalizedUri.lastIndexOf('@');
      const protocolMatch = normalizedUri.match(/^(mongodb(?:\+srv)?:\/\/)(.+)$/);
      if (protocolMatch && lastAtIndex !== -1) {
        const protocol = protocolMatch[1];
        const hostAndQuery = normalizedUri.substring(lastAtIndex + 1);
        const creds = normalizedUri.substring(protocol.length, lastAtIndex);
        const firstColon = creds.indexOf(':');
        if (firstColon !== -1) {
          const rawUser = creds.substring(0, firstColon);
          const rawPass = creds.substring(firstColon + 1);
          const encodedUser = encodeURIComponent(decodeURIComponent(rawUser));
          const encodedPass = encodeURIComponent(decodeURIComponent(rawPass));
          normalizedUri = `${protocol}${encodedUser}:${encodedPass}@${hostAndQuery}`;
        }
      }
    } catch (e) {
      normalizedUri = mongoUri.trim();
    }

    // Set connection event listeners once
    if (mongoose.connection.listenerCount('connected') === 0) {
      mongoose.connection.on('connected', () => {
        console.log(`✓ [MongoDB Connected]: Database operational at ${mongoose.connection.host}/${mongoose.connection.name}`);
      });
      mongoose.connection.on('error', (err) => {
        console.error(`❌ [MongoDB Error]: ${err.message}`);
      });
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  [MongoDB Disconnected]: Database connection lost.');
      });
    }

    const conn = await mongoose.connect(normalizedUri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`✓ [MongoDB Initialized]: Connected to ${conn.connection.host}/${conn.connection.name} (URI: ${maskUri(normalizedUri)})`);
    return true;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Failed]: ${error.message}`);
    console.warn(`💡 [Diagnosis]:`);
    console.warn(`   - Target: cluster0.5eodkx3.mongodb.net/lifeforge`);
    console.warn(`   - If 'bad auth', verify username & password in MongoDB Atlas Database Access.`);
    console.warn(`   - If 'querySrv', verify network access allows 0.0.0.0/0.`);
    return false;
  }
};

module.exports = connectDB;
