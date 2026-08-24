const { AppError } = require('../errors');
const { normalizeId } = require('../../entities/value-objects/id');

const createHandleRequestUseCase = ({ connectionRepository, notificationRepository }) => async (input) => {
  const connection = await connectionRepository.findById(input.connectionId);

  if (!connection) {
    throw new AppError('Connection request not found', 404, 'CONNECTION_NOT_FOUND');
  }

  const recipientId = normalizeId(connection.recipientId);
  if (recipientId !== normalizeId(input.userId)) {
    throw new AppError('Not authorized to handle this request', 401, 'UNAUTHORIZED');
  }

  if (connection.status && connection.status !== 'pending') {
    throw new AppError('Connection request already handled', 409, 'CONNECTION_ALREADY_HANDLED');
  }

  const statusMap = {
    accept: 'accepted',
    reject: 'rejected'
  };

  const nextStatus = statusMap[input.action];
  if (!nextStatus) {
    throw new AppError('Invalid action', 400, 'INVALID_ACTION');
  }

  connection.status = nextStatus;

  await connectionRepository.save(connection);

  const notificationType = input.action === 'accept' ? 'request_accepted' : 'request_rejected';
  await notificationRepository.create({
    userId: connection.requesterId,
    type: notificationType,
    relatedUserId: input.userId
  });

  return { connection, message: `Connection ${input.action}ed` };
};

module.exports = createHandleRequestUseCase;

