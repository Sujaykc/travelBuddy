const { AppError } = require('../errors');
const { normalizeEmail } = require('../../entities/value-objects/email');

const createSignupUseCase = ({ userRepository, otpService, emailService, authConfig }) =>
  async (input) => {
    const normalizedEmail = normalizeEmail(input.email);
    const userExists = await userRepository.findByEmail(normalizedEmail);

    if (userExists) {
      if (userExists.isVerified) {
        throw new AppError('User already exists', 400, 'USER_EXISTS');
      }

      // User exists but is not verified - Resend OTP and update info
      const otp = otpService.createOtp();
      userExists.firstName = input.firstName;
      userExists.lastName = input.lastName;
      userExists.password = input.password;
      userExists.emailOtpCode = otp.otp;
      userExists.emailOtpExpiresAt = otp.expiresAt;

      const updatedUser = await userRepository.save(userExists);

      const emailResult = await emailService.sendEmailVerificationOtp({
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        otp: otp.otp,
        ttlMinutes: authConfig.otpTtlMinutes
      });

      if (emailResult.success === false) {
        return {
          message: 'User registered but we could not send the verification email. Please try resending OTP later.',
          email: updatedUser.email
        };
      }

      return {
        message: 'We sent OTP to your email please verify',
        email: updatedUser.email
      };
    }

    const otp = otpService.createOtp();
    const user = await userRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: normalizedEmail,
      password: input.password,
      isVerified: false,
      emailOtpCode: otp.otp,
      emailOtpExpiresAt: otp.expiresAt
    });

    const emailResult = await emailService.sendEmailVerificationOtp({
      email: user.email,
      firstName: user.firstName,
      otp: otp.otp,
      ttlMinutes: authConfig.otpTtlMinutes
    });

    if (emailResult.success === false) {
      return {
        message: 'User registered but we could not send the verification email. Please try resending OTP later.',
        email: user.email
      };
    }

    return {
      message: 'We sent OTP to your email please verify',
      email: user.email
    };
  };

module.exports = createSignupUseCase;

