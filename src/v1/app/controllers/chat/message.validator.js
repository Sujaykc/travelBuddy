const Joi = require('joi');

const sendMessageSchema = Joi.object({
  receiverId: Joi.string().trim().hex().length(24).required(),
  content: Joi.string().trim().min(1).max(2000).required()
});

const messageUserIdSchema = Joi.object({
  userId: Joi.string().trim().hex().length(24).required()
});

module.exports = { sendMessageSchema, messageUserIdSchema };
