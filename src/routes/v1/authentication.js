const express = require('express');
const {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  resendOtp,
  refreshToken,
  socialLogin
} = require('../../v1/app/controllers/auth/auth.controller');
const { protect } = require('../../middlewares');
const {
  otpRegisterLimiter,
  otpVerificationLimiter,
  otpResendLimiter,
  authLimiter
} = require('../../middlewares/rateLimiters');

const router = express.Router();

router.post('/signup', otpRegisterLimiter, signup);
router.post('/verify-email', otpVerificationLimiter, verifyEmail);
router.post('/resend-otp', otpResendLimiter, resendOtp);
router.post('/login', authLimiter, login);
router.post('/social-login', authLimiter, socialLogin);
router.post('/refresh-token', authLimiter, refreshToken);
router.post('/logout', protect, logout);
router.post('/forgot-password', otpResendLimiter, forgotPassword);
router.post('/reset-password', otpVerificationLimiter, resetPassword);

module.exports = router;
