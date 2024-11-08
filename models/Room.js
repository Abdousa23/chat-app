const mongoose = require('mongoose')
const schema = mongoose.Schema

const roomSchema = new schema({
    members: {
        type: [schema.Types.ObjectId],
        ref: 'User',
        required: true,
    },
    messages: {
        type: [schema.Types.ObjectId],
        ref: 'Message',
        default: [],
        required: true,
    },
    roomName: {
        type: String,
        required: true,
    },

}
    ,
    { timestamps: true }
)

module.exports = mongoose.model('Room', roomSchema)