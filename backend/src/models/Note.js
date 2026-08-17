const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Markdown or rich text
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [{ type: String }], // URLs to Cloudinary
  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
