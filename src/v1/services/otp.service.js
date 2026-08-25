const crypto = require('crypto');

const createOtpService = ({ otpLength, otpTtlMs, cryptoService: _cryptoService }) => {
  const generateOtp = () => {
    let otp = '';

    for (let index = 0; index < otpLength; index += 1) {
      otp += crypto.randomInt(0, 10).toString();
    }

    return otp;
  };

  const createOtp = () => {
    const otp = generateOtp();
    return {
      otp,
      expiresAt: new Date(Date.now() + otpTtlMs)
    };
  };

  const isValid = (otp, storedOtp, expiresAt) => {
    if (!storedOtp || !expiresAt) {
      return false;
    }

    if (expiresAt.getTime() <= Date.now()) {
      return false;
    }

    return otp === storedOtp;
  };

  return {
    createOtp,
    isValid
  };
};

module.exports = {
  createOtpService
};
