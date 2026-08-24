const createListMemoriesUseCase = ({ memoryRepository }) => async (input) => {
  const memories = await memoryRepository.findByUserId(input.userId);
  return { memories };
};

module.exports = createListMemoriesUseCase;

