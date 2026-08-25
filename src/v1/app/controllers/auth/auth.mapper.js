const UserEntity = require('../../entities/user.entity');

const toAuthResponse = (userDoc, tokens) => {
  const user = UserEntity.fromPersistence(userDoc);

  return {
    _id: user ? user.id : null,
    firstName: user ? user.firstName : '',
    lastName: user ? user.lastName : '',
    email: user ? user.email : '',
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  };
};

const toRefreshTokenResponse = (tokens) => ({
  accessToken: tokens.accessToken,
  refreshToken: tokens.refreshToken
});

module.exports = {
  toAuthResponse,
  toRefreshTokenResponse
};
