const { User } = require('../models');
const { generateToken, generateRefreshToken } = require('../utils');
const jwt = require('jsonwebtoken');

const signup = async ({ firstName, lastName, email, password }) => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error('User already exists');
    error.status = 400;
    throw error;
  }

  // NOTE: User model has a pre-save hook that hashes the password.
  // We don't need to hash it here to avoid double-hashing or bugs.
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    isVerified: false
  });

  return {
    message: 'User registered successfully. Please verify your email with OTP 123456.',
    email: user.email
  };
};

const verifyEmail = async ({ email, otp }) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  if (user.isVerified) {
    const error = new Error('User is already verified');
    error.status = 400;
    throw error;
  }

  if (otp !== '123456') {
    const error = new Error('Invalid OTP');
    error.status = 400;
    throw error;
  }

  user.isVerified = true;
  await user.save();

  return { message: 'Email verified successfully.' };
};

const login = async ({ email, password, deviceToken }) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await user.matchPassword(password);
  
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  if (!user.isVerified) {
    const error = new Error('Please verify your email first');
    error.status = 401;
    throw error;
  }

  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  if (deviceToken) {
    user.deviceToken = deviceToken;
  }
  await user.save();

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    accessToken,
    refreshToken
  };
};

const refreshToken = async ({ token, deviceToken }) => {
  if (!token) {
    const error = new Error('Refresh token is required');
    error.status = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      const error = new Error('User not found or Invalid refresh token');
      error.status = 401;
      throw error;
    }

    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    if (deviceToken) {
      user.deviceToken = deviceToken;
    }
    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  } catch (err) {
    const error = new Error('Not authorized, refresh token failed');
    error.status = 401;
    throw error;
  }
};

const logout = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  return { message: 'Logged out successfully! Session ended.' };
};

const socialLogin = async ({ provider, providerId, email, firstName, lastName, deviceToken }) => {
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      firstName,
      lastName,
      email,
      isVerified: true,
      socialLoginProvider: provider,
      socialLoginId: providerId,
      deviceToken: deviceToken || null
    });
  }

  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  if (deviceToken) {
    user.deviceToken = deviceToken;
  }
  await user.save();

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    accessToken,
    refreshToken
  };
};

const forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    return { message: 'OTP sent to email. Use 123456 to reset.' };
};

const resetPassword = async ({ email, otp, newPassword }) => {
    const user = await User.findOne({ email });
    
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    if (otp !== '123456') {
      const error = new Error('Invalid OTP');
      error.status = 400;
      throw error;
    }
    
    user.password = newPassword;
    await user.save();
    
    return { message: 'Password reset successful' };
};

module.exports = {
  signup,
  verifyEmail,
  login,
  refreshToken,
  logout,
  socialLogin,
  forgotPassword,
  resetPassword
};
