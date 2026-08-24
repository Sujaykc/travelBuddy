const {
  createTripSchema,
  updateTripSchema,
  tripIdSchema
} = require('../trip.validator');
const {
  fromUserOnly,
  fromIdAndUser,
  fromUserAndPayload,
  fromIdUserAndPayload
} = require('../../common/common-dtos');

module.exports = {
  createTrip: {
    schema: createTripSchema,
    from: fromUserAndPayload(createTripSchema)
  },
  updateTrip: {
    schema: updateTripSchema,
    from: fromIdUserAndPayload(tripIdSchema, 'tripId', updateTripSchema)
  },
  getTrip: {
    from: fromIdAndUser(tripIdSchema, 'tripId')
  },
  deleteTrip: {
    from: fromIdAndUser(tripIdSchema, 'tripId')
  },
  listTrips: {
    from: fromUserOnly
  }
};
