// Content management utilities
// Used by agents and automation systems

export const CONTENT_STATUSES = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export const STATUS_TRANSITIONS = {
  draft: ['scheduled', 'published', 'archived'],
  scheduled: ['draft', 'published', 'archived'],
  published: ['archived'],
  archived: ['draft', 'published'],
};

/**
 * Validate status transition
 */
export function isValidTransition(fromStatus, toStatus) {
  return STATUS_TRANSITIONS[fromStatus]?.includes(toStatus) || false;
}

/**
 * Check if content should be auto-published
 */
export function shouldAutoPublish(content) {
  if (content.status !== 'scheduled') return false;
  if (!content.scheduledAt) return false;

  const now = new Date();
  const scheduled = new Date(content.scheduledAt);

  return scheduled <= now;
}

/**
 * Format content for API response
 */
export function formatContentResponse(content) {
  return {
    id: content.id,
    status: content.status,
    title: content.title || 'Untitled',
    createdAt: content.createdAt,
    updatedAt: content.updatedAt,
    publishedAt: content.publishedAt || null,
    scheduledAt: content.scheduledAt || null,
    metadata: {
      platform: content.platform || 'photo2profit',
      type: content.type || 'image_post',
    },
  };
}

/**
 * Get content by status for automation
 */
export async function getContentByStatus(status) {
  // TODO: Replace with actual database query
  // This is where your agent will query for scheduled content
  console.log(`Getting content with status: ${status}`);
  return [];
}
