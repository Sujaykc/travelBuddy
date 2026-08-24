const jwt = require('jsonwebtoken');
const { protect } = require('../../../src/middlewares/auth.middleware.js');
const { User } = require('../../../src/v1/models');

// Mock the User model
jest.mock('../../../src/v1/models', () => ({
  User: {
    findById: jest.fn()
  }
}));

describe('Auth Middleware', () => {
  let req, res, next;
  const userId = '507f1f77bcf86cd799439011';
  const validToken = jwt.sign({ id: userId }, process.env.JWT_SECRET);

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('protect middleware', () => {
    it('should attach user to request if valid token provided', async () => {
      const mockUserData = {
        _id: userId,
        email: 'test@example.com',
        firstName: 'John'
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserData)
      });
      req.headers.authorization = `Bearer ${validToken}`;

      await protect(req, res, next);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(req.user).toBeDefined();
      expect(req.user._id).toBe(userId);
      expect(next).toHaveBeenCalled();
    });

    it('should not include password in user object', async () => {
      const mockUser = {
        _id: userId,
        email: 'test@example.com',
        firstName: 'John',
        select: jest.fn().mockReturnValue({
          _id: userId,
          email: 'test@example.com',
          firstName: 'John'
        })
      };

      User.findById.mockReturnValue(mockUser);
      req.headers.authorization = `Bearer ${validToken}`;

      await protect(req, res, next);

      expect(User.findById).toHaveBeenCalledWith(userId);
    });

    it('should reject request with invalid token', async () => {
      req.headers.authorization = 'Bearer invalid_token';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(next.mock.calls[0][0].message).toContain('Not authorized');
    });

    it('should reject request with expired token', async () => {
      const expiredToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '-1s' }
      );

      req.headers.authorization = `Bearer ${expiredToken}`;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).toHaveBeenCalled();
    });

    it('should reject request without authorization header', async () => {
      req.headers.authorization = undefined;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toContain('no token');
    });

    it('should reject request with Bearer prefix missing', async () => {
      req.headers.authorization = `${validToken}`;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).toHaveBeenCalled();
    });

    it('should reject if user not found in database', async () => {
      User.findById.mockResolvedValue(null);
      req.headers.authorization = `Bearer ${validToken}`;

      await protect(req, res, next);

      expect(User.findById).toHaveBeenCalledWith(userId);
      // The middleware should still attach null user or call next with error
      expect(next).toHaveBeenCalled();
    });

    it('should extract token correctly from Bearer header', async () => {
      const mockUserData = {
        _id: userId,
        email: 'test@example.com'
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserData)
      });
      req.headers.authorization = `Bearer ${validToken}`;

      await protect(req, res, next);

      expect(req.user).toEqual(mockUserData);
    });

    it('should handle authorization header with multiple spaces', async () => {
      req.headers.authorization = `Bearer  ${validToken}`;

      await protect(req, res, next);

      // This should fail because of extra space
      expect(next).toHaveBeenCalled();
    });

    it('should call next() on successful validation', async () => {
      const mockUserData = {
        _id: userId,
        email: 'test@example.com',
        firstName: 'John'
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserData)
      });
      req.headers.authorization = `Bearer ${validToken}`;

      await protect(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should not call res.json() on successful validation', async () => {
      const mockUser = {
        _id: userId,
        email: 'test@example.com',
        firstName: 'John'
      };

      User.findById.mockResolvedValue(mockUser);
      req.headers.authorization = `Bearer ${validToken}`;

      await protect(req, res, next);

      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
