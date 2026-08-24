const { updateProfileSchema } = require('../user.validator');
const { validatePayload, ensureUserId } = require('../../common/dto-helpers');

const from = (user, payload) => {
  const userId = ensureUserId(user);
  const data = validatePayload(updateProfileSchema, payload);

  return {
    userId,
    ...data
  };
};

module.exports = {
  schema: updateProfileSchema,
  from
};
