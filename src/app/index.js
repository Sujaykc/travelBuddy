const { createAuthUseCases } = require('../v1/app/usecases/auth');
const { createUserUseCases } = require('../v1/app/usecases/user');
const { createTripUseCases } = require('../v1/app/usecases/trip');
const { createConnectionUseCases } = require('../v1/app/usecases/connection');
const { createMatchingUseCases } = require('../v1/app/usecases/matching');
const { createChatUseCases } = require('../v1/app/usecases/chat');
const { createNotificationUseCases } = require('../v1/app/usecases/notification');
const { createMemoryUseCases } = require('../v1/app/usecases/memory');

const userRepository = require('../v1/app/entities/user.repository');
const tripRepository = require('../v1/app/entities/trip.repository');
const connectionRepository = require('../v1/app/entities/connection.repository');
const notificationRepository = require('../v1/app/entities/notification.repository');
const messageRepository = require('../v1/app/entities/message.repository');
const memoryRepository = require('../v1/app/entities/memory.repository');

const createTokenService = require('../v1/services/token.service');
const createSocialIdentityService = require('../v1/services/social-identity.service');
const { createOtpService } = require('../v1/services/otp.service');
const { createCryptoService } = require('../v1/services/crypto.service');
const authConfig = require('../config/auth.config');
const emailService = require('../v1/services/email.service');

const cryptoService = createCryptoService();
const otpService = createOtpService({
  otpLength: authConfig.otpLength,
  otpTtlMs: authConfig.otpTtlMs,
  cryptoService
});
const tokenService = createTokenService();
const socialIdentityService = createSocialIdentityService();

const authUseCases = createAuthUseCases({
  userRepository,
  tokenService,
  socialIdentityService,
  otpService,
  cryptoService,
  emailService,
  authConfig
});

const userUseCases = createUserUseCases({
  userRepository
});

const tripUseCases = createTripUseCases({
  tripRepository
});

const connectionUseCases = createConnectionUseCases({
  connectionRepository,
  notificationRepository
});

const matchingUseCases = createMatchingUseCases({
  tripRepository
});

const chatUseCases = createChatUseCases({
  messageRepository,
  connectionRepository,
  notificationRepository
});

const notificationUseCases = createNotificationUseCases({
  notificationRepository
});

const memoryUseCases = createMemoryUseCases({
  memoryRepository
});

module.exports = {
  authUseCases,
  userUseCases,
  tripUseCases,
  connectionUseCases,
  matchingUseCases,
  chatUseCases,
  notificationUseCases,
  memoryUseCases
};
