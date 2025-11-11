import prisma from '../config/prisma.js';

export async function listAuditEvents(req, res) {
  try {
    const { listingId, platform, type, limit = 50, cursor } = req.query;
    const where = {};
    if (listingId) where.listingId = String(listingId);
    if (platform) where.platform = String(platform);
    if (type) where.type = String(type);

    const take = Math.min(parseInt(limit, 10) || 50, 200);

    const results = await prisma.auditEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { skip: 1, cursor: { id: String(cursor) } } : {})
    });

    res.json({ items: results, count: results.length, nextCursor: results.length === take ? results[results.length - 1].id : null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export default { listAuditEvents };
