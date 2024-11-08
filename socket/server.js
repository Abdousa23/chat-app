const { Server } = require('socket.io');
const http = require('http');
const Room = require('../models/Room');
const Message = require('../models/Message');
const User = require('../models/User');

const initializeSocketServer = (app) => {
    console.log('Initializing socket server');
    const server = http.createServer(app);
    console.log('Server created');
    const io = new Server(server, {
        cors: {
            origin: 'http://127.0.0.1:5500',
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('user Connected ');
        console.log(socket.id);

        socket.on('join_room', async (data) => {
            console.log(data);
            const room = await Room.findOne({ _id: data.room });
            if (room) {
                if (!socket.rooms.has(data.room)) {
                    socket.join(data.room);
                    console.log(`Joined room: ${data.name}`);
                    socket.broadcast.to(data.room).emit('user_joined', { name: data.name });
                    console.log('emitting');
                } else {
                    console.log(`Already in room: ${data.room}`);
                }
            } else {
                console.log(`Room not found: ${data.room}`);
            }
        });

        socket.on('leave_room', (data) => {
            socket.leave(data.room);
            console.log('user left');
            console.log(data);
            socket.broadcast.to(data.room).emit('user_left', { name: data.name });
        });

        socket.on('send_message', async (data) => {
            console.log('message sent');
            console.log(data);
            if (socket.rooms.has(data.room)) {
                try {
                    const user = await User.findOne({ username: data.name });
                    const message = await Message.create({
                        room: data.room,
                        sender: user,
                        messageContent: data.text,
                    });
                    message.save();
                    const chat = await Room.findById(data.room);
                    chat.members.push(user);
                    chat.messages.push(message);
                    console.log(chat);
                    console.log('message saved');
                    await chat.save();

                    io.to(data.room).emit('receive_message', message);
                } catch (error) {
                    console.error(`Failed to add message: ${error}`);
                }
            } else {
                console.log(`User not in room: ${data.room}`);
            }
        });

        socket.on('typing', (data) => {
            if (socket.rooms.has(data.room)) {
                socket.broadcast.to(data.room).emit('typing_status', { name: data.name });
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    return server;
};

module.exports = initializeSocketServer;