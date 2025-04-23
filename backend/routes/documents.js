// routes/documents.js
import express from 'express';
import Document from '../models/Document.js';
import authenticate from '../middleware/authenticateJWT.js';

const router = express.Router();

// Get all documents for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.id })
      .sort({ updatedAt: -1 }); // Most recently updated first
    res.json(docs);
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// In your documents.js route file
router.get('/:id', authenticate, async (req, res) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    console.log('Retrieved document:', {
      id: doc._id,
      title: doc.title,
      contentLength: doc.content ? doc.content.length : 0,
      hasContent: !!doc.content
    });
    
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(doc);
  } catch (err) {
    console.error('Error fetching document:', err);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// Create a new document
router.post('/', authenticate, async (req, res) => {
  console.log('Create document request body:', req.body);
  const { title, content } = req.body;
  try {
    const doc = await Document.create({ 
      userId: req.user.id, 
      title: title || 'Untitled Document', 
      content 
    });
    res.json(doc);
  } catch (err) {
    console.error('Error creating document:', err);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// Update an existing document
router.put('/:id', authenticate, async (req, res) => {
  const { title, content } = req.body;
  try {
    const doc = await Document.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, content, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(doc);
  } catch (err) {
    console.error('Error updating document:', err);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// Delete a document
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await Document.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!result) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Error deleting document:', err);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;