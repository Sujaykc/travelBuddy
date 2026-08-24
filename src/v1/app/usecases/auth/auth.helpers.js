const storeRefreshTokenHash = (user, refreshToken, cryptoService) => {
  user.refreshToken = cryptoService.hash(refreshToken);
};

const isStoredRefreshTokenValid = (storedValue, incomingToken, cryptoService) => {
  if (!storedValue) {
    return false;
  }

  const incomingHash = cryptoService.hash(incomingToken);
  // Backward compatibility for users with old plaintext tokens in DB.
  return storedValue === incomingHash || storedValue === incomingToken;
};

module.exports = {
  storeRefreshTokenHash,
  isStoredRefreshTokenValid
};

