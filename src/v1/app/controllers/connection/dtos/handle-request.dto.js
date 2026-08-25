const { handleConnectionSchema } = require('../connection.validator');
const { validatePayload, ensureUserId } = require('../../common/dto-helpers');

const from = (user, connectionId, payload) => {
  const userId = ensureUserId(user);
  const data = validatePayload(handleConnectionSchema, {
    connectionId,
    ...payload
  });

  return {
    userId,
    connectionId: data.connectionId,
    action: data.action
  };
};

module.exports = {
  schema: handleConnectionSchema,
  from
};
