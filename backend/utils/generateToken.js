const jwt = require('jsonwebtoken');

/**
 * Generate signed JWT token
 */
const generateToken = (id, role = 'user', username = '') => {
  return jwt.sign(
    { id, role, username },
    process.env.JWT_SECRET || 'lifeforge_super_secret_jwt_key_2026',
    {
      expiresIn: '7d'
    }
  );
};

module.exports = { generateToken };
