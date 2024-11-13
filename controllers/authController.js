const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    // check for missing data
    if (!username || !password)
        return res.status(400).json({ 'message': 'Bad Request... Both username and password are required.' });

    const foundUser = await User.findOne({ username }).exec(); // Notice: no need to type `username: username` if both are letterally same.
    if (!foundUser)
        return res.sendStatus(401); // unauthorized

    // check for password matching
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                    // note: we don't need to pass it to the refresh token
                    // because the only purpose of refresh token is to get another access token
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60s' } // in industry, it will be more than that, maybe (5-15) minutes.
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // save the tokens with current user
        foundUser.refreshToken = refreshToken;
        const authedUser = await foundUser.save();

        console.log(authedUser); // debug

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); //# production: secure: true
        //^ refresh token mustn't be accessable by js, so we used `httpOnly` option 
        res.json({ accessToken }); // send to the frontend to handle it
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin }