/* eslint-env node */
// Main Express server for Photo2Profit API
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import checkoutRouter from './routes/checkout.routes.js';
import analyzeRouter from './routes/analyze.routes.js';
import { attachUser } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

// Body parsing middleware
// Note: webhook route needs raw body, so we handle it separately in routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach user middleware (basic auth simulation)
app.use(attachUser);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount routes
app.use('/api', checkoutRouter);
app.use('/api/v2', analyzeRouter);

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Photo2Profit API server running on port ${PORT}`);
    console.log(`   Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
