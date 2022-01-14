const express = require('express');

const router = express.Router();
const controllers = require('../controllers/index');
const { authMiddleware } = require('../middlewares/auth.js');

router.post('/login', [], controllers.usersController.login);

module.exports = {
  basePath: '/',
  router,
};
