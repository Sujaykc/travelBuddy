const { Memory } = require('../models');

const createMemory = async (req, res, next) => {
  try {
    const { tripDate, place, images, description } = req.body;

    const memory = await Memory.create({
      userId: req.user._id,
      tripDate,
      place,
      images,
      description,
    });

    res.status(201).json(memory);
  } catch (error) {
    next(error);
  }
};

const getMemories = async (req, res, next) => {
  try {
    const memories = await Memory.find({ userId: req.user._id }).sort({ tripDate: -1 });
    res.json(memories);
  } catch (error) {
    next(error);
  }
};

const getMemoryById = async (req, res, next) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (memory && memory.userId.toString() === req.user._id.toString()) {
      res.json(memory);
    } else {
      res.status(404);
      throw new Error('Memory not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

const updateMemory = async (req, res, next) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (memory && memory.userId.toString() === req.user._id.toString()) {
      memory.tripDate = req.body.tripDate || memory.tripDate;
      memory.place = req.body.place || memory.place;
      memory.images = req.body.images || memory.images;
      memory.description = req.body.description || memory.description;

      const updatedMemory = await memory.save();
      res.json(updatedMemory);
    } else {
      res.status(404);
      throw new Error('Memory not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

const deleteMemory = async (req, res, next) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (memory && memory.userId.toString() === req.user._id.toString()) {
      await memory.deleteOne();
      res.json({ message: 'Memory removed' });
    } else {
      res.status(404);
      throw new Error('Memory not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMemory,
  getMemories,
  getMemoryById,
  updateMemory,
  deleteMemory
};
