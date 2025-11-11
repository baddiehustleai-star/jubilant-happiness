import express from 'express';
import prisma from '../config/prisma.js';
import { generateProductSEO } from '../services/seoMagic.service.js';
import { generateImageAlt } from '../services/imageCaption.service.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) return res.status(404).send('Product not found');

    const seo = await generateProductSEO(listing);
    const imageUrl = listing.imageCleaned || listing.imageUrl || listing.image;
    const imageMeta = await generateImageAlt(imageUrl, listing.title, listing.description);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${seo.title}</title>
          <meta name="description" content="${seo.description}">
          <meta name="keywords" content="${seo.keywords.join(', ')}">
          <meta property="og:title" content="${seo.title}" />
          <meta property="og:description" content="${seo.description}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}" />
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${seo.title}">
          <meta name="twitter:description" content="${seo.description}">
          <meta name="twitter:image" content="${imageUrl}">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fafafa; margin: 0; padding: 20px; }
            .card { max-width: 520px; margin: 40px auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); overflow: hidden; }
            img { width: 100%; height: auto; }
            h1 { font-size: 1.4rem; margin: 16px; }
            p { margin: 0 16px 16px; color: #444; }
            .prices { display: flex; gap: 12px; margin: 16px; }
            .price { flex: 1; background: #f3f3f3; border-radius: 8px; padding: 8px; text-align: center; }
            .hashtags { font-size: 0.85rem; color: #777; margin: 0 16px 12px; }
            .share { text-align: center; margin: 20px; }
            button { background: #111; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; }
            .caption { font-size: 0.9rem; color: #666; margin: 0 16px 12px; }
          </style>
        </head>
        <body>
          <div class="card">
            <img src="${imageUrl}" alt="${imageMeta.alt}" title="${imageMeta.caption}">
            <h1>${seo.title}</h1>
            <p>${listing.description}</p>
            ${seo.hashtags?.length ? `<p class="hashtags">${seo.hashtags.join(' ')}</p>` : ''}
            <p class="caption">${imageMeta.caption}</p>
            <div class="prices">
              <div class="price"><strong>Used:</strong><br>$${listing.price_used || '—'}</div>
              <div class="price"><strong>Marketplace:</strong><br>$${listing.price_market || listing.price || '—'}</div>
              <div class="price"><strong>New:</strong><br>$${listing.price_new || '—'}</div>
            </div>
            <div class="share">
              <button onclick="navigator.share ? navigator.share({title: '${seo.title}', url: window.location.href}) : alert('Copy link: ' + window.location.href)">Share</button>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error loading product page');
  }
});

export default router;
