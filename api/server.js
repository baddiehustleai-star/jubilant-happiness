/* eslint-env node */
/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyticsRouter from './routes/analytics.routes.js';
import webhookHandler from './webhook.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Webhook needs raw body for signature verification
app.post('/api/v2/webhook', express.raw({ type: 'application/json' }), webhookHandler);

// Regular JSON parsing for other routes
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v2', analyticsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
