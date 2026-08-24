const { normalizeEmail } = require('../../entities/value-objects/email');

const createForgotPasswordUseCase = ({ userRepository, otpService, emailService, authConfig }) =>
  async (input) => {
    const normalizedEmail = normalizeEmail(input.email);
    const user = await userRepository.findByEmail(normalizedEmail);

    const response = {
      message: 'If the email exists, a password reset OTP has been sent.'
    };

    if (!user) {
      return response;
    }

    const otp = otpService.createOtp();
    user.passwordResetOtpCode = otp.otp;
    user.passwordResetOtpExpiresAt = otp.expiresAt;
    await userRepository.save(user);

    try {
      await emailService.sendPasswordResetOtp({
        email: user.email,
        firstName: user.firstName,
        otp: otp.otp,
        ttlMinutes: authConfig.otpTtlMinutes
      });
    } catch (error) {
      // Keep anti-enumeration behavior and generic response.
    }

    return response;
  };

module.exports = createForgotPasswordUseCase;

