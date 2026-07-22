const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const FacultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  qualification: {
    type: String,
    required: true,
    trim: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
  },
  bio: {
    type: String,
  },
});

module.exports = getModel('Faculty', FacultySchema);
