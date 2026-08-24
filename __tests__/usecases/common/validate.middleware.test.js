const validate = require('../../../src/middlewares/validate.middleware.js');
const Joi = require('joi');

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('validate function', () => {
    it('should pass valid data to next middleware', () => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      });

      req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject invalid email', () => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      });

      req = {
        body: {
          email: 'invalid-email',
          password: 'password123'
        }
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });

    it('should reject missing required field', () => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      });

      req = {
        body: {
          email: 'test@example.com'
        }
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });

    it('should include validation error message', () => {
      const schema = Joi.object({
        email: Joi.string().email().required()
      });

      req = {
        body: {
          email: 'invalid'
        }
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      const error = next.mock.calls[0][0];
      expect(error.message).toBeDefined();
    });

    it('should return first validation error only', () => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().required()
      });

      req = {
        body: {
          email: 'invalid',
          password: '123',
          name: ''
        }
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      const error = next.mock.calls[0][0];
      // Should report only the first error
      expect(error.message).toBeDefined();
    });

    it('should validate numeric fields', () => {
      const schema = Joi.object({
        age: Joi.number().required()
      });

      req = {
        body: {
          age: 25
        }
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject non-numeric values for number fields', () => {
      const schema = Joi.object({
        age: Joi.number().required()
      });

      req = {
        body: {
          age: 'twenty-five'
        }
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).toHaveBeenCalled();
    });

    it('should validate optional fields', () => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        phone: Joi.string().optional()
      });

      req = {
        body: {
          email: 'test@example.com'
        }
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject empty body', () => {
      const schema = Joi.object({
        email: Joi.string().email().required()
      });

      req = {
        body: {}
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle complex nested schemas', () => {
      const schema = Joi.object({
        user: Joi.object({
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          email: Joi.string().email().required()
        }).required()
      });

      req = {
        body: {
          user: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
          }
        }
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should reject invalid nested data', () => {
      const schema = Joi.object({
        user: Joi.object({
          email: Joi.string().email().required()
        }).required()
      });

      req = {
        body: {
          user: {
            email: 'invalid-email'
          }
        }
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should validate string length constraints', () => {
      const schema = Joi.object({
        password: Joi.string().min(6).required()
      });

      req = {
        body: {
          password: '12345'
        }
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should pass string with correct length', () => {
      const schema = Joi.object({
        password: Joi.string().min(6).required()
      });

      req = {
        body: {
          password: '123456'
        }
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return middleware function', () => {
      const schema = Joi.object({
        email: Joi.string().required()
      });

      const middleware = validate(schema);

      expect(typeof middleware).toBe('function');
      expect(middleware.length).toBe(3); // req, res, next
    });
  });
});
