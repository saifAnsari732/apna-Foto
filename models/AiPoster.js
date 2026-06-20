const mongoose = require('mongoose');

const AiPosterSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  imageUrl: { type: String, required: true },
  ikFileId: { type: String },
  ikFileName: { type: String },
  model: { type: String, default: 'imagen-4.0-fast-generate-001' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AiPoster', AiPosterSchema);
