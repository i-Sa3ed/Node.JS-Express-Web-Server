const User = require('../model/User');

const handleLogout = async (req, res) => {
    //Frontend: on client, also delete the access token.

    const cookies = req.cookies;
    // check for missing cookies or `jwt` property
    if (!cookies?.jwt)
        return res.sendStatus(204); // Success with no content, because we need to remove it actually!

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne( {refreshToken} ).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204);
    }

    // delete refresh token from db 
    foundUser.refreshToken = '';
    const updatedUser = await foundUser.save(); 
    //^ `save` saves the document to the Mongo db
    console.log(updatedUser); // debug

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // add {secure: true} to support https
    res.sendStatus(204);
}

module.exports = { handleLogout }