const { AppError } = require('../v1/app/usecases/errors');

const getValidationData = (req, source) => {
  if (typeof source === 'function') {
    return source(req);
  }

  if (source === 'params') {
    return req.params;
  }

  if (source === 'query') {
    return req.query;
  }

  return req.body;
};

const getValidationTarget = (source) => {
  if (source === 'params' || source === 'query') {
    return source;
  }

  return 'body';
};

const validate = (schema, source = 'body') => (req, res, next) => {
  const data = getValidationData(req, source);
  const { value, error } = schema.validate(data, {
    abortEarly: true,
    stripUnknown: true
  });

  if (error) {
    res.status(400);
    return next(new AppError(error.details[0].message, 400, 'VALIDATION_ERROR'));
  }

  if (typeof source !== 'function') {
    const target = getValidationTarget(source);
    req[target] = value;
  }

  next();
};

module.exports = validate;
