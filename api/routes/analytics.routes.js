/* eslint-env node */
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/analytics/summary', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany();
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const payingUsers = new Set(payments.map(p => p.email)).size;

    res.json({
      totalRevenue: (totalRevenue / 100).toFixed(2),
      payingUsers,
      transactions: payments.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch analytics' });
  }
});

export default router;
