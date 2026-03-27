const { Connection, Notification } = require('../models');

const sendConnectionRequest = async (userId, recipientId) => {
  if (recipientId === userId.toString()) {
    const error = new Error('Cannot send connection to yourself');
    error.status = 400;
    throw error;
  }

  const existingConnection = await Connection.findOne({
    $or: [
      { requesterId: userId, recipientId },
      { requesterId: recipientId, recipientId: userId },
    ],
  });

  if (existingConnection) {
    const error = new Error('Connection request already exists');
    error.status = 400;
    throw error;
  }

  const connection = await Connection.create({
    requesterId: userId,
    recipientId,
  });

  await Notification.create({
    userId: recipientId,
    type: 'connection_request',
    relatedUserId: userId,
  });

  return connection;
};

const handleConnectionRequest = async (userId, connectionId, action) => {
  const connection = await Connection.findById(connectionId);

  if (!connection) {
    const error = new Error('Connection request not found');
    error.status = 404;
    throw error;
  }

  if (connection.recipientId.toString() !== userId.toString()) {
    const error = new Error('Not authorized to handle this request');
    error.status = 401;
    throw error;
  }

  if (action === 'accept') {
    connection.status = 'accepted';
    await connection.save();

    await Notification.create({
      userId: connection.requesterId,
      type: 'request_accepted',
      relatedUserId: userId,
    });

    return { message: 'Connection accepted', connection };
  } else if (action === 'reject') {
    connection.status = 'rejected';
    await connection.save();

    await Notification.create({
      userId: connection.requesterId,
      type: 'request_rejected',
      relatedUserId: userId,
    });

    return { message: 'Connection rejected', connection };
  } else {
    const error = new Error('Invalid action');
    error.status = 400;
    throw error;
  }
};

const getConnections = async (userId) => {
  const connections = await Connection.find({
    $or: [{ requesterId: userId }, { recipientId: userId }],
  }).populate('requesterId', 'firstName lastName profileImage')
    .populate('recipientId', 'firstName lastName profileImage');

  return connections;
};

module.exports = {
  sendConnectionRequest,
  handleConnectionRequest,
  getConnections,
};
