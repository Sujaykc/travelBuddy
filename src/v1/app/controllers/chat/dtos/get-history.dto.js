const { messageUserIdSchema } = require('../message.validator');
const { validatePayload, ensureUserId } = require('../../common/dto-helpers');

const from = (user, otherUserId) => {
  const userId = ensureUserId(user);
  const data = validatePayload(messageUserIdSchema, { userId: otherUserId });

  return {
    userId,
    otherUserId: data.userId
  };
};

module.exports = {
  from
};
