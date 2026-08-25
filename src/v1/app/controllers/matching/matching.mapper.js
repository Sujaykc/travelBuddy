const TripEntity = require('../../entities/trip.entity');

const normalizeUserRef = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return { _id: value };
  }

  if (value._id) {
    return {
      _id: value._id.toString(),
      firstName: value.firstName || '',
      lastName: value.lastName || '',
      profileImage: value.profileImage || ''
    };
  }

  return { _id: value.toString() };
};

const toMatchResponse = (tripDoc) => {
  const trip = TripEntity.fromPersistence(tripDoc);

  return {
    _id: trip ? trip.id : null,
    userId: normalizeUserRef(trip ? trip.userId : null),
    destination: trip ? trip.destination : '',
    startDate: trip ? trip.startDate : null,
    endDate: trip ? trip.endDate : null,
    description: trip ? trip.description : '',
    createdAt: trip ? trip.createdAt : null,
    updatedAt: trip ? trip.updatedAt : null
  };
};

const toMatchListResponse = (trips) =>
  Array.isArray(trips) ? trips.map(toMatchResponse) : [];

module.exports = {
  toMatchResponse,
  toMatchListResponse
};
