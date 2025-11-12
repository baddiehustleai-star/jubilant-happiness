/* eslint-env node */
/* eslint-disable no-undef */
// Health check endpoint for Cloud Run
// This endpoint is used by the frontend-deploy workflow to verify the backend is running

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    status: 'ok',
    service: 'photo2profit-api',
    timestamp: new Date().toISOString(),
  });
}
