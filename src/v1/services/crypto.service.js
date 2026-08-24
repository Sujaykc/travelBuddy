const crypto = require('crypto');

const createCryptoService = () => ({
  hash: (value) =>
    crypto
      .createHash('sha256')
      .update(String(value))
      .digest('hex')
});

module.exports = {
  createCryptoService
};
