const Joi = require('joi');

const createTripSchema = Joi.object({
  destination: Joi.string().trim().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required(),
  description: Joi.string().trim().required()
});

const updateTripSchema = Joi.object({
  destination: Joi.string().trim(),
  startDate: Joi.date(),
  endDate: Joi.date().min(Joi.ref('startDate')),
  description: Joi.string().trim()
}).min(1);

const tripIdSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});

module.exports = { createTripSchema, updateTripSchema, tripIdSchema };
