const express = require('express');
const { sendMessage, getChatHistory } = require('../../v1/app/controllers/chat/chat.controller');
const { protect } = require('../../middlewares');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(sendMessage);

router.route('/:userId')
  .get(getChatHistory);

module.exports = router;
