const express = require('express');
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require('../controllers');
const { protect } = require('../middlewares');
const { createTripSchema, updateTripSchema } = require('../validations');

const router = express.Router();

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400);
    return next(new Error(error.details[0].message));
  }
  next();
};

router.route('/')
  .post(protect, validate(createTripSchema), createTrip)
  .get(protect, getTrips);

router.route('/:id')
  .get(protect, getTripById)
  .put(protect, validate(updateTripSchema), updateTrip)
  .delete(protect, deleteTrip);

module.exports = router;
