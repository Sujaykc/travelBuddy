const createListTripsUseCase = ({ tripRepository }) => async (input) => {
  const trips = await tripRepository.findByUserId(input.userId);
  return { trips };
};

module.exports = createListTripsUseCase;

