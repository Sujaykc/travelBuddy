const { AppError } = require('../errors');
const { storeRefreshTokenHash, isStoredRefreshTokenValid } = require('./auth.helpers');

const createRefreshTokenUseCase = ({ userRepository, tokenService, cryptoService }) =>
  async (input) => {
    if (!input.token) {
      throw new AppError('Refresh token is required', 401, 'REFRESH_TOKEN_REQUIRED');
    }

    let decoded;
    try {
      decoded = tokenService.verifyRefreshToken(input.token);
    } catch (error) {
      throw new AppError('Not authorized, refresh token failed', 401, 'REFRESH_TOKEN_INVALID');
    }

    const user = await userRepository.findById(decoded.id);
    if (!user || !isStoredRefreshTokenValid(user.refreshToken, input.token, cryptoService)) {
      throw new AppError('User not found or invalid refresh token', 401, 'REFRESH_TOKEN_INVALID');
    }

    const accessToken = tokenService.createAccessToken(user.id);
    const refreshToken = tokenService.createRefreshToken(user.id);

    storeRefreshTokenHash(user, refreshToken, cryptoService);
    if (input.deviceToken) {
      user.deviceToken = input.deviceToken;
    }
    await userRepository.save(user);

    return {
      tokens: {
        accessToken,
        refreshToken
      }
    };
  };

module.exports = createRefreshTokenUseCase;

