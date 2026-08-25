const { AppError } = require('../v1/app/usecases/errors');

const REQUIRED_HEADERS = [
  { name: 'x-api-key', message: 'x-api-key is required in header' },
  { name: 'x-app-version', message: 'x-app-version is required in header' },
  { name: 'x-app-deviceType', message: 'x-app-deviceType is required in header' }
];

const validateHeaders = (req, _res, next) => {
  for (const { name, message } of REQUIRED_HEADERS) {
    const value = req.header(name);
    if (value === undefined || value === null || String(value).trim() === '') {
      return next(new AppError(message, 403, 'INVALID_HEADERS'));
    }
  }

  return next();
};

module.exports = validateHeaders;
