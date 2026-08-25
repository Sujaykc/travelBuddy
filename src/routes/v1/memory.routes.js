const express = require('express');
const {
  createMemory,
  getMemories,
  getMemoryById,
  updateMemory,
  deleteMemory,
} = require('../../v1/app/controllers/memory/memory.controller');
const { protect } = require('../../middlewares');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createMemory)
  .get(getMemories);

router.route('/:id')
  .get(getMemoryById)
  .put(updateMemory)
  .delete(deleteMemory);

module.exports = router;
