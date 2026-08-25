const { registerSchema } = require('../auth.validator');
const { validatePayload } = require('../../common/dto-helpers');

const from = (payload) => validatePayload(registerSchema, payload);

module.exports = {
  schema: registerSchema,
  from
};
