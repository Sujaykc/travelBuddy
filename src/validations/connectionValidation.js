const Joi = require('joi');

const sendConnectionSchema = Joi.object({
  recipientId: Joi.string().hex().length(24).required()
});

const handleConnectionSchema = Joi.object({
  connectionId: Joi.string().hex().length(24).required(),
  action: Joi.string().valid('accept', 'reject').required()
});

module.exports = { sendConnectionSchema, handleConnectionSchema };
