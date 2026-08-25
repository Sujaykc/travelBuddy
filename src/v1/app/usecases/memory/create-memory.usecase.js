const createMemoryUseCase = ({ memoryRepository }) => async (input) => {
  const memory = await memoryRepository.create({
    userId: input.userId,
    tripDate: input.tripDate,
    place: input.place,
    images: input.images,
    description: input.description
  });

  return { memory };
};

module.exports = createMemoryUseCase;

