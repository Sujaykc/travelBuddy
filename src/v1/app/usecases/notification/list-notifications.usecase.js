const createListNotificationsUseCase = ({ notificationRepository }) => async (input) => {
  const notifications = await notificationRepository.findByUserIdPopulated(input.userId);
  return { notifications };
};

module.exports = createListNotificationsUseCase;

