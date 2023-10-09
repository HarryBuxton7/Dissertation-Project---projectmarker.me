const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');

module.exports = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by their email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    // Compare the provided password with the stored hash
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send('Invalid email or password');
    }
    // Generate the token with the user's ID and admin status
    const token = jwt.sign({
      id: user._id,
      email: user.email,
      admin: user.admin
    }, process.env.SECRET);

    // Send the token and user ID in the response
    res.json({
      token,
      userID: user.id,
      admin: user.admin
    });
  } catch(err) {
    res.status(500).send('Server error');
  }
};
