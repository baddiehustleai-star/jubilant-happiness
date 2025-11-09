import prisma from '../config/prisma.js';

export async function saveEbayAuth(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { access_token, refresh_token, meta } = req.body || {};
  const account = await prisma.marketplaceAccount.upsert({
    where: { userId_platform: { userId, platform: 'ebay' } },
    update: { accessToken: access_token, refreshToken: refresh_token, meta },
    create: { userId, platform: 'ebay', accessToken: access_token, refreshToken: refresh_token, meta }
  });
  res.json(account);
}

export default { saveEbayAuth };
