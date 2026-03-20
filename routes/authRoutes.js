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
} = require('../controllers');
const {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendOtpSchema,
  socialLoginSchema
} = require('../validations');
const { protect } = require('../middlewares');

const router = express.Router();

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400);
    return next(new Error(error.details[0].message));
  }
  next();
};

router.post('/signup', validate(registerSchema), signup);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/resend-otp', validate(resendOtpSchema), resendOtp);
router.post('/login', validate(loginSchema), login);
router.post('/social-login', validate(socialLoginSchema), socialLogin);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

module.exports = router;
