// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Note the .js extension for ES modules

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'yourSuperSecretKey123';

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashed });
    res.json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ message: 'User already exists' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  console.log("JWT_SECRET from env:", JWT_SECRET); // Add this line
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '3d' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

export default router;
