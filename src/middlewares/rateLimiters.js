const { RateLimiterMemory } = require('rate-limiter-flexible');

const normalizeIp = (ip) => {
  if (!ip) return 'unknown';
  if (ip.startsWith('::ffff:')) return ip.slice(7);
  return ip;
};

const getClientIp = (req) => normalizeIp(req.ip);

const otpKeyGenerator = (req) => {
  const ip = getClientIp(req);
  const email = (req.body && req.body.email ? String(req.body.email).toLowerCase().trim() : '');
  return `${ip}_${email}`;
};

const ipKeyGenerator = (req) => getClientIp(req);

const createRateLimiterMiddleware = ({ points, duration, keyGenerator, message }) => {
  const limiter = new RateLimiterMemory({ points, duration });

  return (req, res, next) => {
    const key = keyGenerator(req);
    limiter.consume(key)
      .then(() => next())
      .catch((rateLimitError) => {
        const retryAfterSecs = Math.ceil((rateLimitError.msBeforeNext || 0) / 1000) || 1;
        res.set('Retry-After', String(retryAfterSecs));
        res.status(429).json({
          message: message || 'Too many requests, please try again later.'
        });
      });
  };
};

const OTP_POINTS = 5;
const ONE_HOUR_SECS = 60 * 60;

const otpRegisterLimiter = createRateLimiterMiddleware({
  points: OTP_POINTS,
  duration: ONE_HOUR_SECS,
  keyGenerator: otpKeyGenerator,
  message: 'Too many OTP requests. Please try again later.'
});

const otpLoginLimiter = createRateLimiterMiddleware({
  points: OTP_POINTS,
  duration: ONE_HOUR_SECS,
  keyGenerator: otpKeyGenerator,
  message: 'Too many OTP requests. Please try again later.'
});

const otpResendLimiter = createRateLimiterMiddleware({
  points: OTP_POINTS,
  duration: ONE_HOUR_SECS,
  keyGenerator: otpKeyGenerator,
  message: 'Too many OTP requests. Please try again later.'
});

const otpVerificationLimiter = createRateLimiterMiddleware({
  points: OTP_POINTS,
  duration: ONE_HOUR_SECS,
  keyGenerator: otpKeyGenerator,
  message: 'Too many verification attempts. Please try again later.'
});

const authLimiter = createRateLimiterMiddleware({
  points: 20,
  duration: 15 * 60,
  keyGenerator: ipKeyGenerator,
  message: 'Too many auth requests. Please try again later.'
});

module.exports = {
  otpRegisterLimiter,
  otpLoginLimiter,
  otpResendLimiter,
  otpVerificationLimiter,
  authLimiter,
  createRateLimiterMiddleware,
  getClientIp,
  normalizeIp,
  otpKeyGenerator,
  ipKeyGenerator
};
