const jwt = require('jsonwebtoken');

const signToken = (id, secret, expiresIn) =>
  jwt.sign({ id }, secret, { expiresIn });

const generateToken = (id) => {
  return signToken(id, process.env.JWT_SECRET, '1d');
};

const generateRefreshToken = (id) => {
  return signToken(id, process.env.JWT_REFRESH_SECRET, '7d');
};

module.exports = { generateToken, generateRefreshToken };
