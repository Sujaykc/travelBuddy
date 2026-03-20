const Joi = require('joi');

const updateProfileSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  dateOfBirth: Joi.date(),
  profileImage: Joi.string().uri()
});

module.exports = { updateProfileSchema };
