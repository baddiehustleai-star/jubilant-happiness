/* eslint-env node */
/* eslint-disable no-undef */
// Vercel / Netlify-style serverless function to get user data.
// Requires: environment variable DATABASE_URL

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
