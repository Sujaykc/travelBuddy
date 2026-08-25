const {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  socialLoginSchema
} = require('../../../src/v1/app/controllers/auth/auth.validator.js');

describe('Auth Validations', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePassword123'
      };

      const { error } = registerSchema.validate(data);
      expect(error).toBeUndefined();
    });

    it('should fail without firstName', () => {
      const data = {
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePassword123'
      };

      const { error } = registerSchema.validate(data);
      expect(error).toBeDefined();
      expect(error.message).toContain('firstName');
    });

    it('should fail without lastName', () => {
      const data = {
        firstName: 'John',
        email: 'john@example.com',
        password: 'SecurePassword123'
      };

      const { error } = registerSchema.validate(data);
      expect(error).toBeDefined();
      expect(error.message).toContain('lastName');
    });

    it('should fail with invalid email', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'SecurePassword123'
      };

      const { error } = registerSchema.validate(data);
      expect(error).toBeDefined();
      expect(error.message).toContain('email');
    });

    it('should fail with password less than 6 characters', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '12345'
      };

      const { error } = registerSchema.validate(data);
      expect(error).toBeDefined();
      expect(error.message).toContain('password');
    });

    it('should accept exactly 6 character password', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123456'
      };

      const { error } = registerSchema.validate(data);
      expect(error).toBeUndefined();
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const data = {
        email: 'john@example.com',
        password: 'SecurePassword123'
      };

      const { error } = loginSchema.validate(data);
      expect(error).toBeUndefined();
    });

    it('should validate login data with deviceToken', () => {
      const data = {
        email: 'john@example.com',
        password: 'SecurePassword123',
        deviceToken: 'device_token_abc123'
      };

      const { error } = loginSchema.validate(data);
      expect(error).toBeUndefined();
    });

    it('should fail without email', () => {
      const data = {
        password: 'SecurePassword123'
      };

      const { error } = loginSchema.validate(data);
      expect(error).toBeDefined();
      expect(error.message).toContain('email');
    });

    it('should fail with invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'SecurePassword123'
      };

      const { error } = loginSchema.validate(data);
      expect(error).toBeDefined();
    });

    it('should fail without password', () => {
      const data = {
        email: 'john@example.com'
      };

      const { error } = loginSchema.validate(data);
      expect(error).toBeDefined();
      expect(error.message).toContain('password');
    });
  });

  describe('verifyEmailSchema', () => {
    it('should validate correct verify email data', () => {
      const data = {
        email: 'john@example.com',
        otp: '123456'
      };

      const { error } = verifyEmailSchema.validate(data);
      expect(error).toBeUndefined();
    });

    it('should fail without email', () => {
      const data = {
        otp: '123456'
      };

      const { error } = verifyEmailSchema.validate(data);
      expect(error).toBeDefined();
    });

    it('should fail with invalid email', () => {
      const data = {
        email: 'invalid-email',
        otp: '123456'
      };

      const { error } = verifyEmailSchema.validate(data);
      expect(error).toBeDefined();
    });

    it('should fail without OTP', () => {
      const data = {
        email: 'john@example.com'
      };

      const { error } = verifyEmailSchema.validate(data);
      expect(error).toBeDefined();
    });

    it('should fail with OTP not exactly 6 characters', () => {
      const data = {
        email: 'john@example.com',
        otp: '12345'
      };

      const { error } = verifyEmailSchema.validate(data);
      expect(error).toBeDefined();
    });

    it('should fail with OTP longer than 6 characters', () => {
      const data = {
        email: 'john@example.com',
        otp: '1234567'
      };

      const { error } = verifyEmailSchema.validate(data);
      expect(error).toBeDefined();
    });
  });

  describe('resendOtpSchema', () => {
    it('should validate correct resend OTP data', () => {
      const data = {
        email: 'john@example.com'
      };

      const { error } = resendOtpSchema.validate(data);
      expect(error).toBeUndefined();
    });

    it('should fail without email', () => {
      const data = {};

      const { error } = resendOtpSchema.validate(data);
      expect(error).toBeDefined();
    });

    it('should fail with invalid email', () => {
      const data = {
        email: 'invalid-email'
      };

      const { error } = resendOtpSchema.validate(data);
      expect(error).toBeDefined();
    });
  });

  describe('forgotPasswordSchema', () => {
    it('should validate correct forgot password data', () => {
      const data = {
        email: 'john@example.com'
      };

      const { error } = forgotPasswordSchema.validate(data);
      expect(error).toBeUndefined();
    });

    it('should fail without email', () => {
      const data = {};

      const { error } = forgotPasswordSchema.validate(data);
      expect(error).toBeDefined();
    });

    it('should fail with invalid email', () => {
      const data = {
        email: 'invalid-email'
      };

      const { error } = forgotPasswordSchema.validate(data);
      expect(error).toBeDefined();
    });
  });

  describe('resetPasswordSchema', () => {
    it('should validate correct reset password data', () => {
      const data = {
        email: 'john@example.com',
        otp: '123456',
        newPassword: 'NewPassword123'
      };

      const { error } = resetPasswordSchema.validate(data);
      expect(error).toBeUndefined();
    });

    it('should fail without email', () => {
      const data = {
        otp: '123456',
        newPassword: 'NewPassword123'
      };

      const { error } = resetPasswordSchema.validate(data);
      expect(error).toBeDefined();
    });

    it('should fail without OTP', () => {
      const data = {
        email: 'john@example.com',
        newPassword: 'NewPassword123'
      };

      const { error } = resetPasswordSchema.validate(data);
      expect(error).toBeDefined();
    });

    it('should fail without newPassword', () => {
      const data = {
        email: 'john@example.com',
        otp: '123456'
      };

      const { error } = resetPasswordSchema.validate(data);
      expect(error).toBeDefined();
    });

    it('should fail with newPassword less than 6 characters', () => {
      const data = {
        email: 'john@example.com',
        otp: '123456',
        newPassword: '12345'
      };

      const { error } = resetPasswordSchema.validate(data);
      expect(error).toBeDefined();
    });

    it('should fail with invalid OTP length', () => {
      const data = {
        email: 'john@example.com',
        otp: '12345',
        newPassword: 'NewPassword123'
      };

      const { error } = resetPasswordSchema.validate(data);
      expect(error).toBeDefined();
    });
  });

  describe('socialLoginSchema', () => {
    it('should validate correct social login data', () => {
      const data = {
        provider: 'google',
        idToken: 'google_id_token_mock'
      };

      const { error } = socialLoginSchema.validate(data);
      expect(error).toBeUndefined();
    });

    it('should validate social login with deviceToken', () => {
      const data = {
        provider: 'apple',
        idToken: 'apple_id_token_mock',
        deviceToken: 'device_token_xyz'
      };

      const { error } = socialLoginSchema.validate(data);
      expect(error).toBeUndefined();
    });

    it('should fail without provider', () => {
      const data = {
        idToken: 'google_id_token_mock'
      };

      const { error } = socialLoginSchema.validate(data);
      expect(error).toBeDefined();
    });

    it('should fail with invalid provider', () => {
      const data = {
        provider: 'facebook',
        idToken: 'provider_id_token_mock'
      };

      const { error } = socialLoginSchema.validate(data);
      expect(error).toBeDefined();
    });

    it('should fail without idToken', () => {
      const data = {
        provider: 'google'
      };

      const { error } = socialLoginSchema.validate(data);
      expect(error).toBeDefined();
    });
  });
});
