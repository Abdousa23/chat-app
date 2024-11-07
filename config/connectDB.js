const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = connectDB;