const jwt = require('jsonwebtoken');
const { User } = require('../v1/models');
const { AppError } = require('../v1/app/usecases/errors');
const logger = require('../helpers/logger');

const buildUnauthorizedError = (message) => new AppError(message, 401, 'UNAUTHORIZED');

const protect = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return next(buildUnauthorizedError('Not authorized, no token'));
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(buildUnauthorizedError('Not authorized, user not found'));
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
    return next(buildUnauthorizedError('Not authorized, token failed'));
  }
};

module.exports = { protect };
