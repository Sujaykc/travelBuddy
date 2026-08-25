const crypto = require('node:crypto');
const { AppError } = require('../v1/app/usecases/errors');

const timingSafeEqualStr = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  if (bufA.length === 0) return true;
  return crypto.timingSafeEqual(bufA, bufB);
};

const requireAppApiKey = (req, _res, next) => {
  const apiKey = req.header('x-api-key');
  if (!apiKey) {
    return next(new AppError('x-api-key is required in header', 403, 'API_KEY_REQUIRED'));
  }

  const envKey = process.env.APP_API_KEY;
  if (!envKey) {
    return next(new AppError('API key not configured', 500, 'API_KEY_NOT_CONFIGURED'));
  }

  if (!timingSafeEqualStr(apiKey, envKey)) {
    return next(new AppError('Invalid api key', 403, 'INVALID_API_KEY'));
  }

  return next();
};

const requireAuthToken = (req, _res, next) => {
  if (!req.header('Authorization')) {
    return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
  }
  return next();
};

module.exports = {
  requireAppApiKey,
  requireAuthToken
};
