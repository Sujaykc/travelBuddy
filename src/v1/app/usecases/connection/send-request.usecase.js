const { AppError } = require('../errors');

const createSendRequestUseCase = ({ connectionRepository, notificationRepository }) => async (input) => {
  if (input.recipientId === input.userId) {
    throw new AppError('Cannot send connection to yourself', 400, 'INVALID_REQUEST');
  }

  const existingConnection = await connectionRepository.findBetween(
    input.userId,
    input.recipientId
  );

  if (existingConnection) {
    throw new AppError('Connection request already exists', 400, 'CONNECTION_EXISTS');
  }

  const connection = await connectionRepository.create({
    requesterId: input.userId,
    recipientId: input.recipientId
  });

  await notificationRepository.create({
    userId: input.recipientId,
    type: 'connection_request',
    relatedUserId: input.userId
  });

  return { connection };
};

module.exports = createSendRequestUseCase;

