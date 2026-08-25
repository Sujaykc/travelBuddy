const { AppError } = require('../errors');
const { normalizeId } = require('../../entities/value-objects/id');

const createUpdateTripUseCase = ({ tripRepository }) => async (input) => {
  const trip = await tripRepository.findById(input.tripId);

  const ownerId = normalizeId(trip ? trip.userId : null);
  if (!trip || ownerId !== normalizeId(input.userId)) {
    throw new AppError('Trip not found or unauthorized', 404, 'TRIP_NOT_FOUND');
  }

  const { userId: _userId, tripId: _tripId, ...updates } = input;
  Object.assign(trip, updates);

  await tripRepository.save(trip);

  return { trip };
};

module.exports = createUpdateTripUseCase;

