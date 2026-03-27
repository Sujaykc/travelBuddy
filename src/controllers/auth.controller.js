const authService = require('../services/auth.service.js');

const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const result = await authService.verifyEmail(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

const resendOtp = async (req, res, next) => {
  try {
    // Reusing verifyEmail check logic or simple message as before
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json({ message: 'OTP recent successfully. Use 123456.' });
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const result = await authService.refreshToken(req.body);
    res.json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const result = await authService.logout(req.user._id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

const socialLogin = async (req, res, next) => {
  try {
    const result = await authService.socialLogin(req.body);
    res.json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

module.exports = {
  signup,
  verifyEmail,
  resendOtp,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  socialLogin
};

