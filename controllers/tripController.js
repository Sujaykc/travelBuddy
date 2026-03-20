const { Trip } = require('../models');

const createTrip = async (req, res, next) => {
  try {
    const { destination, startDate, endDate, description } = req.body;

    const trip = await Trip.create({
      userId: req.user._id,
      destination,
      startDate,
      endDate,
      description,
    });

    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user._id });
    res.json(trips);
  } catch (error) {
    next(error);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip && trip.userId.toString() === req.user._id.toString()) {
      res.json(trip);
    } else {
      res.status(404);
      throw new Error('Trip not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip && trip.userId.toString() === req.user._id.toString()) {
      trip.destination = req.body.destination || trip.destination;
      trip.startDate = req.body.startDate || trip.startDate;
      trip.endDate = req.body.endDate || trip.endDate;
      trip.description = req.body.description || trip.description;

      const updatedTrip = await trip.save();
      res.json(updatedTrip);
    } else {
      res.status(404);
      throw new Error('Trip not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip && trip.userId.toString() === req.user._id.toString()) {
      await trip.deleteOne();
      res.json({ message: 'Trip removed' });
    } else {
      res.status(404);
      throw new Error('Trip not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip
};
