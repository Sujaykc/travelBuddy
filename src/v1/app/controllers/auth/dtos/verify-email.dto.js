const { verifyEmailSchema } = require('../auth.validator');
const { validatePayload } = require('../../common/dto-helpers');

const from = (payload) => validatePayload(verifyEmailSchema, payload);

module.exports = {
  schema: verifyEmailSchema,
  from
};
