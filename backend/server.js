/* eslint-env node */
/* eslint-disable no-undef */
// Cloud Run backend API for Photo2Profit
// Simple Express server with CORS configuration

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

// Allowed origins for CORS
const allowedOrigins = [
  'https://photo2profitbaddie.web.app',
  'https://photo2profitbaddie.firebaseapp.com',
  'http://localhost:5173', // Local development
  'http://localhost:3000', // Alternative local dev port
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Photo2Profit API is alive!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Additional API endpoints can be added here
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Photo2Profit API running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
