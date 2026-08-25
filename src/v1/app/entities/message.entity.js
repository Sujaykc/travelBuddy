class MessageEntity {
  constructor({
    id,
    senderId,
    receiverId,
    content,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(messageDoc) {
    if (!messageDoc) {
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

    return new MessageEntity({
      id: messageDoc.id || (messageDoc._id ? messageDoc._id.toString() : null),
      senderId: normalizeId(messageDoc.senderId),
      receiverId: normalizeId(messageDoc.receiverId),
      content: messageDoc.content || '',
      createdAt: messageDoc.createdAt || null,
      updatedAt: messageDoc.updatedAt || null
    });
  }
}

module.exports = MessageEntity;
