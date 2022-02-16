'use strict'
const express = require('express');

const {
    createUser,
    siginUser,
    userLogs
  } = require('../controller/userController');

// const verifyAuth = require('../middleware/verifyAuth');
const router = express.Router();

router.post('/Registration',createUser);
router.post('/login',siginUser);
router.get('/user/logs',userLogs);

module.exports = router;