const { resetPasswordSchema } = require('../auth.validator');
const { validatePayload } = require('../../common/dto-helpers');

const from = (payload) => validatePayload(resetPasswordSchema, payload);

module.exports = {
  schema: resetPasswordSchema,
  from
};
