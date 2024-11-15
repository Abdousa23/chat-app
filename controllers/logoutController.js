const User = require('../models/User');


const handleLogout = async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(204)
    }
    const refreshToken = cookies.jwt

    try {
        const user = await User.findOne({ refreshToken: refreshToken });
        if (!user) return res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' }).sendStatus(204)
        user.refreshToken = ''
        const result = await user.save()
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false }) //secure: true add it in production
        return res.status(200).json('User has been logged out')
    } catch (error) {
        return res.status(500).json({ error: error, message: "Something went wrong" })
    }
}

module.exports = { handleLogout };