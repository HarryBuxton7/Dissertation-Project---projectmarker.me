const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (password.length < 8) {
    return res.status(400).send('Password must be at least 8 characters long');
  }

  // Check if the email already exists in the database
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).send('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

  const model = new UserModel({
    email,
    password: hashedPassword,
    admin: false
  })
  const newModel = await model.save();
  res.json(newModel);
};