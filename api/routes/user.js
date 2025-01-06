const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

router.post('/register', UserController.user_register);

router.post('/login', UserController.user_login);

router.delete('/:userId', UserController.user_delete);

module.exports = router;