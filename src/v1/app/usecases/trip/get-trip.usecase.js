const { AppError } = require('../errors');
const { normalizeId } = require('../../entities/value-objects/id');

const createGetTripUseCase = ({ tripRepository }) => async (input) => {
  const trip = await tripRepository.findById(input.tripId);

  const ownerId = normalizeId(trip ? trip.userId : null);
  if (!trip || ownerId !== normalizeId(input.userId)) {
    throw new AppError('Trip not found or unauthorized', 404, 'TRIP_NOT_FOUND');
  }

  return { trip };
};

module.exports = createGetTripUseCase;

