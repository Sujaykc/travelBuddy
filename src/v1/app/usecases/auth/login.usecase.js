const { AppError } = require('../errors');
const { normalizeEmail } = require('../../entities/value-objects/email');
const { storeRefreshTokenHash } = require('./auth.helpers');

const createLoginUseCase = ({ userRepository, tokenService, cryptoService }) =>
  async (input) => {
    const normalizedEmail = normalizeEmail(input.email);
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await userRepository.isPasswordValid(user, input.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.isVerified) {
      throw new AppError('Please verify your email first', 401, 'EMAIL_NOT_VERIFIED');
    }

    const accessToken = tokenService.createAccessToken(user.id);
    const refreshToken = tokenService.createRefreshToken(user.id);

    storeRefreshTokenHash(user, refreshToken, cryptoService);
    if (input.deviceToken) {
      user.deviceToken = input.deviceToken;
    }
    await userRepository.save(user);

    return {
      user,
      tokens: {
        accessToken,
        refreshToken
      }
    };
  };

module.exports = createLoginUseCase;

