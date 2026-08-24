const toPositiveInt = (value, defaultValue) => {
  const parsedValue = Number.parseInt(value, 10);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return defaultValue;
  }

  return parsedValue;
};

const otpTtlMinutes = toPositiveInt(process.env.OTP_TTL_MINUTES, 10);
const otpLength = Math.min(Math.max(toPositiveInt(process.env.OTP_LENGTH, 6), 4), 10);
const otpTtlMs = otpTtlMinutes * 60 * 1000;

module.exports = {
  otpTtlMinutes,
  otpLength,
  otpTtlMs
};
