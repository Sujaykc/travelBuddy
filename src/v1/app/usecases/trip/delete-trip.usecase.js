const { AppError } = require('../errors');
const { normalizeId } = require('../../entities/value-objects/id');

const createDeleteTripUseCase = ({ tripRepository }) => async (input) => {
  const trip = await tripRepository.findById(input.tripId);

  const ownerId = normalizeId(trip ? trip.userId : null);
  if (!trip || ownerId !== normalizeId(input.userId)) {
    throw new AppError('Trip not found or unauthorized', 404, 'TRIP_NOT_FOUND');
  }

  await tripRepository.delete(trip);
  return { message: 'Trip removed' };
};

module.exports = createDeleteTripUseCase;

