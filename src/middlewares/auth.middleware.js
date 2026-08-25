const jwt = require('jsonwebtoken');
const { User } = require('../v1/models');
const { AppError } = require('../v1/app/usecases/errors');
const logger = require('../helpers/logger');

const buildUnauthorizedError = (message) => new AppError(message, 401, 'UNAUTHORIZED');

const rejectUnauthorized = (res, next, message) => {
  res.status(401);
  return next(buildUnauthorizedError(message));
};

const protect = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return rejectUnauthorized(res, next, 'Not authorized, no token');
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return rejectUnauthorized(res, next, 'Not authorized, user not found');
    }

    req.user = user;
    return next();
  } catch (error) {
    if (logger && typeof logger.warn === 'function') {
      logger.warn('JWT verification failed', {
        message: error.message,
        name: error.name
      });
    }
    return rejectUnauthorized(res, next, 'Not authorized, token failed');
  }
};

module.exports = { protect };
