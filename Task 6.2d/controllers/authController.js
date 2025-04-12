const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const newUser = await User.create({ username, email, password, role });
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.', details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect password.' });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'YOUR_JWT_SECRET', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
};

exports.googleCallback = (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'YOUR_JWT_SECRET', { expiresIn: '1h' });
  // For simplicity, return JSON. In production you might redirect with the token.
  res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
};
