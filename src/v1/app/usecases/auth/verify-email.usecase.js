const { AppError } = require('../errors');
const { normalizeEmail } = require('../../entities/value-objects/email');

const createVerifyEmailUseCase = ({ userRepository, otpService }) =>
  async (input) => {
    const normalizedEmail = normalizeEmail(input.email);
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    if (user.isVerified) {
      throw new AppError('User is already verified', 400, 'USER_ALREADY_VERIFIED');
    }

    if (!otpService.isValid(input.otp, user.emailOtpCode, user.emailOtpExpiresAt)) {
      throw new AppError('Invalid or expired OTP', 400, 'INVALID_OTP');
    }

    user.isVerified = true;
    user.emailOtpCode = null;
    user.emailOtpExpiresAt = null;
    await userRepository.save(user);

    return { message: 'Email verified successfully.' };
  };

module.exports = createVerifyEmailUseCase;

