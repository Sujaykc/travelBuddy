const createTripUseCase = ({ tripRepository }) => async (input) => {
  const trip = await tripRepository.create({
    userId: input.userId,
    destination: input.destination,
    startDate: input.startDate,
    endDate: input.endDate,
    description: input.description
  });

  return { trip };
};

module.exports = createTripUseCase;

