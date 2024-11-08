const router = require('express').Router()
const roomsController = require('../controllers/roomsController')
require('dotenv').config()

router.post('/', roomsController.createRoom)
router.post('/:id/join', roomsController.joinRoom)
router.post('/:id/leave', roomsController.leaveRoom)
router.get('/', roomsController.getRooms)
router.get('/:id/messages', roomsController.getHistory)
module.exports = router