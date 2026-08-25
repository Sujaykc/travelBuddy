const asyncHandler = require('../../../../helpers/asyncHandler');
const { notificationUseCases } = require('../../../../app');
const notificationDtos = require('./dtos');
const notificationMapper = require('./notification.mapper');

const getNotifications = asyncHandler(async (req, res) => {
  const input = notificationDtos.listNotifications.fromUser(req.user);
  const result = await notificationUseCases.listNotifications(input);
  res.status(200).json(notificationMapper.toNotificationListResponse(result.notifications));
});

const markAsRead = asyncHandler(async (req, res) => {
  const input = notificationDtos.markRead.from(req.user, req.params.id);
  const result = await notificationUseCases.markRead(input);
  res.status(200).json(notificationMapper.toNotificationResponse(result.notification));
});

module.exports = {
  getNotifications,
  markAsRead
};
