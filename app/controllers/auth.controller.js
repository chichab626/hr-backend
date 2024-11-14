// controllers/auth.controller.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.users;

// Secret key for JWT (store in environment variables in production)
const JWT_SECRET = 'your-super-secret-key';

// Login handler
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password with the hashed password in the database
    console.log(password, user.password)
    //const isPasswordValid = await bcrypt.compare(password, user.password);
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token (include user id, role, and email in the payload)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send the token and the user's role back
    res.json({ token, role: user.role, user: user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
