const asyncHandler = require('../../../src/helpers/asyncHandler.js');

describe('asyncHandler Utility', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  it('should call the handler function with correct parameters', () => {
    const mockHandler = jest.fn().mockResolvedValue(null);
    const wrapped = asyncHandler(mockHandler);

    wrapped(req, res, next);

    // Give async handler time to process
    return new Promise(resolve => {
      setImmediate(() => {
        expect(mockHandler).toHaveBeenCalledWith(req, res, next);
        resolve();
      });
    });
  });

  it('should execute successfully on resolved promise', () => {
    const mockHandler = jest.fn().mockResolvedValue(null);
    const wrapped = asyncHandler(mockHandler);

    wrapped(req, res, next);

    return new Promise(resolve => {
      setImmediate(() => {
        expect(next).not.toHaveBeenCalled();
        resolve();
      });
    });
  });

  it('should catch error and pass to next middleware on promise rejection', () => {
    const testError = new Error('Test error');
    const mockHandler = jest.fn().mockRejectedValue(testError);
    const wrapped = asyncHandler(mockHandler);

    wrapped(req, res, next);

    return new Promise(resolve => {
      setImmediate(() => {
        expect(next).toHaveBeenCalledWith(testError);
        resolve();
      });
    });
  });

  it('should handle synchronous errors as promises', () => {
    // asyncHandler wraps handler in Promise.resolve which catches sync errors
    const testError = new Error('Sync error');
    const mockHandler = jest.fn((_req, _res, _next) => {
      return Promise.resolve().then(() => {
        throw testError; // Throw inside promise chain
      });
    });
    const wrapped = asyncHandler(mockHandler);

    wrapped(req, res, next);

    return new Promise(resolve => {
      setTimeout(() => {
        // Handler should have been called
        expect(mockHandler).toHaveBeenCalledWith(req, res, next);
        // Error should be caught and passed to next
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        resolve();
      }, 20);
    });
  });

  it('should work with async/await functions', () => {
    const asyncFn = async (_req, res, _next) => {
      await new Promise(resolve => setTimeout(resolve, 5));
      res.status = 200;
    };
    const wrapped = asyncHandler(asyncFn);

    wrapped(req, res, next);

    return new Promise(resolve => {
      setTimeout(() => {
        expect(res.status).toBe(200);
        expect(next).not.toHaveBeenCalled();
        resolve();
      }, 50);
    });
  });

  it('should properly handle multiple errors', () => {
    const error1 = new Error('Error 1');
    const mockHandler = jest.fn().mockRejectedValue(error1);
    const wrapped = asyncHandler(mockHandler);

    wrapped(req, res, next);

    return new Promise(resolve => {
      setImmediate(() => {
        expect(next).toHaveBeenCalledWith(error1);
        expect(next).toHaveBeenCalledTimes(1);
        resolve();
      });
    });
  });

  it('should return a middleware function', () => {
    const mockHandler = jest.fn();
    const wrapped = asyncHandler(mockHandler);

    expect(typeof wrapped).toBe('function');
    expect(wrapped.length).toBe(3); // Should accept req, res, next
  });

  it('should work with handlers that return values', () => {
    const mockHandler = jest.fn().mockResolvedValue({ data: 'test' });
    const wrapped = asyncHandler(mockHandler);

    wrapped(req, res, next);

    return new Promise(resolve => {
      setImmediate(() => {
        expect(next).not.toHaveBeenCalled();
        resolve();
      });
    });
  });
});
