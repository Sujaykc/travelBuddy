const MemoryEntity = require('../../entities/memory.entity');

const toMemoryResponse = (memoryDoc) => {
  const memory = MemoryEntity.fromPersistence(memoryDoc);

  return {
    _id: memory ? memory.id : null,
    userId: memory ? memory.userId : null,
    tripDate: memory ? memory.tripDate : null,
    place: memory ? memory.place : '',
    images: memory ? memory.images : [],
    description: memory ? memory.description : '',
    createdAt: memory ? memory.createdAt : null,
    updatedAt: memory ? memory.updatedAt : null
  };
};

const toMemoryListResponse = (memories) =>
  Array.isArray(memories) ? memories.map(toMemoryResponse) : [];

module.exports = {
  toMemoryResponse,
  toMemoryListResponse
};
