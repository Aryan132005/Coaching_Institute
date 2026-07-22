const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  fees: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  faculty: {
    type: String,
    required: true,
    trim: true,
  },
  seatsAvailable: {
    type: Number,
    required: true,
    default: 30,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = getModel('Course', CourseSchema);
