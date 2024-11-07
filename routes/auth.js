const router = require('express').Router();
const authController = require('../controllers/authController');

require('dotenv').config();



router.post('/', authController.handleAuth);

module.exports = router;