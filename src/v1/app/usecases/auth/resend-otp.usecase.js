const { normalizeEmail } = require('../../entities/value-objects/email');

const createResendOtpUseCase = ({ userRepository, otpService, emailService, authConfig }) =>
  async (input) => {
    const normalizedEmail = normalizeEmail(input.email);
    const user = await userRepository.findByEmail(normalizedEmail);

    const response = {
      message: 'If the email exists, a verification OTP has been sent.'
    };

    if (!user || user.isVerified) {
      return response;
    }

    const otp = otpService.createOtp();
    user.emailOtpCode = otp.otp;
    user.emailOtpExpiresAt = otp.expiresAt;
    await userRepository.save(user);

    try {
      await emailService.sendEmailVerificationOtp({
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

module.exports = createResendOtpUseCase;

