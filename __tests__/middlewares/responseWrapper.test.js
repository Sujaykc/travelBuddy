const responseWrapper = require('../../src/middlewares/responseWrapper');

describe('Response Wrapper Middleware', () => {
  let req, res, next;
  let originalJson;

  beforeEach(() => {
    req = {};
    originalJson = jest.fn();
    res = {
      statusCode: 200,
      json: originalJson,
      status: function(code) {
        this.statusCode = code;
        return this;
      }
    };
    next = jest.fn();
    
    // Apply the wrapper
    responseWrapper(req, res, next);
  });

  it('should wrap success responses correctly', () => {
    const body = {
      message: 'Success message',
      data: { id: 1 }
    };
    
    res.status(200).json(body);
    
    expect(originalJson).toHaveBeenCalledWith({
      success: true,
      message: 'Success message',
      data: { id: 1 }
    });
  });

  it('should remove redundant message from success data', () => {
    const body = {
      message: 'Success message',
      id: 1
    };
    
    res.status(200).json(body);
    
    expect(originalJson).toHaveBeenCalledWith({
      success: true,
      message: 'Success message',
      data: { id: 1 }
    });
  });

  it('should set data to null if only message was present in success body', () => {
    const body = {
      message: 'Success message'
    };
    
    res.status(200).json(body);
    
    expect(originalJson).toHaveBeenCalledWith({
      success: true,
      message: 'Success message',
      data: null
    });
  });

  it('should show only success and message for error responses', () => {
    const body = {
      message: 'Error message',
      code: 'ERR_CODE',
      details: { field: 'invalid' },
      stack: 'some stack'
    };
    
    res.status(400).json(body);
    
    expect(originalJson).toHaveBeenCalledWith({
      success: false,
      message: 'Error message'
    });
  });

  it('should NOT include data, code, or stack in error response in any environment', () => {
    const environments = ['development', 'production', 'test'];
    const originalEnv = process.env.NODE_ENV;
    
    environments.forEach(env => {
      process.env.NODE_ENV = env;
      jest.clearAllMocks();
      
      const body = {
        message: 'Error',
        stack: 'stack trace',
        code: 'SOME_CODE',
        details: { something: 'here' }
      };
      
      res.status(500).json(body);
      
      const callBody = originalJson.mock.calls[0][0];
      expect(callBody.success).toBe(false);
      expect(callBody.message).toBe('Error');
      expect(callBody.data).toBeUndefined();
      expect(callBody.code).toBeUndefined();
      expect(callBody.stack).toBeUndefined();
      expect(callBody.details).toBeUndefined();
    });
    
    process.env.NODE_ENV = originalEnv;
  });
});
