const createListNotificationsUseCase = require('./list-notifications.usecase');
const createMarkReadUseCase = require('./mark-read.usecase');

const createNotificationUseCases = (deps) => ({
  listNotifications: createListNotificationsUseCase(deps),
  markRead: createMarkReadUseCase(deps)
});

module.exports = {
  createNotificationUseCases
};

