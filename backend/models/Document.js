import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Ensure this matches your User model
  title: { type: String, required: true },
  content: { type: String, required: true }
});

const Document = mongoose.model('Document', documentSchema);

export default Document;
