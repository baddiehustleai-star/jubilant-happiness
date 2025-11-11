import express from 'express';
import { runMonthlySEORefresh } from '../services/seoRefresh.service.js';

const router = express.Router();

// Duplicate convenience route that matches spec exactly: POST /api/seo/refresh
router.post('/api/seo/refresh', async (req, res) => {
  try {
    const auth = req.headers['x-cron-secret'];
    if (auth !== (process.env.CRON_SECRET || process.env.SHARED_WEBHOOK_SECRET)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const size = Math.min(parseInt(req.query.limit || '10', 10), 50);
    const result = await runMonthlySEORefresh(size);
    res.json({ success: true, refreshed: result.count, examined: result.totalExamined, errors: result.errors });
  } catch (e) {
    console.error('SEO refresh failed:', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
