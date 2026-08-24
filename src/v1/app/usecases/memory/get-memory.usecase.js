const { AppError } = require('../errors');
const { normalizeId } = require('../../entities/value-objects/id');

const createGetMemoryUseCase = ({ memoryRepository }) => async (input) => {
  const memory = await memoryRepository.findById(input.memoryId);

  const ownerId = normalizeId(memory ? memory.userId : null);
  if (!memory || ownerId !== normalizeId(input.userId)) {
    throw new AppError('Memory not found or unauthorized', 404, 'MEMORY_NOT_FOUND');
  }

  return { memory };
};

module.exports = createGetMemoryUseCase;

