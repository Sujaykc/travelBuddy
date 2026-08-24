const { OAuth2Client } = require('google-auth-library');
const appleSignin = require('apple-signin-auth');
const { AppError } = require('../app/usecases/errors');
const { normalizeEmail } = require('../app/entities/value-objects/email');

const createSocialIdentityService = () => {
  const verifyGoogleIdentityToken = async (idToken) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new AppError('Google login is not configured', 500, 'GOOGLE_NOT_CONFIGURED');
    }

    try {
      const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.sub || !payload.email || payload.email_verified === false) {
        throw new AppError('Invalid Google identity token', 401, 'INVALID_IDENTITY_TOKEN');
      }

      return {
        providerId: payload.sub,
        email: normalizeEmail(payload.email),
        firstName: payload.given_name || '',
        lastName: payload.family_name || ''
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Invalid Google identity token', 401, 'INVALID_IDENTITY_TOKEN');
    }
  };

  const verifyAppleIdentityToken = async (idToken) => {
    if (!process.env.APPLE_CLIENT_ID) {
      throw new AppError('Apple login is not configured', 500, 'APPLE_NOT_CONFIGURED');
    }

    try {
      const payload = await appleSignin.verifyIdToken(idToken, {
        audience: process.env.APPLE_CLIENT_ID,
        ignoreExpiration: false
      });

      if (!payload || !payload.sub) {
        throw new AppError('Invalid Apple identity token', 401, 'INVALID_IDENTITY_TOKEN');
      }

      const hasEmail = Boolean(payload.email);
      const isEmailVerified = payload.email_verified === true || payload.email_verified === 'true';

      if (hasEmail && !isEmailVerified) {
        throw new AppError('Apple email is not verified', 401, 'INVALID_IDENTITY_TOKEN');
      }

      return {
        providerId: payload.sub,
        email: hasEmail ? normalizeEmail(payload.email) : null,
        firstName: '',
        lastName: ''
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Invalid Apple identity token', 401, 'INVALID_IDENTITY_TOKEN');
    }
  };

  const verify = async (provider, idToken) => {
    if (provider === 'google') {
      return verifyGoogleIdentityToken(idToken);
    }

    if (provider === 'apple') {
      return verifyAppleIdentityToken(idToken);
    }

    throw new AppError('Unsupported social login provider', 400, 'UNSUPPORTED_PROVIDER');
  };

  return {
    verify
  };
};

module.exports = createSocialIdentityService;
