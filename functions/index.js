import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import fetch from 'node-fetch';

// 🔄 Auto-process listings when created
export const onListingCreated = onDocumentCreated('listings/{listingId}', async (event) => {
  try {
    const listingId = event.params.listingId;
    const listingData = event.data?.data();

    if (!listingData) {
      logger.error('No listing data found');
      return;
    }

    logger.info(`🔄 Auto-processing new listing: ${listingId}`);

    // Get Cloud Run API URL from environment
    const apiUrl = process.env.CLOUD_RUN_API_URL || 'https://photo2profit-api-uc.a.run.app';

    // Trigger Cloud Run processing
    const response = await fetch(`${apiUrl}/api/process-listing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listingId,
        listingData,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      logger.info(`✅ Listing processed successfully: ${listingId}`, result);
    } else {
      logger.error(`❌ Failed to process listing: ${listingId}`, {
        status: response.status,
        statusText: response.statusText,
      });
    }
  } catch (error) {
    logger.error('Listing processing error:', error);
  }
});

// 🔄 Re-process listings when updated with autoCrossPost flag
export const onListingUpdated = onDocumentUpdated('listings/{listingId}', async (event) => {
  try {
    const listingId = event.params.listingId;
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    if (!beforeData || !afterData) {
      logger.warn('Missing before/after data for listing update');
      return;
    }

    // Only re-process if autoCrossPost was enabled
    const shouldReprocess = !beforeData.autoCrossPost && afterData.autoCrossPost;

    if (shouldReprocess) {
      logger.info(`🔄 Re-processing listing with cross-post enabled: ${listingId}`);

      const apiUrl = process.env.CLOUD_RUN_API_URL || 'https://photo2profit-api-uc.a.run.app';

      const response = await fetch(`${apiUrl}/api/process-listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          listingData: afterData,
        }),
      });

      if (response.ok) {
        logger.info(`✅ Listing re-processed successfully: ${listingId}`);
      } else {
        logger.error(`❌ Failed to re-process listing: ${listingId}`);
      }
    }
  } catch (error) {
    logger.error('Listing update processing error:', error);
  }
});

// 🔔 Send notifications for successful cross-posts
export const onCrossPostComplete = onDocumentUpdated('listings/{listingId}', async (event) => {
  try {
    const listingId = event.params.listingId;
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    if (!beforeData || !afterData) return;

    // Check if cross-posting was just completed
    const wasProcessing = beforeData.status === 'processing';
    const isCompleted = afterData.status === 'completed';
    const hasCrossPostResults =
      afterData.crossPostResults && Object.keys(afterData.crossPostResults).length > 0;

    if (wasProcessing && isCompleted && hasCrossPostResults) {
      logger.info(`🎉 Cross-posting completed for listing: ${listingId}`);

      // Count successful cross-posts
      const results = afterData.crossPostResults;
      const successful = Object.values(results).filter((r) => r.success).length;
      const total = Object.keys(results).length;

      logger.info(`📊 Cross-post results: ${successful}/${total} successful`);

      // Here you could send push notifications, emails, etc.
      // For now, just log the success
    }
  } catch (error) {
    logger.error('Cross-post notification error:', error);
  }
});
