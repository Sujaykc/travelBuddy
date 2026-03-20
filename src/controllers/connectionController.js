const { Connection, Notification } = require('../models');

const sendConnectionRequest = async (req, res, next) => {
  try {
    const { recipientId } = req.body;

    if (recipientId === req.user._id.toString()) {
      res.status(400);
      throw new Error('Cannot send connection to yourself');
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { requesterId: req.user._id, recipientId },
        { requesterId: recipientId, recipientId: req.user._id },
      ],
    });

    if (existingConnection) {
      res.status(400);
      throw new Error('Connection request already exists');
    }

    const connection = await Connection.create({
      requesterId: req.user._id,
      recipientId,
    });

    await Notification.create({
      userId: recipientId,
      type: 'connection_request',
      relatedUserId: req.user._id,
    });

    res.status(201).json(connection);
  } catch (error) {
    next(error);
  }
};

const handleConnectionRequest = async (req, res, next) => {
  try {
    const { action } = req.body;
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      res.status(404);
      throw new Error('Connection request not found');
    }

    if (connection.recipientId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to handle this request');
    }

    if (action === 'accept') {
      connection.status = 'accepted';
      await connection.save();

      await Notification.create({
        userId: connection.requesterId,
        type: 'request_accepted',
        relatedUserId: req.user._id,
      });

      res.json({ message: 'Connection accepted', connection });
    } else if (action === 'reject') {
      connection.status = 'rejected';
      await connection.save();

      await Notification.create({
        userId: connection.requesterId,
        type: 'request_rejected',
        relatedUserId: req.user._id,
      });

      res.json({ message: 'Connection rejected', connection });
    } else {
      res.status(400);
      throw new Error('Invalid action');
    }
  } catch (error) {
    next(error);
  }
};

const getConnections = async (req, res, next) => {
  try {
    const connections = await Connection.find({
      $or: [{ requesterId: req.user._id }, { recipientId: req.user._id }],
    }).populate('requesterId', 'firstName lastName profileImage')
      .populate('recipientId', 'firstName lastName profileImage');

    res.json(connections);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendConnectionRequest,
  handleConnectionRequest,
  getConnections
};
