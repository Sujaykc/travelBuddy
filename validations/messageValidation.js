const Joi = require('joi');

const sendMessageSchema = Joi.object({
  receiverId: Joi.string().hex().length(24).required(),
  content: Joi.string().required()
});

module.exports = { sendMessageSchema };
