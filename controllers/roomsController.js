const Room = require('../models/Room');
const Message = require('../models/Message');
const User = require('../models/User');
require('dotenv').config();

const createRoom = async (req, res) => {
    const { name, members } = req.body;
    const newRoom = new Room({
        roomName: name,
        members: members
    });
    try {
        const room = await newRoom.save();
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate('messages').populate('members').exec();

        res.status(200).json(rooms);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
const joinRoom = async (req, res) => {
    try {
        const username = req.body.name;
        // const user = req.user; when authentificating you will get the user from the verifying token middleware
        const id = req.params.id;
        const userfound = await User.findOne({ username: username }).exec();
        const room = await Room.findById(id).exec();
        room.members.push(userfound);
        userfound.rooms.push(room);
        await room.save();
        await userfound.save();
        res.status(200).json(room);
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}
const leaveRoom = async (req, res) => {
    try {
        const username = req.body.name;
        // const user = req.user;
        const id = req.params.id;
        const userfound = await User.findOne({ username: username }).exec();
        const room = await Room.findById(id).exec();
        room.members = room.members.filter(member => member !== userfound);
        userfound.rooms = userfound.rooms.filter(room => room !== id);
        await room.save();
        await userfound.save();
        res.status(200).json(room);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
const getHistory = async (req, res) => {

    const id = req.params.id;
    console.log(id)
    const messages = await Message.find({ room: id }).populate('sender').exec();
    console.log(messages)
    res.status(200).json(messages);
}

module.exports = { createRoom, getRooms, joinRoom, leaveRoom, getHistory };


