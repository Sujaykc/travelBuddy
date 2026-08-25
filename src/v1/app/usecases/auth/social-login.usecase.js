const { AppError } = require('../errors');
const { storeRefreshTokenHash } = require('./auth.helpers');

const createSocialLoginUseCase = ({
  userRepository,
  tokenService,
  socialIdentityService,
  cryptoService
}) => async (input) => {
  const identity = await socialIdentityService.verify(input.provider, input.idToken);
  let user = await userRepository.findBySocialLogin(input.provider, identity.providerId);

  if (!user && identity.email) {
    user = await userRepository.findByEmail(identity.email);
  }

  if (!user) {
    if (!identity.email) {
      throw new AppError(
        'Unable to determine account email from provider token',
        400,
        'SOCIAL_EMAIL_REQUIRED'
      );
    }

    user = await userRepository.create({
      firstName: input.firstName || identity.firstName || 'User',
      lastName: input.lastName || identity.lastName || 'Account',
      email: identity.email,
      isVerified: true,
      socialLoginProvider: input.provider,
      socialLoginId: identity.providerId,
      deviceToken: input.deviceToken || null
    });
  } else {
    user.isVerified = true;
    user.socialLoginProvider = input.provider;
    user.socialLoginId = identity.providerId;
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

module.exports = createSocialLoginUseCase;

