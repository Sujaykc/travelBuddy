const { AppError } = require('../../usecases/errors');
const { normalizeId } = require('../../entities/value-objects/id');

const validatePayload = (schema, payload) => {
  const { value, error } = schema.validate(payload, {
    abortEarly: true,
    stripUnknown: true
  });

  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  return value;
};

const validateId = (schema, id, key = 'id') => {
  const data = validatePayload(schema, { [key]: id });
  return data[key];
};

const ensureUserId = (user) => {
  const userId = normalizeId(user);
  if (!userId) {
    throw new AppError('Not authorized, user not found', 401, 'UNAUTHORIZED');
  }

  return userId;
};

module.exports = {
  validatePayload,
  validateId,
  ensureUserId
};
