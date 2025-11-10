/* eslint-env node */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUser = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: 'Missing email' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
