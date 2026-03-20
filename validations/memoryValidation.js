const Joi = require('joi');

const createMemorySchema = Joi.object({
  tripDate: Joi.date().required(),
  place: Joi.string().required(),
  images: Joi.array().items(Joi.string().uri()),
  description: Joi.string()
});

const updateMemorySchema = Joi.object({
  tripDate: Joi.date(),
  place: Joi.string(),
  images: Joi.array().items(Joi.string().uri()),
  description: Joi.string()
});

module.exports = { createMemorySchema, updateMemorySchema };
