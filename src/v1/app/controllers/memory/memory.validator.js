const Joi = require('joi');

const createMemorySchema = Joi.object({
  tripDate: Joi.date().max('now').required(),
  place: Joi.string().trim().required(),
  images: Joi.array().items(Joi.string().trim().uri()),
  description: Joi.string().trim()
});

const updateMemorySchema = Joi.object({
  tripDate: Joi.date().max('now'),
  place: Joi.string().trim(),
  images: Joi.array().items(Joi.string().trim().uri()),
  description: Joi.string().trim()
}).min(1);

const memoryIdSchema = Joi.object({
  id: Joi.string().trim().hex().length(24).required()
});

module.exports = { createMemorySchema, updateMemorySchema, memoryIdSchema };
