const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { firstname, lastname, username, email, password, role, phonenumber } = req.body
    if (!username || !email || !password || !firstname || !lastname) {
        return res.status(400).json({ 'message': "All fields are required" })
    }
    try {
        const duplicate = await User.find({ $or: [{ email: email }, { username: username }] });
        if (duplicate.length !== 0) {
            return res.status(409).json({ 'message': "User already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        var roles = {
            User: 2000,
            Admin: 0,
            Editor: 0,
            School: 0
        }
        const newUser = new User({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPass,
            roles: roles,
        })

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err.message);
    }
}

module.exports = { register }