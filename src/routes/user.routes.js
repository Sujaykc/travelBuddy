const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers');
const { protect } = require('../middlewares');
const { updateProfileSchema } = require('../validations');

const router = express.Router();

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400);
    return next(new Error(error.details[0].message));
  }
  next();
};

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, validate(updateProfileSchema), updateUserProfile);

module.exports = router;
