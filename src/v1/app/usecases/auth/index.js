const createSignupUseCase = require('./signup.usecase');
const createVerifyEmailUseCase = require('./verify-email.usecase');
const createResendOtpUseCase = require('./resend-otp.usecase');
const createLoginUseCase = require('./login.usecase');
const createRefreshTokenUseCase = require('./refresh-token.usecase');
const createLogoutUseCase = require('./logout.usecase');
const createSocialLoginUseCase = require('./social-login.usecase');
const createForgotPasswordUseCase = require('./forgot-password.usecase');
const createResetPasswordUseCase = require('./reset-password.usecase');

const createAuthUseCases = (deps) => ({
  signup: createSignupUseCase(deps),
  verifyEmail: createVerifyEmailUseCase(deps),
  resendOtp: createResendOtpUseCase(deps),
  login: createLoginUseCase(deps),
  refreshToken: createRefreshTokenUseCase(deps),
  logout: createLogoutUseCase(deps),
  socialLogin: createSocialLoginUseCase(deps),
  forgotPassword: createForgotPasswordUseCase(deps),
  resetPassword: createResetPasswordUseCase(deps)
});

module.exports = {
  createAuthUseCases
};

