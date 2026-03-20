const { Trip } = require('../models');

const getMatches = async (req, res, next) => {
  try {
    const userTrips = await Trip.find({ userId: req.user._id });
    
    if (userTrips.length === 0) {
       return res.json({ message: 'Create a trip to find matches', matches: [] });
    }

    const currentTrip = userTrips[0];

    const matchedTrips = await Trip.find({
      userId: { $ne: req.user._id },
      destination: currentTrip.destination,
      $and: [
          { startDate: { $lte: currentTrip.endDate } },
          { endDate: { $gte: currentTrip.startDate } }
      ]
    }).populate('userId', 'firstName lastName profileImage');

    res.json({ matches: matchedTrips });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMatches };
