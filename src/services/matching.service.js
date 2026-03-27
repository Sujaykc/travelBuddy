const { Trip } = require('../models');

const getMatches = async (userId) => {
  const userTrips = await Trip.find({ userId });
  
  if (userTrips.length === 0) {
     return { message: 'Create a trip to find matches', matches: [] };
  }

  const currentTrip = userTrips[0];

  const matchedTrips = await Trip.find({
    userId: { $ne: userId },
    destination: currentTrip.destination,
    $and: [
        { startDate: { $lte: currentTrip.endDate } },
        { endDate: { $gte: currentTrip.startDate } }
    ]
  }).populate('userId', 'firstName lastName profileImage');

  return { matches: matchedTrips };
};

module.exports = {
  getMatches,
};
