const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;

    // check for missing data
    if (!username || !password)
        return res.status(400).json({ 'message': 'Bad Request... Both username and password are required.' });

    // check for duplicate
    const duplicate = await User.findOne({ username: username }).exec(); //# ask gemeni
    //^ `exec`: executes the query and returns a promise
    if (duplicate)
        return res.sendStatus(409); // conflict

    try {
        // hash the password
        const hashedPwd = await bcrypt.hash(password, 10);

        // create and store the user
        const createdUser = await User.create({
            "username": username,
            "password": hashedPwd
        });

        console.log(createdUser); // debug
        
        res.status(201).json({ 'message': `New user ${username} is created! ` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser }