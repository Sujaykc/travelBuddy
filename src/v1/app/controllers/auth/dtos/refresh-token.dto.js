const { refreshTokenSchema } = require('../auth.validator');
const { validatePayload } = require('../../common/dto-helpers');

const from = (payload) => validatePayload(refreshTokenSchema, payload);

module.exports = {
  schema: refreshTokenSchema,
  from
};
