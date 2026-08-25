const { AppError } = require('../errors');
const { normalizeEmail } = require('../../entities/value-objects/email');

const createResetPasswordUseCase = ({ userRepository, otpService }) =>
  async (input) => {
    const normalizedEmail = normalizeEmail(input.email);
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user || !otpService.isValid(input.otp, user.passwordResetOtpCode, user.passwordResetOtpExpiresAt)) {
      throw new AppError('Invalid or expired OTP', 400, 'INVALID_OTP');
    }

    user.password = input.newPassword;
    user.passwordResetOtpCode = null;
    user.passwordResetOtpExpiresAt = null;
    user.refreshToken = null;
    await userRepository.save(user);

    return { message: 'Password reset successful' };
  };

module.exports = createResetPasswordUseCase;

