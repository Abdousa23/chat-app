const express = require('express');
const app = express();
const dotenv = require('dotenv');
const router = require("./routes/index")
const cookieParser = require('cookie-parser')
const connectDB = require('./config/connectDB');
const cors = require('cors');

// const http = require('http')
// const { Server } = require('socket.io')
// const Message = require('./models/message')
// const Chat = require('./models/chat')
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
// const server = http.createServer(app)

app.get('/', (_req, res) => {
    res.send('Welcome to my API');
})


app.use('/api', router);

// const io = new Server(server, {
//     cors: {
//         origin: 'https://edu-plus-nine.vercel.app',
//         methods: ["GET", "POST"],
//     }
// })
// io.on('connection', (socket) => {
//     socket.on('join_room', (data) => {
//         socket.rooms.forEach(room => {
//             if (room !== socket.id) { // Don't leave the default room
//                 socket.leave(room);
//             }
//         });

//         socket.join(data.id)
//         socket.broadcast.to(data.id).emit('new_user_joined', { name: data.user.username })
//     })

//     socket.on('send_message', async (data) => {
//         socket.broadcast.to(data.id).emit('receive_message', data.message)
//         try {
//             await addingMessage(data) // Use await keyword here
//         } catch (error) {
//             console.error(`Failed to add message: ${error}`)
//         }
//     
// })
// const addingMessage = async (data) => {
//     try {
//         const message = new Message({
//             chatId: data.message.chatId,
//             sender: data.message.sender._id,
//             text: data.message.text,
//         })
//         message.save()
//         const chat = await Chat.findById(data.message.chatId)
//         // chat.members.push(data.message.sender._id)
//         // console.log(chat)
//         chat.save()
//     } catch (err) {
//         console.log(err)
//     }
// }

connectDB()
    .then(() => {
        app.listen(3000, () => {
            console.log(`Server is running on port 3000`);
        });
    })


    .catch((err) => {
        console.error(err.message);
    });  