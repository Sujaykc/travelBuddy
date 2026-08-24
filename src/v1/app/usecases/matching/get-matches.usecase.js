const createGetMatchesUseCase = ({ tripRepository }) => async (input) => {
  const currentTrip = await tripRepository.findLatestByUserId(input.userId);

  if (!currentTrip) {
    return { message: 'Create a trip to find matches', matches: [] };
  }
  const matches = await tripRepository.findMatchesForTrip(currentTrip, input.userId);

  return { matches };
};

module.exports = createGetMatchesUseCase;

