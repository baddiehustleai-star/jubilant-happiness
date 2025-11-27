// Content status management endpoint
// PATCH /api/content-status

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PATCH') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['PATCH', 'OPTIONS'],
    });
  }

  const { id, status, scheduledAt } = req.body;

  // Validation
  const allowedStatuses = ['draft', 'scheduled', 'published', 'archived'];

  if (!id) {
    return res.status(400).json({
      error: 'Content ID required in request body',
      example: { id: 'abc123', status: 'published' },
    });
  }

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status',
      allowed: allowedStatuses,
      received: status,
    });
  }

  // Scheduled status requires timestamp
  if (status === 'scheduled' && !scheduledAt) {
    return res.status(400).json({
      error: 'scheduledAt timestamp required for scheduled status',
      example: { id: 'abc123', status: 'scheduled', scheduledAt: '2025-12-01T10:00:00Z' },
    });
  }

  try {
    // For now, simulate database with in-memory store
    // TODO: Replace with your actual database (Firebase, Supabase, etc.)
    const mockContent = {
      id,
      oldStatus: 'draft', // This would come from your database
      newStatus: status,
      updatedAt: new Date().toISOString(),
      ...(scheduledAt && { scheduledAt }),
    };

    // Log the status change for monitoring/automation
    console.log('Content status change:', {
      id,
      oldStatus: mockContent.oldStatus,
      newStatus: status,
      timestamp: mockContent.updatedAt,
      scheduledAt: scheduledAt || null,
    });

    // TODO: Update in your actual database
    // await updateContentStatus(id, { status, scheduledAt, updatedAt });

    return res.status(200).json({
      success: true,
      id,
      oldStatus: mockContent.oldStatus,
      newStatus: status,
      updatedAt: mockContent.updatedAt,
      ...(scheduledAt && { scheduledAt }),
    });
  } catch (error) {
    console.error('Status update failed:', error);

    return res.status(500).json({
      error: 'Failed to update content status',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

// Vercel configuration
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
