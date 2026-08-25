// Jest setup file for configuring test environment
require('dotenv').config({ path: '.env.test' });

// Mock winston logger for all tests
jest.mock('./src/helpers/logger.js', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_12345';
process.env.JWT_REFRESH_SECRET = 'test_jwt_refresh_secret_key_12345';

// Suppress console logs during tests
const originalLog = console.log;
const originalError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalLog;
  console.error = originalError;
});
