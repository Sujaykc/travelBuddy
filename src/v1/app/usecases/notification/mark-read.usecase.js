const { AppError } = require('../errors');
const { normalizeId } = require('../../entities/value-objects/id');

const createMarkReadUseCase = ({ notificationRepository }) => async (input) => {
  const notification = await notificationRepository.findById(input.notificationId);

  const ownerId = normalizeId(notification ? notification.userId : null);
  if (!notification || ownerId !== normalizeId(input.userId)) {
    throw new AppError('Notification not found or unauthorized', 404, 'NOTIFICATION_NOT_FOUND');
  }

  if (notification.isRead) {
    return { notification };
  }

  notification.isRead = true;
  await notificationRepository.save(notification);

  return { notification };
};

module.exports = createMarkReadUseCase;

