import { generateProductSEO } from './seoMagic.service.js';
import { generateImageAlt } from './imageCaption.service.js';
import prisma from '../config/prisma.js';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

const db = admin.firestore();

/**
 * Minimal monthly SEO refresh routine.
 * - Processes a small batch (default 10) for cost control
 * - Updates listing fields directly + records lastOptimizedAt
 * - Caches augmented metadata in Firestore (seo_cache) for share pages
 */
export async function runMonthlySEORefresh(batchSize = 10) {
  // Fetch small batch for cost control
  const listings = await prisma.listing.findMany({
    where: { archivedAt: null },
    take: batchSize,
    orderBy: { updatedAt: 'desc' },
  });

  const updatedTitles = [];
  const errors = [];

  for (const l of listings) {
    try {
      const imageUrl = l.imageCleaned || l.imageUrl || l.image;
      const seo = await generateProductSEO(l);
      const img = await generateImageAlt(imageUrl, l.title, l.description);

      await prisma.listing.update({
        where: { id: l.id },
        data: {
          title: seo.title,
          description: seo.description,
          seoKeywords: seo.keywords.join(','),
          seoHashtags: seo.hashtags.join(' '),
          imageAlt: img.alt,
          imageCaption: img.caption,
          lastOptimizedAt: new Date(),
        },
      });

      // Mirror into Firestore cache for share pages (kept from previous implementation)
      await db
        .collection('seo_cache')
        .doc(String(l.id))
        .set(
          {
            listingId: String(l.id),
            title: seo.title,
            description: seo.description,
            keywords: seo.keywords,
            hashtags: seo.hashtags,
            imageAlt: img.alt,
            imageCaption: img.caption,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );

      updatedTitles.push(l.title);
    } catch (e) {
      errors.push({ id: l.id, error: e.message });
      // Continue processing remaining listings
    }
  }

  // Send summary email if SMTP and notify envs are configured
  if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.NOTIFY_EMAIL) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const html = `
      <h2>Monthly SEO Refresh Summary</h2>
      <p>${updatedTitles.length} listings refreshed.</p>
      <ul>${updatedTitles.map((t) => `<li>${t}</li>`).join('')}</ul>
      <p>Project: Photo2Profit</p>
    `;

    try {
      await transporter.sendMail({
        from: `"Photo2Profit Bot" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFY_EMAIL,
        subject: 'Photo2Profit Monthly SEO Report',
        html,
      });
    } catch (e) {
      // Log but do not fail the job if email fails
      console.warn('Summary email failed:', e.message);
    }
  }

  return { count: updatedTitles.length, totalExamined: listings.length, errors };
}

export default { runMonthlySEORefresh };
