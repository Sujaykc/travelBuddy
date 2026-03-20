const express = require('express');
const { sendMessage, getChatHistory } = require('../controllers');
const { protect } = require('../middlewares');
const { sendMessageSchema } = require('../validations');

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
  .post(protect, validate(sendMessageSchema), sendMessage);

router.route('/:userId')
  .get(protect, getChatHistory);

module.exports = router;
