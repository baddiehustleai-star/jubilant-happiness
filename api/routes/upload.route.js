import express from 'express';
import auth from '../middleware/auth.js';
import { describeProductFromImage } from '../services/aiDescribe.service.js';
import { removeBackgroundFromImage } from '../services/removeBg.service.js';
import { getSmartPricing, validatePricing } from '../services/aiPricing.service.js';
import prisma from '../config/prisma.js';

const router = express.Router();

// POST /api/upload
// Body: { imageUrl: string }
// Returns created listing with AI metadata
router.post('/upload', auth, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl required' });
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // 1. Remove background (non-blocking fallback)
    let cleanedImage = null;
    try {
      cleanedImage = await removeBackgroundFromImage(imageUrl);
    } catch (e) {
      console.warn('Background removal failed, continuing with original image:', e.message);
    }

    // 2. AI describe
    let aiData = { title: 'AI Product Title', description: 'Description pending.' };
    try {
      aiData = await describeProductFromImage(imageUrl);
    } catch (e) {
      console.warn('AI description failed, using fallback:', e.message);
    }

    // 3. AI pricing
    let pricing = { used: 20, marketplace: 25, new: 30 };
    try {
      pricing = await getSmartPricing(aiData.title, aiData.description);
      pricing = validatePricing(pricing);
    } catch (e) {
      console.warn('AI pricing failed, using fallback pricing:', e.message);
    }

    // 4. Save listing via Prisma
    const listing = await prisma.listing.create({
      data: {
        userId,
        title: aiData.title,
        description: aiData.description,
        price: pricing.marketplace,
        price_used: pricing.used,
        price_market: pricing.marketplace,
        price_new: pricing.new,
        imageUrl,
        imageCleaned: cleanedImage,
        status: 'draft',
      },
    });

    res.status(201).json({
      success: true,
      listing,
      pricing,
      ai: aiData,
      cleaned: !!cleanedImage,
    });
  } catch (e) {
    console.error('Upload pipeline failed:', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
