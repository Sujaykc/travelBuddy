const asyncHandler = require('../../../../helpers/asyncHandler');
const { authUseCases } = require('../../../../app');
const authDtos = require('./dtos');
const authMapper = require('./auth.mapper');

const signup = asyncHandler(async (req, res) => {
  const input = authDtos.signup.from(req.body);
  const result = await authUseCases.signup(input);
  res.status(201).json(result);
});

const verifyEmail = asyncHandler(async (req, res) => {
  const input = authDtos.verifyEmail.from(req.body);
  const result = await authUseCases.verifyEmail(input);
  res.status(200).json(result);
});

const resendOtp = asyncHandler(async (req, res) => {
  const input = authDtos.resendOtp.from(req.body);
  const result = await authUseCases.resendOtp(input);
  res.status(200).json(result);
});

const login = asyncHandler(async (req, res) => {
  const input = authDtos.login.from(req.body);
  const result = await authUseCases.login(input);
  res.status(200).json(authMapper.toAuthResponse(result.user, result.tokens));
});

const refreshToken = asyncHandler(async (req, res) => {
  const input = authDtos.refreshToken.from(req.body);
  const result = await authUseCases.refreshToken(input);
  res.status(200).json(authMapper.toRefreshTokenResponse(result.tokens));
});

const logout = asyncHandler(async (req, res) => {
  const input = authDtos.logout.fromUser(req.user);
  const result = await authUseCases.logout(input);
  res.status(200).json(result);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const input = authDtos.forgotPassword.from(req.body);
  const result = await authUseCases.forgotPassword(input);
  res.status(200).json(result);
});

const resetPassword = asyncHandler(async (req, res) => {
  const input = authDtos.resetPassword.from(req.body);
  const result = await authUseCases.resetPassword(input);
  res.status(200).json(result);
});

const socialLogin = asyncHandler(async (req, res) => {
  const input = authDtos.socialLogin.from(req.body);
  const result = await authUseCases.socialLogin(input);
  res.status(200).json(authMapper.toAuthResponse(result.user, result.tokens));
});

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
