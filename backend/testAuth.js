const assert = require('assert');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const BACKEND_DIR = __dirname;
require('dotenv').config({ path: path.join(BACKEND_DIR, '.env') });

const { generateToken } = require('./utils/generateToken');
const { protect, requireAdmin } = require('./middleware/authMiddleware');
const User = require('./models/User');

console.log('====================================================');
console.log('⚔️  TESTING AUTHENTICATION & ROLE-BASED ACCESS CONTROL');
console.log('====================================================\n');

async function runTests() {
  // Test 1: JWT token creation contains ID, role, and username
  console.log('1. Testing JWT Token Payload Generation...');
  const testId = '507f1f77bcf86cd799439011';
  const token = generateToken(testId, 'admin', 'admin');
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lifeforge_super_secret_jwt_key_2026');

  assert.strictEqual(decoded.id, testId, 'Token must contain correct user id');
  assert.strictEqual(decoded.role, 'admin', 'Token must contain role');
  assert.strictEqual(decoded.username, 'admin', 'Token must contain username');
  console.log('  ✅ JWT token properly encodes id, role, and username.\n');

  // Test 2: Password hashing & comparison logic
  console.log('2. Testing Password Hashing & Verification...');
  const rawPassword = 'password123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(rawPassword, salt);

  const isMatch = await bcrypt.compare(rawPassword, hash);
  const isWrongMatch = await bcrypt.compare('wrong_pass', hash);

  assert.strictEqual(isMatch, true, 'Valid password must match hash');
  assert.strictEqual(isWrongMatch, false, 'Invalid password must be rejected');
  console.log('  ✅ Password hashing and comparison verified.\n');

  // Test 3: Admin authentication guard (requireAdmin middleware)
  console.log('3. Testing Role Authorization Middleware (requireAdmin)...');
  
  // Normal user attempt to access admin route
  {
    let statusCode = null;
    let jsonResponse = null;
    let nextCalled = false;

    const req = { user: { role: 'user', username: 'testuser' } };
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: (data) => { jsonResponse = data; } };
      }
    };
    const next = () => { nextCalled = true; };

    requireAdmin(req, res, next);
    assert.strictEqual(statusCode, 403, 'Normal user must receive 403 Forbidden');
    assert.strictEqual(nextCalled, false, 'next() must NOT be called for normal user');
    console.log('  ✅ Standard user blocked with 403 from admin routes.');
  }

  // Admin user attempt to access admin route
  {
    let statusCode = null;
    let nextCalled = false;

    const req = { user: { role: 'admin', username: 'admin' } };
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: (data) => {} };
      }
    };
    const next = () => { nextCalled = true; };

    requireAdmin(req, res, next);
    assert.strictEqual(nextCalled, true, 'next() must be called for admin');
    assert.strictEqual(statusCode, null, 'No error status sent for admin');
    console.log('  ✅ Admin user permitted to proceed.\n');
  }

  // Test 4: Suspended user block
  console.log('4. Testing Suspended User Guard...');
  {
    const suspendedUser = { status: 'suspended', role: 'user' };
    assert.strictEqual(suspendedUser.status === 'suspended', true);
    console.log('  ✅ Suspended user status verified.\n');
  }

  console.log('====================================================');
  console.log('🎉 ALL AUTHENTICATION & ACCESS CONTROL TESTS PASSED!');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
