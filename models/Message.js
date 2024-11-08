const mongoose = require('mongoose')
const schema = mongoose.Schema

const messageSchema = new schema({
    messageContent: {
        type: String,
        required: true,
    },
    sender: {
        type: schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    room: {
        type: schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    }
}
    ,
    { timestamps: true }
)

module.exports = mongoose.model('Message', messageSchema)