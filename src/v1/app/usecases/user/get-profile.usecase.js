const { AppError } = require('../errors');

const createGetProfileUseCase = ({ userRepository }) => async (input) => {
  const user = await userRepository.findById(input.userId);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  return { user };
};

module.exports = createGetProfileUseCase;

