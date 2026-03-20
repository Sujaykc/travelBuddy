const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { generateToken, generateRefreshToken } = require('../utils');
const bcrypt = require('bcrypt');

const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
const hashedPassword = bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isVerified: false
    });

    if (user) {
      res.status(201).json({
        message: 'User registered successfully. Please verify your email with OTP 123456.',
        email: user.email
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error('User is already verified');
    }

    if (otp !== '123456') {
      res.status(400);
      throw new Error('Invalid OTP');
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    next(error);
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    if (user.isVerified) {
       res.status(400);
       throw new Error('User is already verified');
    }

    res.status(200).json({ message: 'OTP recent successfully. Use 123456.' });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, deviceToken } = req.body;

    const user = await User.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (user && isPasswordValid) {
      if (!user.isVerified) {
        res.status(401);
        throw new Error('Please verify your email first');
      }

      const newAccessToken = generateToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);

      user.refreshToken = newRefreshToken;
      if (deviceToken) {
        user.deviceToken = deviceToken;
      }
      await user.save();

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { token, deviceToken } = req.body;
    if (!token) {
        res.status(401);
        throw new Error('Refresh token is required');
    }
    
    // Verify the refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    
    // Check if the user still exists and if the token is valid in DB
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      res.status(401);
      throw new Error('User not found or Invalid refresh token');
    }

    // Generate new tokens
    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    if (deviceToken) {
      user.deviceToken = deviceToken;
    }
    await user.save();

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(401);
    next(new Error('Not authorized, refresh token failed'));
  }
};

const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.status(200).json({ message: 'Logged out successfully! Session ended.' });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200).json({ message: 'OTP sent to email. Use 123456 to reset.' });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    if (otp !== '123456') {
      res.status(400);
      throw new Error('Invalid OTP');
    }
    
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

const socialLogin = async (req, res, next) => {
  try {
    const { provider, providerId, email, firstName, lastName, deviceToken } = req.body;
    
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
    
    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    if (deviceToken) {
      user.deviceToken = deviceToken;
    }
    await user.save();

    res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    });
  } catch (error) {
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
