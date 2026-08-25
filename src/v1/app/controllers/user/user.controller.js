const asyncHandler = require('../../../../helpers/asyncHandler');
const { userUseCases } = require('../../../../app');
const userDtos = require('./dtos');
const userMapper = require('./user.mapper');

const getUserProfile = asyncHandler(async (req, res) => {
  const input = userDtos.getProfile.fromUser(req.user);
  const result = await userUseCases.getProfile(input);
  res.status(200).json(userMapper.toProfileResponse(result.user));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const input = userDtos.updateProfile.from(req.user, req.body);
  const result = await userUseCases.updateProfile(input);
  res.status(200).json(userMapper.toProfileResponse(result.user));
});

module.exports = { getUserProfile, updateUserProfile };
