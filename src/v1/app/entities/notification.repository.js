const { Notification } = require('../../models');
const NotificationEntity = require('./notification.entity');

const toEntity = (notificationDoc) => NotificationEntity.fromPersistence(notificationDoc);

const create = async (data) => {
  const notification = await Notification.create(data);
  return toEntity(notification);
};

const findByUserIdPopulated = async (userId) => {
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .populate('relatedUserId', 'firstName lastName profileImage');

  return notifications.map(toEntity);
};

const findById = async (id) => {
  const notification = await Notification.findById(id);
  return toEntity(notification);
};

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const applyNotificationEntity = (notificationDoc, entity) => {
  if (has(entity, 'isRead')) notificationDoc.isRead = entity.isRead;
};

const save = async (entity) => {
  if (!entity || !entity.id) {
    return null;
  }

  const notificationDoc = await Notification.findById(entity.id);
  if (!notificationDoc) {
    return null;
  }

  applyNotificationEntity(notificationDoc, entity);
  await notificationDoc.save();
  return toEntity(notificationDoc);
};

module.exports = {
  create,
  findByUserIdPopulated,
  findById,
  save
};
