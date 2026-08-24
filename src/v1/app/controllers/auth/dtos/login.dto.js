const { loginSchema } = require('../auth.validator');
const { validatePayload } = require('../../common/dto-helpers');

const from = (payload) => validatePayload(loginSchema, payload);

module.exports = {
  schema: loginSchema,
  from
};
