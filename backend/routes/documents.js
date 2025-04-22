import express from 'express';
import Document from '../models/Document.js';
import authenticate from '../middleware/authenticateJWT.js';  // Import the middleware

const router = express.Router();

// Get all documents for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.id });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Create a new document
router.post('/', authenticate, async (req, res) => {
  console.log('Request body:', req.body);  // Log the incoming data
  const { title, content } = req.body;
  try {
    const doc = await Document.create({ userId: req.user.id, title, content });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create document' });
  }
});

export default router;
