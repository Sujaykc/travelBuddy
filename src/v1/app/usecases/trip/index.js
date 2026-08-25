const createTripUseCase = require('./create-trip.usecase');
const createListTripsUseCase = require('./list-trips.usecase');
const createGetTripUseCase = require('./get-trip.usecase');
const createUpdateTripUseCase = require('./update-trip.usecase');
const createDeleteTripUseCase = require('./delete-trip.usecase');

const createTripUseCases = (deps) => ({
  createTrip: createTripUseCase(deps),
  listTrips: createListTripsUseCase(deps),
  getTrip: createGetTripUseCase(deps),
  updateTrip: createUpdateTripUseCase(deps),
  deleteTrip: createDeleteTripUseCase(deps)
});

module.exports = {
  createTripUseCases
};

