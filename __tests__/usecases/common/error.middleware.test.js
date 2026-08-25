const { notFound, errorHandler } = require('../../../src/middlewares/error.middleware.js');

describe('Error Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      originalUrl: '/api/auth/login'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      statusCode: 200
    };
    next = jest.fn();
  });

  describe('notFound middleware', () => {
    it('should create 404 error for non-existent routes', () => {
      notFound(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain('Not Found');
      expect(error.message).toContain(req.originalUrl);
    });

    it('should include the original URL in error message', () => {
      req.originalUrl = '/api/users/profile';
      notFound(req, res, next);

      const error = next.mock.calls[0][0];
      expect(error.message).toContain('/api/users/profile');
    });

    it('should call next() with error', () => {
      notFound(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should set status code to 404', () => {
      notFound(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('errorHandler middleware', () => {
    it('should return 500 status code if statusCode is 200', () => {
      const error = new Error('Database connection failed');
      res.statusCode = 200;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return correct status code if already set', () => {
      const error = new Error('User not found');
      res.statusCode = 404;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return error message in response', () => {
      const error = new Error('Invalid credentials');
      res.statusCode = 401;

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
        stack: expect.any(String)
      });
    });

    it('should include stack trace in development mode', () => {
      const error = new Error('Test error');
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      res.statusCode = 400;

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Test error',
        stack: expect.any(String)
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production mode', () => {
      const error = new Error('Test error');
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      res.statusCode = 400;

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Test error',
        stack: null
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should call res.status() before sending response', () => {
      const error = new Error('Server error');
      res.statusCode = 500;

      errorHandler(error, req, res, next);

      // Verify both status and json are called
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle errors without message property', () => {
      const error = { statusCode: 400 };
      res.statusCode = 400;

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalled();
    });

    it('should handle default status codes for all HTTP error codes', () => {
      const testCases = [
        { statusCode: 400, expectedStatus: 400 },
        { statusCode: 401, expectedStatus: 401 },
        { statusCode: 403, expectedStatus: 403 },
        { statusCode: 404, expectedStatus: 404 },
        { statusCode: 500, expectedStatus: 500 }
      ];

      testCases.forEach(({ statusCode, expectedStatus }) => {
        jest.clearAllMocks();
        res.statusCode = statusCode;

        errorHandler(new Error('Test'), req, res, next);

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });
    });

    it('should be callable with all four parameters (error handler signature)', () => {
      const error = new Error('Test error');
      res.statusCode = 500;

      // Should not throw
      expect(() => {
        errorHandler(error, req, res, next);
      }).not.toThrow();
    });
  });
});
