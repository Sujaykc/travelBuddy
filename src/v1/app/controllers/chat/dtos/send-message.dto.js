const { sendMessageSchema } = require('../message.validator');
const { validatePayload, ensureUserId } = require('../../common/dto-helpers');

const from = (user, payload) => {
  const userId = ensureUserId(user);
  const data = validatePayload(sendMessageSchema, payload);

  return {
    userId,
    receiverId: data.receiverId,
    content: data.content
  };
};

module.exports = {
  schema: sendMessageSchema,
  from
};
