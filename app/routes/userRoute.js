'use strict'
const express = require('express');

const {
    createUser,
    siginUser,
  } = require('../controller/userController');

const verifyAuth = require('../middleware/verifyAuth');
const router = express.Router();

router.post('/Registration',verifyAuth,createUser);
router.post('/login',verifyAuth,siginUser);

module.exports = router;