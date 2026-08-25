const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const UserEntity = require('./user.entity');

const toEntity = (userDoc) => UserEntity.fromPersistence(userDoc);

const findByEmail = async (email) => {
  const user = await User.findOne({ email });
  return toEntity(user);
};

const findById = async (id) => {
  const user = await User.findById(id);
  return toEntity(user);
};

const findBySocialLogin = async (provider, providerId) => {
  const user = await User.findOne({ socialLoginProvider: provider, socialLoginId: providerId });
  return toEntity(user);
};

const create = async (data) => {
  const user = await User.create(data);
  return toEntity(user);
};

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const applyUserEntity = (userDoc, entity) => {
  if (has(entity, 'firstName')) userDoc.firstName = entity.firstName;
  if (has(entity, 'lastName')) userDoc.lastName = entity.lastName;
  if (has(entity, 'email')) userDoc.email = entity.email;
  if (has(entity, 'password')) userDoc.password = entity.password;
  if (has(entity, 'dateOfBirth')) userDoc.dateOfBirth = entity.dateOfBirth;
  if (has(entity, 'profileImage')) userDoc.profileImage = entity.profileImage;
  if (has(entity, 'isVerified')) userDoc.isVerified = entity.isVerified;
  if (has(entity, 'socialLoginProvider')) userDoc.socialLoginProvider = entity.socialLoginProvider;
  if (has(entity, 'socialLoginId')) userDoc.socialLoginId = entity.socialLoginId;
  if (has(entity, 'emailOtpCode')) userDoc.emailOtpCode = entity.emailOtpCode;
  if (has(entity, 'emailOtpExpiresAt')) userDoc.emailOtpExpiresAt = entity.emailOtpExpiresAt;
  if (has(entity, 'passwordResetOtpCode')) userDoc.passwordResetOtpCode = entity.passwordResetOtpCode;
  if (has(entity, 'passwordResetOtpExpiresAt')) {
    userDoc.passwordResetOtpExpiresAt = entity.passwordResetOtpExpiresAt;
  }
  if (has(entity, 'refreshToken')) userDoc.refreshToken = entity.refreshToken;
  if (has(entity, 'deviceToken')) userDoc.deviceToken = entity.deviceToken;
};

const save = async (entity) => {
  if (!entity) {
    return null;
  }

  const userId = entity.id || entity._id;
  if (!userId) {
    return null;
  }

  const userDoc = await User.findById(userId);
  if (!userDoc) {
    return null;
  }

  applyUserEntity(userDoc, entity);
  await userDoc.save();
  return toEntity(userDoc);
};

const isPasswordValid = async (entity, password) =>
  bcrypt.compare(password, entity && entity.password ? entity.password : '');

module.exports = {
  findByEmail,
  findById,
  findBySocialLogin,
  create,
  save,
  isPasswordValid
};
