const Joi = require('joi');

const createTripSchema = Joi.object({
  destination: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required(),
  description: Joi.string().required()
});

const updateTripSchema = Joi.object({
  destination: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date().min(Joi.ref('startDate')),
  description: Joi.string()
});

module.exports = { createTripSchema, updateTripSchema };
