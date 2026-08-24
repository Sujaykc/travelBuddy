const { sendConnectionSchema } = require('../connection.validator');
const { validatePayload, ensureUserId } = require('../../common/dto-helpers');

const from = (user, payload) => {
  const userId = ensureUserId(user);
  const data = validatePayload(sendConnectionSchema, payload);

  return {
    userId,
    recipientId: data.recipientId
  };
};

module.exports = {
  schema: sendConnectionSchema,
  from
};
