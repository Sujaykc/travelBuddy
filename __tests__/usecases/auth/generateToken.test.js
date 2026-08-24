const jwt = require('jsonwebtoken');
const { generateToken, generateRefreshToken } = require('../../../src/helpers/generateToken.js');

describe('Token Generation Utilities', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_jwt_secret_key_12345';
    process.env.JWT_REFRESH_SECRET = 'test_jwt_refresh_secret_key_12345';
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should generate a token with correct payload', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(userId);
    });

    it('should generate different tokens for different users', () => {
      const token1 = generateToken('user1');
      const token2 = generateToken('user2');

      expect(token1).not.toBe(token2);
    });

    it('should include expiration (1 day)', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);
      
      const decoded = jwt.decode(token);
      const expirationTime = decoded.exp - decoded.iat;
      
      // 1 day = 86400 seconds
      expect(expirationTime).toBe(86400);
    });

    it('should be verified with JWT_SECRET', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);

      expect(() => {
        jwt.verify(token, process.env.JWT_SECRET);
      }).not.toThrow();
    });

    it('should fail verification with wrong secret', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);

      expect(() => {
        jwt.verify(token, 'wrong_secret');
      }).toThrow();
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateRefreshToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should generate a token with correct payload', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateRefreshToken(userId);
      
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      expect(decoded.id).toBe(userId);
    });

    it('should generate different tokens for different users', () => {
      const token1 = generateRefreshToken('user1');
      const token2 = generateRefreshToken('user2');

      expect(token1).not.toBe(token2);
    });

    it('should include expiration (7 days)', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateRefreshToken(userId);
      
      const decoded = jwt.decode(token);
      const expirationTime = decoded.exp - decoded.iat;
      
      // 7 days = 604800 seconds
      expect(expirationTime).toBe(604800);
    });

    it('should be verified with JWT_REFRESH_SECRET', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateRefreshToken(userId);

      expect(() => {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      }).not.toThrow();
    });

    it('should fail verification with wrong secret', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateRefreshToken(userId);

      expect(() => {
        jwt.verify(token, 'wrong_secret');
      }).toThrow();
    });
  });

  describe('Token Differences', () => {
    it('access token should use JWT_SECRET', () => {
      const userId = '507f1f77bcf86cd799439011';
      const accessToken = generateToken(userId);

      expect(() => {
        jwt.verify(accessToken, process.env.JWT_SECRET);
      }).not.toThrow();

      expect(() => {
        jwt.verify(accessToken, process.env.JWT_REFRESH_SECRET);
      }).toThrow();
    });

    it('refresh token should use JWT_REFRESH_SECRET', () => {
      const userId = '507f1f77bcf86cd799439011';
      const refreshToken = generateRefreshToken(userId);

      expect(() => {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      }).not.toThrow();

      expect(() => {
        jwt.verify(refreshToken, process.env.JWT_SECRET);
      }).toThrow();
    });

    it('access token and refresh token should be different', () => {
      const userId = '507f1f77bcf86cd799439011';
      const accessToken = generateToken(userId);
      const refreshToken = generateRefreshToken(userId);

      expect(accessToken).not.toBe(refreshToken);
    });
  });
});
