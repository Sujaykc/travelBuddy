const { forgotPasswordSchema } = require('../auth.validator');
const { validatePayload } = require('../../common/dto-helpers');

const from = (payload) => validatePayload(forgotPasswordSchema, payload);

module.exports = {
  schema: forgotPasswordSchema,
  from
};
