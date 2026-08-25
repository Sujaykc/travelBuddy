class MemoryEntity {
  constructor({
    id,
    userId,
    tripDate,
    place,
    images,
    description,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.userId = userId;
    this.tripDate = tripDate;
    this.place = place;
    this.images = images;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(memoryDoc) {
    if (!memoryDoc) {
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

    return new MemoryEntity({
      id: memoryDoc.id || (memoryDoc._id ? memoryDoc._id.toString() : null),
      userId: normalizeId(memoryDoc.userId),
      tripDate: memoryDoc.tripDate || null,
      place: memoryDoc.place || '',
      images: Array.isArray(memoryDoc.images) ? memoryDoc.images : [],
      description: memoryDoc.description || '',
      createdAt: memoryDoc.createdAt || null,
      updatedAt: memoryDoc.updatedAt || null
    });
  }
}

module.exports = MemoryEntity;
