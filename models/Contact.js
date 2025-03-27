const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'spam'],
    default: 'pending'
  },
  response: {
    type: String
  },
  respondedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Contact', ContactSchema);