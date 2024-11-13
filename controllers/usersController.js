const User = require('../model/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({'message': 'No users found!'});

    res.json(users);
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id)
        return res.status(400).json({'message': 'Bad Request: user ID is required!'});

    const toDelete = await User.findOne({_id: req.body.id}).exec();
    if (!toDelete)
        return res.status(204).json({'message': `No user matches this id ${req.body.id}!`});

    const result = toDelete.deleteOne({_id: req.body.id});
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.id)
        return res.status(400).json({'message': 'Bad Request: user ID is required!'});

    const user = await User.findOne({_id: req.params.id}).exec();
    if (!user)
        return res.status(204).json({'message': `No user matches this id ${req.params.id}!`});

    res.json(user);
}

module.exports = {
    getAllUsers,
    deleteUser,
    getUser
}