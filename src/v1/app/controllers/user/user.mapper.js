const UserEntity = require('../../entities/user.entity');

const toProfileResponse = (userDoc) => {
  const user = UserEntity.fromPersistence(userDoc);

  return {
    _id: user ? user.id : null,
    firstName: user ? user.firstName : '',
    lastName: user ? user.lastName : '',
    email: user ? user.email : '',
    dateOfBirth: user ? user.dateOfBirth : null,
    profileImage: user ? user.profileImage : ''
  };
};

module.exports = {
  toProfileResponse
};
