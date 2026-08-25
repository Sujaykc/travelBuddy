const Joi = require('joi');

const sendConnectionSchema = Joi.object({
  recipientId: Joi.string().trim().hex().length(24).required()
});

const handleConnectionSchema = Joi.object({
  connectionId: Joi.string().trim().hex().length(24).required(),
  action: Joi.string().trim().lowercase().valid('accept', 'reject').required()
});

module.exports = { sendConnectionSchema, handleConnectionSchema };
