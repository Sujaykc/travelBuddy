const userService = require('../services/user.service.js');

const getUserProfile = async (req, res, next) => {
  try {
    const result = await userService.getUserProfile(req.user._id);
    res.json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const result = await userService.updateUserProfile(req.user._id, req.body);
    res.json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

module.exports = { getUserProfile, updateUserProfile };
