const { Connection } = require('../../models');
const ConnectionEntity = require('./connection.entity');

const toEntity = (connectionDoc) => ConnectionEntity.fromPersistence(connectionDoc);

const create = async (data) => {
  const connection = await Connection.create(data);
  return toEntity(connection);
};

const findById = async (id) => {
  const connection = await Connection.findById(id);
  return toEntity(connection);
};

const findBetween = async (requesterId, recipientId) => {
  const connection = await Connection.findOne({
    $or: [
      { requesterId, recipientId },
      { requesterId: recipientId, recipientId: requesterId }
    ]
  });

  return toEntity(connection);
};

const findAcceptedBetween = async (requesterId, recipientId) => {
  const connection = await Connection.findOne({
    status: 'accepted',
    $or: [
      { requesterId, recipientId },
      { requesterId: recipientId, recipientId: requesterId }
    ]
  });

  return toEntity(connection);
};

const findByUserIdPopulated = async (userId) => {
  const connections = await Connection.find({
    $or: [{ requesterId: userId }, { recipientId: userId }]
  })
    .populate('requesterId', 'firstName lastName profileImage')
    .populate('recipientId', 'firstName lastName profileImage');

  return connections.map(toEntity);
};

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const applyConnectionEntity = (connectionDoc, entity) => {
  if (has(entity, 'status')) connectionDoc.status = entity.status;
};

const save = async (entity) => {
  if (!entity || !entity.id) {
    return null;
  }

  const connectionDoc = await Connection.findById(entity.id);
  if (!connectionDoc) {
    return null;
  }

  applyConnectionEntity(connectionDoc, entity);
  await connectionDoc.save();
  return toEntity(connectionDoc);
};

module.exports = {
  create,
  findById,
  findBetween,
  findAcceptedBetween,
  findByUserIdPopulated,
  save
};
