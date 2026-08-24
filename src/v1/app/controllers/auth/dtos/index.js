const { fromUserOnly } = require('../../common/common-dtos');

module.exports = {
  signup: require('./signup.dto'),
  login: require('./login.dto'),
  verifyEmail: require('./verify-email.dto'),
  resendOtp: require('./resend-otp.dto'),
  forgotPassword: require('./forgot-password.dto'),
  resetPassword: require('./reset-password.dto'),
  refreshToken: require('./refresh-token.dto'),
  socialLogin: require('./social-login.dto'),
  logout: { fromUser: fromUserOnly }
};
