const { AppError } = require('../errors');
const { normalizeId } = require('../../entities/value-objects/id');

const createUpdateMemoryUseCase = ({ memoryRepository }) => async (input) => {
  const memory = await memoryRepository.findById(input.memoryId);

  const ownerId = normalizeId(memory ? memory.userId : null);
  if (!memory || ownerId !== normalizeId(input.userId)) {
    throw new AppError('Memory not found or unauthorized', 404, 'MEMORY_NOT_FOUND');
  }

  const { userId: _userId, memoryId: _memoryId, ...updates } = input;
  Object.assign(memory, updates);

  await memoryRepository.save(memory);

  return { memory };
};

module.exports = createUpdateMemoryUseCase;

