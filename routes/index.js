const express = require('express')
const router = express.Router()
const register = require('./register');
const refreshToken = require('./refresh');
const auth = require('./auth');
const logout = require('./logout');
// const chatRoutes = require('./api/chatRoutes')


router.use('/login', auth);
router.use('/refresh', refreshToken);
router.use('/logout', logout);
router.use('/register', register);
// router.use('/chat', chatRoutes);


module.exports = router