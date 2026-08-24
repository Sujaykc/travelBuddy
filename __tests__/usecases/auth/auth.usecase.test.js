const { createAuthUseCases } = require('../../../src/v1/app/usecases/auth');

const buildDeps = () => {
  const userRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findBySocialLogin: jest.fn(),
    isPasswordValid: jest.fn()
  };

  const otpService = {
    createOtp: jest.fn(),
    isValid: jest.fn()
  };

  const emailService = {
    sendEmailVerificationOtp: jest.fn(),
    sendPasswordResetOtp: jest.fn()
  };

  const authConfig = {
    otpTtlMinutes: 10
  };

  const tokenService = {
    createAccessToken: jest.fn(),
    createRefreshToken: jest.fn(),
    verifyRefreshToken: jest.fn()
  };

  const cryptoService = {
    hash: jest.fn()
  };

  const socialIdentityService = {
    verify: jest.fn()
  };

  return {
    userRepository,
    otpService,
    emailService,
    authConfig,
    tokenService,
    cryptoService,
    socialIdentityService
  };
};

describe('Auth use cases', () => {
  let deps;
  let useCases;

  beforeEach(() => {
    deps = buildDeps();
    useCases = createAuthUseCases(deps);
  });

  it('signup rejects when user already exists and is verified', async () => {
    deps.userRepository.findByEmail.mockResolvedValue({ id: 'existing-user', isVerified: true });

    await expect(
      useCases.signup({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      })
    ).rejects.toMatchObject({ statusCode: 400, code: 'USER_EXISTS' });
  });

  it('signup updates user and resends OTP for existing unverified user', async () => {
    const existingUser = {
      id: 'existing-user',
      email: 'john@example.com',
      isVerified: false,
      firstName: 'OldName'
    };
    deps.userRepository.findByEmail.mockResolvedValue(existingUser);
    deps.otpService.createOtp.mockReturnValue({
      otp: '123456',
      expiresAt: new Date('2030-01-01')
    });
    deps.userRepository.save.mockResolvedValue({
      ...existingUser,
      firstName: 'John',
      emailOtpCode: '123456'
    });

    deps.emailService.sendEmailVerificationOtp.mockResolvedValue({ success: true });
    const result = await useCases.signup({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'new-password'
    });

    expect(deps.userRepository.save).toHaveBeenCalled();
    expect(deps.emailService.sendEmailVerificationOtp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'john@example.com',
        otp: '123456'
      })
    );
    expect(result.message).toBe('We sent OTP to your email please verify');
  });

  it('signup creates user and sends verification OTP', async () => {
    deps.userRepository.findByEmail.mockResolvedValue(null);
    deps.otpService.createOtp.mockReturnValue({
      otp: '123456',
      hash: 'otp-hash',
      expiresAt: new Date('2030-01-01')
    });
    deps.userRepository.create.mockResolvedValue({
      id: 'new-user',
      email: 'john@example.com',
      firstName: 'John'
    });

    deps.emailService.sendEmailVerificationOtp.mockResolvedValue({ success: true });
    const result = await useCases.signup({
      firstName: 'John',
      lastName: 'Doe',
      email: 'JOHN@EXAMPLE.COM',
      password: 'password123'
    });

    expect(deps.userRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(deps.userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'john@example.com',
        emailOtpCode: '123456'
      })
    );
    expect(deps.emailService.sendEmailVerificationOtp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'john@example.com',
        otp: '123456',
        ttlMinutes: 10
      })
    );
    expect(result.message).toBe('We sent OTP to your email please verify');
  });

  it('verifyEmail rejects invalid OTP', async () => {
    deps.userRepository.findByEmail.mockResolvedValue({
      id: 'user-id',
      isVerified: false,
      emailOtpCode: 'code',
      emailOtpExpiresAt: new Date('2030-01-01')
    });
    deps.otpService.isValid.mockReturnValue(false);

    await expect(
      useCases.verifyEmail({
        email: 'john@example.com',
        otp: '000000'
      })
    ).rejects.toMatchObject({ statusCode: 400, code: 'INVALID_OTP' });
  });

  it('login rejects when email not verified', async () => {
    const user = {
      id: 'user-id',
      email: 'john@example.com',
      isVerified: false
    };
    deps.userRepository.findByEmail.mockResolvedValue(user);
    deps.userRepository.isPasswordValid.mockResolvedValue(true);

    await expect(
      useCases.login({
        email: 'john@example.com',
        password: 'password123'
      })
    ).rejects.toMatchObject({ statusCode: 401, code: 'EMAIL_NOT_VERIFIED' });
  });

  it('login returns tokens and stores refresh token hash', async () => {
    const user = {
      id: 'user-id',
      email: 'john@example.com',
      isVerified: true,
      deviceToken: null
    };
    deps.userRepository.findByEmail.mockResolvedValue(user);
    deps.userRepository.isPasswordValid.mockResolvedValue(true);
    deps.tokenService.createAccessToken.mockReturnValue('access-token');
    deps.tokenService.createRefreshToken.mockReturnValue('refresh-token');
    deps.cryptoService.hash.mockReturnValue('hashed-refresh-token');

    const result = await useCases.login({
      email: 'john@example.com',
      password: 'password123',
      deviceToken: 'device-123'
    });

    expect(result.tokens).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    });
    expect(user.refreshToken).toBe('hashed-refresh-token');
    expect(user.deviceToken).toBe('device-123');
    expect(deps.userRepository.save).toHaveBeenCalledWith(user);
  });

  it('refreshToken rejects when token is missing', async () => {
    await expect(
      useCases.refreshToken({ token: null })
    ).rejects.toMatchObject({ statusCode: 401, code: 'REFRESH_TOKEN_REQUIRED' });
  });

  it('refreshToken returns new tokens for valid refresh token', async () => {
    const user = {
      id: 'user-id',
      refreshToken: 'hashed-refresh-token',
      deviceToken: null
    };
    deps.tokenService.verifyRefreshToken.mockReturnValue({ id: 'user-id' });
    deps.userRepository.findById.mockResolvedValue(user);
    deps.cryptoService.hash.mockReturnValue('hashed-refresh-token');
    deps.tokenService.createAccessToken.mockReturnValue('new-access');
    deps.tokenService.createRefreshToken.mockReturnValue('new-refresh');

    const result = await useCases.refreshToken({ token: 'incoming-refresh' });

    expect(result.tokens).toEqual({
      accessToken: 'new-access',
      refreshToken: 'new-refresh'
    });
    expect(deps.userRepository.save).toHaveBeenCalledWith(user);
  });

  it('logout clears refresh token when user exists', async () => {
    const user = { id: 'user-id', refreshToken: 'token' };
    deps.userRepository.findById.mockResolvedValue(user);

    const result = await useCases.logout({ userId: 'user-id' });

    expect(user.refreshToken).toBeNull();
    expect(deps.userRepository.save).toHaveBeenCalledWith(user);
    expect(result.message).toContain('Logged out');
  });

  it('socialLogin creates new user when not found', async () => {
    deps.socialIdentityService.verify.mockResolvedValue({
      providerId: 'provider-123',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe'
    });
    deps.userRepository.findBySocialLogin.mockResolvedValue(null);
    deps.userRepository.findByEmail.mockResolvedValue(null);
    deps.userRepository.create.mockResolvedValue({
      id: 'user-id',
      email: 'john@example.com'
    });
    deps.tokenService.createAccessToken.mockReturnValue('access');
    deps.tokenService.createRefreshToken.mockReturnValue('refresh');
    deps.cryptoService.hash.mockReturnValue('hashed-refresh');

    const result = await useCases.socialLogin({
      provider: 'google',
      idToken: 'token',
      firstName: 'John',
      lastName: 'Doe'
    });

    expect(result.tokens).toEqual({
      accessToken: 'access',
      refreshToken: 'refresh'
    });
    expect(deps.userRepository.save).toHaveBeenCalled();
  });

  it('forgotPassword returns generic response when user missing', async () => {
    deps.userRepository.findByEmail.mockResolvedValue(null);

    const result = await useCases.forgotPassword({ email: 'missing@example.com' });

    expect(result.message).toContain('password reset OTP');
    expect(deps.emailService.sendPasswordResetOtp).not.toHaveBeenCalled();
  });

  it('resetPassword rejects invalid OTP', async () => {
    deps.userRepository.findByEmail.mockResolvedValue({
      id: 'user-id',
      passwordResetOtpCode: 'code',
      passwordResetOtpExpiresAt: new Date('2030-01-01')
    });
    deps.otpService.isValid.mockReturnValue(false);

    await expect(
      useCases.resetPassword({
        email: 'john@example.com',
        otp: '000000',
        newPassword: 'password123'
      })
    ).rejects.toMatchObject({ statusCode: 400, code: 'INVALID_OTP' });
  });
});
