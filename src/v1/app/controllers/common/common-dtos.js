const { ensureUserId, validateId, validatePayload } = require('./dto-helpers');

const fromUserOnly = (user) => ({
  userId: ensureUserId(user)
});

const fromIdAndUser = (idSchema, idKey) => (user, idValue) => {
  const userId = ensureUserId(user);
  const id = validateId(idSchema, idValue);

  return {
    userId,
    [idKey]: id
  };
};

const fromUserAndPayload = (payloadSchema) => (user, payload) => {
  const userId = ensureUserId(user);
  const data = validatePayload(payloadSchema, payload);

  return {
    userId,
    ...data
  };
};

const fromIdUserAndPayload = (idSchema, idKey, payloadSchema) => (user, idValue, payload) => {
  const userId = ensureUserId(user);
  const data = validatePayload(payloadSchema, payload);
  const id = validateId(idSchema, idValue);

  return {
    userId,
    [idKey]: id,
    ...data
  };
};

module.exports = {
  fromUserOnly,
  fromIdAndUser,
  fromUserAndPayload,
  fromIdUserAndPayload
};
