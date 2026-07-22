require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Initialize database connection
connectDB();

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/admissions', require('./routes/admissionRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));

// Fallback Route for API
app.get('/', (req, res) => {
  res.json({ message: 'Coaching Institute API Server is running.' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
