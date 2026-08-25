class TripEntity {
  constructor({
    id,
    userId,
    destination,
    startDate,
    endDate,
    description,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.userId = userId;
    this.destination = destination;
    this.startDate = startDate;
    this.endDate = endDate;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(tripDoc) {
    if (!tripDoc) {
      return null;
    }

    let userId = null;
    if (tripDoc.userId) {
      if (typeof tripDoc.userId === 'string') {
        userId = tripDoc.userId;
      } else if (tripDoc.userId._id) {
        const hasProfile =
          tripDoc.userId.firstName !== undefined ||
          tripDoc.userId.lastName !== undefined ||
          tripDoc.userId.profileImage !== undefined;

        userId = hasProfile
          ? {
            _id: tripDoc.userId._id.toString(),
            firstName: tripDoc.userId.firstName || '',
            lastName: tripDoc.userId.lastName || '',
            profileImage: tripDoc.userId.profileImage || ''
          }
          : tripDoc.userId._id.toString();
      } else {
        userId = tripDoc.userId.toString();
      }
    }

    return new TripEntity({
      id: tripDoc.id || (tripDoc._id ? tripDoc._id.toString() : null),
      userId,
      destination: tripDoc.destination || '',
      startDate: tripDoc.startDate || null,
      endDate: tripDoc.endDate || null,
      description: tripDoc.description || '',
      createdAt: tripDoc.createdAt || null,
      updatedAt: tripDoc.updatedAt || null
    });
  }
}

module.exports = TripEntity;
