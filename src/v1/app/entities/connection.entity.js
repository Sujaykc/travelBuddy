class ConnectionEntity {
  constructor({
    id,
    requesterId,
    recipientId,
    status,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.requesterId = requesterId;
    this.recipientId = recipientId;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(connectionDoc) {
    if (!connectionDoc) {
      return null;
    }

    return new ConnectionEntity({
      id: connectionDoc.id || (connectionDoc._id ? connectionDoc._id.toString() : null),
      requesterId: connectionDoc.requesterId || null,
      recipientId: connectionDoc.recipientId || null,
      status: connectionDoc.status || 'pending',
      createdAt: connectionDoc.createdAt || null,
      updatedAt: connectionDoc.updatedAt || null
    });
  }
}

module.exports = ConnectionEntity;
