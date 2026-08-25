const Joi = require('joi');

const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().min(1),
  lastName: Joi.string().trim().min(1),
  dateOfBirth: Joi.date().max('now'),
  profileImage: Joi.string().trim().uri()
}).min(1);

module.exports = { updateProfileSchema };
