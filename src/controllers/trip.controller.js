const tripService = require('../services/trip.service.js');

const createTrip = async (req, res, next) => {
  try {
    const result = await tripService.createTrip(req.user._id, req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

const getTrips = async (req, res, next) => {
  try {
    const result = await tripService.getTrips(req.user._id);
    res.json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const result = await tripService.getTripById(req.user._id, req.params.id);
    res.json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const result = await tripService.updateTrip(req.user._id, req.params.id, req.body);
    res.json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const result = await tripService.deleteTrip(req.user._id, req.params.id);
    res.json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
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
