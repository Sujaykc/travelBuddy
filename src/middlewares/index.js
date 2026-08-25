const { protect } = require('./auth.middleware.js');
const { notFound, errorHandler } = require('./error.middleware.js');
const validate = require('./validate.middleware.js');
const validateHeaders = require('./validateHeaders.js');
const { requireAppApiKey, requireAuthToken } = require('./apiRequest.js');
const rateLimiters = require('./rateLimiters.js');
const responseWrapper = require('./responseWrapper.js');

module.exports = {
  protect,
  notFound,
  errorHandler,
  validate,
  validateHeaders,
  requireAppApiKey,
  requireAuthToken,
  rateLimiters,
  responseWrapper
};
