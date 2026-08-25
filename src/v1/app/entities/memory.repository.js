const { Memory } = require('../../models');
const MemoryEntity = require('./memory.entity');

const toEntity = (memoryDoc) => MemoryEntity.fromPersistence(memoryDoc);

const create = async (data) => {
  const memory = await Memory.create(data);
  return toEntity(memory);
};

const findByUserId = async (userId) => {
  const memories = await Memory.find({ userId }).sort({ tripDate: -1 });
  return memories.map(toEntity);
};

const findById = async (id) => {
  const memory = await Memory.findById(id);
  return toEntity(memory);
};

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const applyMemoryEntity = (memoryDoc, entity) => {
  if (has(entity, 'tripDate')) memoryDoc.tripDate = entity.tripDate;
  if (has(entity, 'place')) memoryDoc.place = entity.place;
  if (has(entity, 'images')) memoryDoc.images = entity.images;
  if (has(entity, 'description')) memoryDoc.description = entity.description;
};

const save = async (entity) => {
  if (!entity || !entity.id) {
    return null;
  }

  const memoryDoc = await Memory.findById(entity.id);
  if (!memoryDoc) {
    return null;
  }

  applyMemoryEntity(memoryDoc, entity);
  await memoryDoc.save();
  return toEntity(memoryDoc);
};

const deleteMemory = async (entity) => {
  if (!entity || !entity.id) {
    return;
  }

  await Memory.deleteOne({ _id: entity.id });
};

module.exports = {
  create,
  findByUserId,
  findById,
  save,
  delete: deleteMemory
};
