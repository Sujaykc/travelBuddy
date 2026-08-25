const { socialLoginSchema } = require('../auth.validator');
const { validatePayload } = require('../../common/dto-helpers');

const from = (payload) => validatePayload(socialLoginSchema, payload);

module.exports = {
  schema: socialLoginSchema,
  from
};
