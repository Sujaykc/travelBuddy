class NotificationEntity {
  constructor({
    id,
    userId,
    type,
    relatedUserId,
    isRead,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.relatedUserId = relatedUserId;
    this.isRead = isRead;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(notificationDoc) {
    if (!notificationDoc) {
      return null;
    }

    const normalizeId = (value) => {
      if (!value) {
        return null;
      }
      if (value._id) {
        return value._id.toString();
      }
      return value.toString();
    };

    return new NotificationEntity({
      id: notificationDoc.id || (notificationDoc._id ? notificationDoc._id.toString() : null),
      userId: normalizeId(notificationDoc.userId),
      type: notificationDoc.type || '',
      relatedUserId: notificationDoc.relatedUserId || null,
      isRead: Boolean(notificationDoc.isRead),
      createdAt: notificationDoc.createdAt || null,
      updatedAt: notificationDoc.updatedAt || null
    });
  }
}

module.exports = NotificationEntity;
