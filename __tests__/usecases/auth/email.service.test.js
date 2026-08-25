jest.mock('@aws-sdk/client-sesv2', () => ({
  SESv2Client: jest.fn(),
  SendEmailCommand: jest.fn((input) => input)
}));

const getSesSdk = () => require('@aws-sdk/client-sesv2');

describe('Email Service', () => {
  const baseEnv = {
    NODE_ENV: 'test',
    EMAIL_ENABLED: 'true',
    AWS_ACCESS_KEY_ID: 'test_aws_access_key',
    AWS_SECRET_ACCESS_KEY: 'test_aws_secret_key',
    AWS_REGION: 'ap-south-1',
    SES_SENDER_EMAIL: 'no-reply@travelbuddy.test',
    SES_SENDER_NAME: 'TravelBuddy',
    EMAIL_FROM: ''
  };

  const setEnv = (overrides = {}) => {
    process.env.NODE_ENV = baseEnv.NODE_ENV;
    process.env.EMAIL_ENABLED = baseEnv.EMAIL_ENABLED;
    process.env.AWS_ACCESS_KEY_ID = baseEnv.AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = baseEnv.AWS_SECRET_ACCESS_KEY;
    process.env.AWS_REGION = baseEnv.AWS_REGION;
    process.env.SES_SENDER_EMAIL = baseEnv.SES_SENDER_EMAIL;
    process.env.SES_SENDER_NAME = baseEnv.SES_SENDER_NAME;
    process.env.EMAIL_FROM = baseEnv.EMAIL_FROM;

    Object.keys(overrides).forEach((key) => {
      process.env[key] = overrides[key];
    });
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    setEnv();
  });

  it('should send verification OTP email through AWS SES', async () => {
    const sesSdk = getSesSdk();
    const send = jest.fn().mockResolvedValue({ MessageId: 'verification-id' });
    sesSdk.SESv2Client.mockImplementation(() => ({ send }));

    const emailService = require('../../../src/v1/services/email.service.js');

    await emailService.sendEmailVerificationOtp({
      email: 'john@example.com',
      firstName: 'John',
      otp: '123456',
      ttlMinutes: 10
    });

    expect(sesSdk.SESv2Client).toHaveBeenCalledWith(
      expect.objectContaining({
        region: 'ap-south-1'
      })
    );
    expect(sesSdk.SendEmailCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        Destination: {
          ToAddresses: ['john@example.com']
        }
      })
    );
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('should send password reset OTP email through AWS SES', async () => {
    const sesSdk = getSesSdk();
    const send = jest.fn().mockResolvedValue({ MessageId: 'reset-id' });
    sesSdk.SESv2Client.mockImplementation(() => ({ send }));

    const emailService = require('../../../src/v1/services/email.service.js');

    await emailService.sendPasswordResetOtp({
      email: 'john@example.com',
      firstName: 'John',
      otp: '654321',
      ttlMinutes: 10
    });

    expect(sesSdk.SendEmailCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        Destination: {
          ToAddresses: ['john@example.com']
        }
      })
    );
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('should skip sending when EMAIL_ENABLED is false', async () => {
    const sesSdk = getSesSdk();
    setEnv({ EMAIL_ENABLED: 'false' });

    const emailService = require('../../../src/v1/services/email.service.js');
    const result = await emailService.sendEmailVerificationOtp({
      email: 'john@example.com',
      firstName: 'John',
      otp: '123456',
      ttlMinutes: 10
    });

    expect(result).toEqual({ skipped: true });
    expect(sesSdk.SESv2Client).not.toHaveBeenCalled();
  });

  it('should throw 503 when provider send fails', async () => {
    const sesSdk = getSesSdk();
    const send = jest.fn().mockRejectedValue(new Error('SES down'));
    sesSdk.SESv2Client.mockImplementation(() => ({ send }));

    const emailService = require('../../../src/v1/services/email.service.js');

    await expect(
      emailService.sendEmailVerificationOtp({
        email: 'john@example.com',
        firstName: 'John',
        otp: '123456',
        ttlMinutes: 10
      })
    ).rejects.toMatchObject({ status: 503 });
  });

  it('should throw 500 for missing SES configuration when enabled', async () => {
    setEnv({
      AWS_ACCESS_KEY_ID: '',
      AWS_SECRET_ACCESS_KEY: '',
      AWS_REGION: '',
      SES_SENDER_EMAIL: '',
      EMAIL_FROM: ''
    });

    const emailService = require('../../../src/v1/services/email.service.js');

    await expect(
      emailService.sendEmailVerificationOtp({
        email: 'john@example.com',
        firstName: 'John',
        otp: '123456',
        ttlMinutes: 10
      })
    ).rejects.toMatchObject({ status: 500 });
  });
});
