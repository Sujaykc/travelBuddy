const { AppError } = require('../errors');

const createUpdateProfileUseCase = ({ userRepository }) => async (input) => {
  const user = await userRepository.findById(input.userId);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const { userId: _userId, ...updates } = input;
  Object.assign(user, updates);

  await userRepository.save(user);

  return { user };
};

module.exports = createUpdateProfileUseCase;

