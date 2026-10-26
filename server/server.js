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
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g., mobile apps, curl, uptime bots)
    if (!origin) return callback(null, true);

    // Reflect origin to allow all Render subdomains, local development, and configured CLIENT_URL
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint for Render service uptime monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/admissions', require('./routes/admissionRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));

// Fallback Route for API
app.get('/', (req, res) => {
  res.json({
    message: 'Coaching Institute API Server is running.',
    health: '/api/health'
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
