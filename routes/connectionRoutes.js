const express = require('express');
const {
  sendConnectionRequest,
  handleConnectionRequest,
  getConnections,
} = require('../controllers');
const { protect } = require('../middlewares');
const { sendConnectionSchema, handleConnectionSchema } = require('../validations');

const router = express.Router();

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400);
    return next(new Error(error.details[0].message));
  }
  next();
};

const validateIdBody = (schema) => (req, res, next) => {
  const { error } = schema.validate({ connectionId: req.params.id, ...req.body });
  if (error) {
    res.status(400);
    return next(new Error(error.details[0].message));
  }
  next();
};

router.route('/')
  .post(protect, validateBody(sendConnectionSchema), sendConnectionRequest)
  .get(protect, getConnections);

router.route('/:id')
  .put(protect, validateIdBody(handleConnectionSchema), handleConnectionRequest);

module.exports = router;
