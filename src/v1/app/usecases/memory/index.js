const createMemoryUseCase = require('./create-memory.usecase');
const createListMemoriesUseCase = require('./list-memories.usecase');
const createGetMemoryUseCase = require('./get-memory.usecase');
const createUpdateMemoryUseCase = require('./update-memory.usecase');
const createDeleteMemoryUseCase = require('./delete-memory.usecase');

const createMemoryUseCases = (deps) => ({
  createMemory: createMemoryUseCase(deps),
  listMemories: createListMemoriesUseCase(deps),
  getMemory: createGetMemoryUseCase(deps),
  updateMemory: createUpdateMemoryUseCase(deps),
  deleteMemory: createDeleteMemoryUseCase(deps)
});

module.exports = {
  createMemoryUseCases
};

