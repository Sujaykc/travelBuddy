const jwt = require('jsonwebtoken');
const { generateToken, generateRefreshToken } = require('../../helpers');

const createTokenService = () => ({
  createAccessToken: (userId) => generateToken(userId),
  createRefreshToken: (userId) => generateRefreshToken(userId),
  verifyRefreshToken: (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET)
});

module.exports = createTokenService;
