/* eslint-env node */
// Vercel / Netlify-style serverless function for analytics summary
// This is a mock implementation - in production, this would query a database (Prisma)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock data - in production, this would query Prisma database
    // Example: const payments = await prisma.payment.findMany();
    const mockData = {
      totalRevenue: '12,450.00',
      payingUsers: 42,
      transactions: 156,
    };

    return res.status(200).json(mockData);
  } catch (err) {
    console.error('Analytics summary error:', err);
    return res.status(500).json({ error: 'Failed to get analytics summary' });
  }
}
