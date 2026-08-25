const Joi = require('joi');
const authConfig = require('../../../../config/auth.config');

const OTP_LENGTH = authConfig.otpLength;
const otpSchema = Joi.string()
  .pattern(new RegExp(`^\\d{${OTP_LENGTH}}$`))
  .required();

const registerSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
  deviceToken: Joi.string().optional()
});

const verifyEmailSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  otp: otpSchema
});

const resendOtpSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required()
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  otp: otpSchema,
  newPassword: Joi.string().min(6).required()
});

const refreshTokenSchema = Joi.object({
  token: Joi.string().required(),
  deviceToken: Joi.string().optional()
});

const socialLoginSchema = Joi.object({
  provider: Joi.string().trim().lowercase().valid('google', 'apple').required(),
  idToken: Joi.string().trim().required(),
  providerId: Joi.string().trim().optional(),
  email: Joi.string().trim().lowercase().email().optional(),
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  deviceToken: Joi.string().trim().optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  socialLoginSchema
};
