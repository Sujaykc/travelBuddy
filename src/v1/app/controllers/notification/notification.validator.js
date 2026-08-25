const Joi = require('joi');

const notificationIdSchema = Joi.object({
  id: Joi.string().trim().hex().length(24).required()
});

module.exports = { notificationIdSchema };
