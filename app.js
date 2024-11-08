const express = require('express');
const app = express();
const dotenv = require('dotenv');
const router = require("./routes/index")
const cookieParser = require('cookie-parser')
const connectDB = require('./config/connectDB');
const cors = require('cors');
const initializeSocketServer = require('./socket/server');
const PORT = process.env.PORT || 3000;
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get('/', (_req, res) => {
    res.send('Welcome to my API');
})


app.use('/api', router);


connectDB()
    .then(() => {
        const server = initializeSocketServer(app);
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })


    .catch((err) => {
        console.error(err.message);
    });  