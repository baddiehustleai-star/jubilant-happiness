/* eslint-env node */
// Vercel / Netlify-style serverless function for daily analytics
// This is a mock implementation - in production, this would query a database (Prisma)

import dayjs from 'dayjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock data - in production, this would query Prisma database
    // Example:
    // const payments = await prisma.payment.findMany({
    //   orderBy: { createdAt: 'asc' },
    // });
    // const grouped = {};
    // for (const p of payments) {
    //   const date = dayjs(p.createdAt).format('YYYY-MM-DD');
    //   if (!grouped[date]) grouped[date] = 0;
    //   grouped[date] += p.amount;
    // }

    // Generate mock daily data for the last 30 days
    const data = [];
    const today = dayjs();
    
    for (let i = 29; i >= 0; i--) {
      const date = today.subtract(i, 'day').format('YYYY-MM-DD');
      const total = (Math.random() * 500 + 100).toFixed(2); // Random revenue between $100-$600
      data.push({ date, total });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Daily analytics error:', err);
    return res.status(500).json({ error: 'Failed to get daily analytics' });
  }
}
