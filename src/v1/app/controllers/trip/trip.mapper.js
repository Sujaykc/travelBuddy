const TripEntity = require('../../entities/trip.entity');

const toTripResponse = (tripDoc) => {
  const trip = TripEntity.fromPersistence(tripDoc);

  return {
    _id: trip ? trip.id : null,
    userId: trip ? trip.userId : null,
    destination: trip ? trip.destination : '',
    startDate: trip ? trip.startDate : null,
    endDate: trip ? trip.endDate : null,
    description: trip ? trip.description : '',
    createdAt: trip ? trip.createdAt : null,
    updatedAt: trip ? trip.updatedAt : null
  };
};

const toTripListResponse = (trips) =>
  Array.isArray(trips) ? trips.map(toTripResponse) : [];

module.exports = {
  toTripResponse,
  toTripListResponse
};
