const express = require('express');
const { getUserProfile, updateUserProfile } = require('../../v1/app/controllers/user/user.controller');
const { protect } = require('../../middlewares');

const router = express.Router();

router.use(protect);

router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

module.exports = router;
