const ConnectionEntity = require('../../entities/connection.entity');

const normalizeUserRef = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return { _id: value };
  }

  if (value._id) {
    return {
      _id: value._id.toString(),
      firstName: value.firstName || '',
      lastName: value.lastName || '',
      profileImage: value.profileImage || ''
    };
  }

  return { _id: value.toString() };
};

const toConnectionResponse = (connectionDoc) => {
  const connection = ConnectionEntity.fromPersistence(connectionDoc);

  return {
    _id: connection ? connection.id : null,
    requesterId: normalizeUserRef(connection ? connection.requesterId : null),
    recipientId: normalizeUserRef(connection ? connection.recipientId : null),
    status: connection ? connection.status : 'pending',
    createdAt: connection ? connection.createdAt : null,
    updatedAt: connection ? connection.updatedAt : null
  };
};

const toConnectionListResponse = (connections) =>
  Array.isArray(connections) ? connections.map(toConnectionResponse) : [];

module.exports = {
  toConnectionResponse,
  toConnectionListResponse
};
