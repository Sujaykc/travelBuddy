const { User } = require('../models');

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return user;
};

const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  user.firstName = updateData.firstName || user.firstName;
  user.lastName = updateData.lastName || user.lastName;
  user.dateOfBirth = updateData.dateOfBirth || user.dateOfBirth;
  user.profileImage = updateData.profileImage || user.profileImage;

  const updatedUser = await user.save();

  return {
    _id: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    dateOfBirth: updatedUser.dateOfBirth,
    profileImage: updatedUser.profileImage,
  };
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
