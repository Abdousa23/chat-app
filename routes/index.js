const express = require('express')
const router = express.Router()
const register = require('./register');
const refreshToken = require('./refresh');
const auth = require('./auth');
const logout = require('./logout');
const rooms = require('./rooms');
const verifyJWT = require('../middlewares/verifyJWT');
// adding middlewares to secure routes and verify token (when testing i just used the users username when securing them i will get the actuall user from the req.user)
router.use('/login', auth);
router.use('/refresh', refreshToken);
router.use('/logout', logout);
router.use('/register', register);
// router.use('/rooms', verifyJWT, rooms) when using jwt uncomment this

router.use('/rooms', rooms)

module.exports = router