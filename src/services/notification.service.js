const { Notification } = require('../models');

const getNotifications = async (userId) => {
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .populate('relatedUserId', 'firstName lastName profileImage');

  return notifications;
};

const markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findById(notificationId);

  if (notification && notification.userId.toString() === userId.toString()) {
    notification.isRead = true;
    await notification.save();
    return notification;
  } else {
    const error = new Error('Notification not found or unauthorized');
    error.status = 404;
    throw error;
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
