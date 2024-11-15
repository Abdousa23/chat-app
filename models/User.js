const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
    firstname: {
        type: String,
        required: true,
        maxlength: 20,
        minlength: 2,
    },

    lastname: {
        type: String,
        required: true,
        maxlength: 20,
        minlength: 2
    },
    username: {
        type: String,
        required: true,
        maxlength: 20,
        minlength: 4,
        trim: true
    },
    roles: {
        User: {
            type: Number,
            default: 2000
        },
        Admin: Number,
        Editor: Number,
        School: Number,

    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        // match : /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
    },
    rooms: {
        type: [schema.Types.ObjectId],
        ref: 'Room',
        required: false,
    },
    refreshToken: {
        type: String,
        default: ""
    },
}
    ,
    { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)