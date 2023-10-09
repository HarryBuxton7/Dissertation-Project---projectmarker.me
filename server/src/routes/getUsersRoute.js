const UserModel = require('../models/UserModel');

module.exports = async (req, res) => {

    const users = await UserModel.find();
    users.forEach(user => {
        user.password = undefined;
    });
  res.json(users);
}