/* eslint-env node */
// Express server for Photo2Profit API
// Deployed to Google Cloud Run at api.photo2profit.app

import express from 'express';
import cors from 'cors';
import healthHandler from './api/health.js';
import checkoutHandler from './api/create-checkout-session.js';
import seoRefreshHandler from './api/seo/refresh.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: [
    'https://photo2profit.app',
    'https://photo2profitbaddie.web.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Helper to convert serverless function handlers to Express middleware
const adaptHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// API Routes
app.get('/api/health', adaptHandler(healthHandler));
app.post('/api/create-checkout-session', adaptHandler(checkoutHandler));
app.post('/api/seo/refresh', adaptHandler(seoRefreshHandler));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Photo2Profit API',
    version: '1.0.0',
    status: 'ok',
    endpoints: {
      health: '/api/health',
      checkout: '/api/create-checkout-session',
      seoRefresh: '/api/seo/refresh'
    },
    docs: 'https://github.com/baddiehustleai-star/jubilant-happiness'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: [
      'GET /api/health',
      'POST /api/create-checkout-session',
      'POST /api/seo/refresh'
    ]
  });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Photo2Profit API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Available at: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
