const authController = require('../../../src/v1/app/controllers/auth/auth.controller.js');
const { authUseCases } = require('../../../src/app');
const authService = authUseCases;

jest.mock('../../../src/app', () => ({
  authUseCases: {
    signup: jest.fn(),
    verifyEmail: jest.fn(),
    resendOtp: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    socialLogin: jest.fn()
  }
}));

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      user: {
        _id: '507f1f77bcf86cd799439011'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      statusCode: 200
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should return 201 status code on successful signup', async () => {
      const mockResult = {
        message: 'User registered successfully',
        email: 'test@example.com'
      };
      authService.signup.mockResolvedValue(mockResult);

      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123'
      };

      await authController.signup(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should pass request body to service', async () => {
      authService.signup.mockResolvedValue({});

      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123'
      };
      req.body = userData;

      await authController.signup(req, res, next);

      expect(authService.signup).toHaveBeenCalledWith(userData);
    });

    it('should handle errors with status code', async () => {
      const error = new Error('User already exists');
      error.status = 400;
      authService.signup.mockRejectedValue(error);

      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123'
      };

      await authController.signup(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should pass error to next middleware', async () => {
      const error = new Error('Server error');
      authService.signup.mockRejectedValue(error);

      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123'
      };

      await authController.signup(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email and return 200 status', async () => {
      const mockResult = { message: 'Email verified successfully' };
      authService.verifyEmail.mockResolvedValue(mockResult);

      req.body = {
        email: 'test@example.com',
        otp: '123456'
      };

      await authController.verifyEmail(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should pass email and OTP to service', async () => {
      authService.verifyEmail.mockResolvedValue({});

      const data = {
        email: 'test@example.com',
        otp: '123456'
      };
      req.body = data;

      await authController.verifyEmail(req, res, next);

      expect(authService.verifyEmail).toHaveBeenCalledWith(data);
    });

    it('should handle validation errors', async () => {
      const error = new Error('Invalid OTP');
      error.status = 400;
      authService.verifyEmail.mockRejectedValue(error);

      req.body = {
        email: 'test@example.com',
        otp: '000000'
      };

      await authController.verifyEmail(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should return user data and tokens on successful login', async () => {
      const mockResult = {
        user: {
          _id: '507f1f77bcf86cd799439011',
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com'
        },
        tokens: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token'
        }
      };
      authService.login.mockResolvedValue(mockResult);

      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      await authController.login(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        _id: '507f1f77bcf86cd799439011',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        accessToken: 'access_token',
        refreshToken: 'refresh_token'
      });
    });

    it('should not set 201 status (default 200)', async () => {
      authService.login.mockResolvedValue({
        user: {
          _id: '507f1f77bcf86cd799439011',
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com'
        },
        tokens: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token'
        }
      });

      await authController.login(req, res, next);

      expect(res.status).not.toHaveBeenCalledWith(201);
    });

    it('should handle invalid credentials error', async () => {
      const error = new Error('Invalid email or password');
      error.status = 401;
      authService.login.mockRejectedValue(error);

      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should pass deviceToken if provided', async () => {
      authService.login.mockResolvedValue({
        user: {
          _id: '507f1f77bcf86cd799439011',
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com'
        },
        tokens: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token'
        }
      });

      const data = {
        email: 'test@example.com',
        password: 'password123',
        deviceToken: 'device_token'
      };
      req.body = data;

      await authController.login(req, res, next);

      expect(authService.login).toHaveBeenCalledWith(data);
    });
  });

  describe('logout', () => {
    it('should logout user and return 200 status', async () => {
      const mockResult = { message: 'Logged out successfully' };
      authService.logout.mockResolvedValue(mockResult);

      await authController.logout(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should pass user ID to service', async () => {
      authService.logout.mockResolvedValue({});

      const userId = '507f1f77bcf86cd799439011';
      req.user._id = userId;

      await authController.logout(req, res, next);

      expect(authService.logout).toHaveBeenCalledWith({ userId });
    });

    it('should handle logout errors', async () => {
      const error = new Error('Logout failed');
      authService.logout.mockRejectedValue(error);

      await authController.logout(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should require authenticated user', async () => {
      authService.logout.mockResolvedValue({});
      req.user = undefined;

      // This should ideally be prevented by auth middleware,
      // but controller should handle it gracefully
      await authController.logout(req, res, next);

      // Depending on implementation, it may throw or call next with error
      expect(next).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens', async () => {
      const mockResult = {
        tokens: {
          accessToken: 'new_access_token',
          refreshToken: 'new_refresh_token'
        }
      };
      authService.refreshToken.mockResolvedValue(mockResult);

      req.body = {
        token: 'old_refresh_token'
      };

      await authController.refreshToken(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token'
      });
    });

    it('should pass token to service', async () => {
      authService.refreshToken.mockResolvedValue({
        tokens: {
          accessToken: 'new_access_token',
          refreshToken: 'new_refresh_token'
        }
      });

      const data = {
        token: 'refresh_token'
      };
      req.body = data;

      await authController.refreshToken(req, res, next);

      expect(authService.refreshToken).toHaveBeenCalledWith(data);
    });

    it('should handle invalid refresh token error', async () => {
      const error = new Error('Invalid refresh token');
      error.status = 401;
      authService.refreshToken.mockRejectedValue(error);

      req.body = {
        token: 'invalid_token'
      };

      await authController.refreshToken(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('resendOtp', () => {
    it('should resend OTP and return 200 status', async () => {
      authService.resendOtp.mockResolvedValue({ message: 'If the email exists, a verification OTP has been sent.' });

      req.body = {
        email: 'test@example.com'
      };

      await authController.resendOtp(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('should call resendOtp service with email', async () => {
      authService.resendOtp.mockResolvedValue({});

      req.body = {
        email: 'test@example.com'
      };

      await authController.resendOtp(req, res, next);

      expect(authService.resendOtp).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should return service response without hardcoded OTP leakage', async () => {
      authService.resendOtp.mockResolvedValue({
        message: 'If the email exists, a verification OTP has been sent.'
      });

      req.body = {
        email: 'test@example.com'
      };

      await authController.resendOtp(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        message: 'If the email exists, a verification OTP has been sent.'
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Failed to resend OTP');
      error.status = 500;
      authService.resendOtp.mockRejectedValue(error);

      req.body = {
        email: 'nonexistent@example.com'
      };

      await authController.resendOtp(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('forgotPassword', () => {
    it('should handle forgot password request', async () => {
      const mockResult = { message: 'OTP sent to email' };
      authService.forgotPassword.mockResolvedValue(mockResult);

      req.body = {
        email: 'test@example.com'
      };

      await authController.forgotPassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should pass email to service', async () => {
      authService.forgotPassword.mockResolvedValue({});

      req.body = {
        email: 'test@example.com'
      };

      await authController.forgotPassword(req, res, next);

      expect(authService.forgotPassword).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should handle user not found error', async () => {
      const error = new Error('User not found');
      error.status = 404;
      authService.forgotPassword.mockRejectedValue(error);

      req.body = {
        email: 'nonexistent@example.com'
      };

      await authController.forgotPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('resetPassword', () => {
    it('should reset password and return 200 status', async () => {
      const mockResult = { message: 'Password reset successfully' };
      authService.resetPassword.mockResolvedValue(mockResult);

      req.body = {
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'newpassword123'
      };

      await authController.resetPassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should pass all data to service', async () => {
      authService.resetPassword.mockResolvedValue({});

      const data = {
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'newpassword123'
      };
      req.body = data;

      await authController.resetPassword(req, res, next);

      expect(authService.resetPassword).toHaveBeenCalledWith(data);
    });

    it('should handle invalid OTP error', async () => {
      const error = new Error('Invalid OTP');
      error.status = 400;
      authService.resetPassword.mockRejectedValue(error);

      req.body = {
        email: 'test@example.com',
        otp: '000000',
        newPassword: 'newpassword123'
      };

      await authController.resetPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('socialLogin', () => {
    it('should handle social login and return tokens', async () => {
      const mockResult = {
        user: {
          _id: '507f1f77bcf86cd799439011',
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com'
        },
        tokens: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token'
        }
      };
      authService.socialLogin.mockResolvedValue(mockResult);

      req.body = {
        provider: 'google',
        idToken: 'google_id_token',
        providerId: 'google_123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      };

      await authController.socialLogin(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        _id: '507f1f77bcf86cd799439011',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        accessToken: 'access_token',
        refreshToken: 'refresh_token'
      });
    });

    it('should pass all social login data to service', async () => {
      authService.socialLogin.mockResolvedValue({
        user: {
          _id: '507f1f77bcf86cd799439011',
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com'
        },
        tokens: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token'
        }
      });

      const data = {
        provider: 'google',
        idToken: 'google_id_token',
        providerId: 'google_123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        deviceToken: 'device_token'
      };
      req.body = data;

      await authController.socialLogin(req, res, next);

      expect(authService.socialLogin).toHaveBeenCalledWith(data);
    });

    it('should handle social login errors', async () => {
      const error = new Error('Social login failed');
      error.status = 400;
      authService.socialLogin.mockRejectedValue(error);

      req.body = {
        provider: 'google',
        idToken: 'google_id_token',
        providerId: 'google_123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      };

      await authController.socialLogin(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
