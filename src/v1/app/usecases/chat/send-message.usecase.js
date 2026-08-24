const { AppError } = require('../errors');

const createSendMessageUseCase = ({ messageRepository, connectionRepository, notificationRepository }) =>
  async (input) => {
    if (input.userId === input.receiverId) {
      throw new AppError('Cannot message yourself', 400, 'INVALID_REQUEST');
    }

    const connection = await connectionRepository.findAcceptedBetween(
      input.userId,
      input.receiverId
    );

    if (!connection) {
      throw new AppError('Not connected or connection not accepted', 403, 'NOT_CONNECTED');
    }

    const message = await messageRepository.create({
      senderId: input.userId,
      receiverId: input.receiverId,
      content: input.content
    });

    await notificationRepository.create({
      userId: input.receiverId,
      type: 'new_message',
      relatedUserId: input.userId
    });

    return { message };
  };

module.exports = createSendMessageUseCase;

