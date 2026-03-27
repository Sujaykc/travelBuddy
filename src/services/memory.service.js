const { Memory } = require('../models');

const createMemory = async (userId, memoryData) => {
  const { tripDate, place, images, description } = memoryData;

  const memory = await Memory.create({
    userId,
    tripDate,
    place,
    images,
    description,
  });

  return memory;
};

const getMemories = async (userId) => {
  const memories = await Memory.find({ userId }).sort({ tripDate: -1 });
  return memories;
};

const getMemoryById = async (userId, memoryId) => {
  const memory = await Memory.findById(memoryId);

  if (memory && memory.userId.toString() === userId.toString()) {
    return memory;
  } else {
    const error = new Error('Memory not found or unauthorized');
    error.status = 404;
    throw error;
  }
};

const updateMemory = async (userId, memoryId, updateData) => {
  const memory = await Memory.findById(memoryId);

  if (memory && memory.userId.toString() === userId.toString()) {
    memory.tripDate = updateData.tripDate || memory.tripDate;
    memory.place = updateData.place || memory.place;
    memory.images = updateData.images || memory.images;
    memory.description = updateData.description || memory.description;

    const updatedMemory = await memory.save();
    return updatedMemory;
  } else {
    const error = new Error('Memory not found or unauthorized');
    error.status = 404;
    throw error;
  }
};

const deleteMemory = async (userId, memoryId) => {
  const memory = await Memory.findById(memoryId);

  if (memory && memory.userId.toString() === userId.toString()) {
    await memory.deleteOne();
    return { message: 'Memory removed' };
  } else {
    const error = new Error('Memory not found or unauthorized');
    error.status = 404;
    throw error;
  }
};

module.exports = {
  createMemory,
  getMemories,
  getMemoryById,
  updateMemory,
  deleteMemory,
};
