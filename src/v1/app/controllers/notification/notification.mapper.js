const NotificationEntity = require('../../entities/notification.entity');

const normalizeUserRef = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return { _id: value };
  }

  if (value._id) {
    return {
      _id: value._id.toString(),
      firstName: value.firstName || '',
      lastName: value.lastName || '',
      profileImage: value.profileImage || ''
    };
  }

  return { _id: value.toString() };
};

const toNotificationResponse = (notificationDoc) => {
  const notification = NotificationEntity.fromPersistence(notificationDoc);

  return {
    _id: notification ? notification.id : null,
    userId: notification ? notification.userId : null,
    type: notification ? notification.type : '',
    relatedUserId: normalizeUserRef(notification ? notification.relatedUserId : null),
    isRead: notification ? notification.isRead : false,
    createdAt: notification ? notification.createdAt : null,
    updatedAt: notification ? notification.updatedAt : null
  };
};

const toNotificationListResponse = (notifications) =>
  Array.isArray(notifications) ? notifications.map(toNotificationResponse) : [];

module.exports = {
  toNotificationResponse,
  toNotificationListResponse
};
