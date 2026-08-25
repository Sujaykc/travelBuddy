const { resendOtpSchema } = require('../auth.validator');
const { validatePayload } = require('../../common/dto-helpers');

const from = (payload) => validatePayload(resendOtpSchema, payload);

module.exports = {
  schema: resendOtpSchema,
  from
};
