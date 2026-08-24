const { notificationIdSchema } = require('../notification.validator');
const { validateId, ensureUserId } = require('../../common/dto-helpers');

const from = (user, notificationId) => {
  const userId = ensureUserId(user);
  const id = validateId(notificationIdSchema, notificationId);

  return {
    userId,
    notificationId: id
  };
};

module.exports = {
  from
};
