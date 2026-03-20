const express = require('express');
const {
  createMemory,
  getMemories,
  getMemoryById,
  updateMemory,
  deleteMemory,
} = require('../controllers');
const { protect } = require('../middlewares');
const { createMemorySchema, updateMemorySchema } = require('../validations');

const router = express.Router();

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400);
    return next(new Error(error.details[0].message));
  }
  next();
};

router.route('/')
  .post(protect, validate(createMemorySchema), createMemory)
  .get(protect, getMemories);

router.route('/:id')
  .get(protect, getMemoryById)
  .put(protect, validate(updateMemorySchema), updateMemory)
  .delete(protect, deleteMemory);

module.exports = router;
