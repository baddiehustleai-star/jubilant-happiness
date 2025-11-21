import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import formidable from 'formidable';
import fs from 'fs';

// Initialize Firebase Admin
let app;
try {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
} catch {
  app = initializeApp();
}

const storage = getStorage(app);
const db = getFirestore(app);
const bucket = storage.bucket();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true,
      multiples: true,
    });

    const [fields, files] = await form.parse(req);
    const userId = fields.userId?.[0];
    const optimize = fields.optimize?.[0] === 'true';
    const removeBackground = fields.removeBackground?.[0] === 'true';

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check user's upload limits
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    const photosUsed = userData.photosUsed || 0;
    const photosLimit = userData.photosLimit || 10;

    if (photosUsed >= photosLimit && photosLimit !== -1) {
      return res.status(403).json({
        error: 'Upload limit exceeded',
        limit: photosLimit,
        used: photosUsed,
      });
    }

    const uploadedFiles = Array.isArray(files.photos)
      ? files.photos
      : [files.photos].filter(Boolean);

    if (!uploadedFiles.length) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const results = [];

    for (const file of uploadedFiles) {
      try {
        const fileBuffer = fs.readFileSync(file.filepath);
        const originalSize = file.size;
        const fileName = `${Date.now()}_${file.originalFilename}`;
        const filePath = `uploads/${userId}/${fileName}`;

        // Upload original file to Firebase Storage
        const fileRef = bucket.file(filePath);
        await fileRef.save(fileBuffer, {
          metadata: {
            contentType: file.mimetype,
            metadata: {
              userId: userId,
              originalName: file.originalFilename,
              uploadDate: new Date().toISOString(),
            },
          },
        });

        // Make file publicly readable
        await fileRef.makePublic();

        let processedUrl = null;
        let optimizedSize = originalSize;
        let savings = 0;

        // Process image if requested
        if (optimize || removeBackground) {
          const processedBuffer = await processImage(fileBuffer, {
            optimize,
            removeBackground,
            mimetype: file.mimetype,
          });

          if (processedBuffer) {
            optimizedSize = processedBuffer.length;
            savings = Math.round(((originalSize - optimizedSize) / originalSize) * 100);

            const processedFileName = `processed_${fileName}`;
            const processedPath = `processed/${userId}/${processedFileName}`;
            const processedRef = bucket.file(processedPath);

            await processedRef.save(processedBuffer, {
              metadata: {
                contentType: file.mimetype,
                metadata: {
                  userId: userId,
                  originalName: file.originalFilename,
                  processDate: new Date().toISOString(),
                  optimized: optimize,
                  backgroundRemoved: removeBackground,
                },
              },
            });

            await processedRef.makePublic();
            processedUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${processedPath}`;
          }
        }

        // Save to Firestore
        const photoDoc = {
          userId: userId,
          fileName: fileName,
          originalName: file.originalFilename,
          originalSize: originalSize,
          optimizedSize: optimizedSize,
          savings: savings,
          mimetype: file.mimetype,
          originalUrl: `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filePath}`,
          processedUrl: processedUrl,
          uploadDate: new Date(),
          tags: [],
          views: 0,
          downloads: 0,
        };

        const docRef = await db.collection('photos').add(photoDoc);

        results.push({
          id: docRef.id,
          ...photoDoc,
          uploadDate: photoDoc.uploadDate.toISOString(),
        });

        // Clean up temp file
        fs.unlinkSync(file.filepath);
      } catch (fileError) {
        console.error('Error processing file:', fileError);
        results.push({
          fileName: file.originalFilename,
          error: 'Failed to process file',
        });
      }
    }

    // Update user's photo count
    await db
      .collection('users')
      .doc(userId)
      .update({
        photosUsed: photosUsed + results.filter((r) => !r.error).length,
      });

    res.status(200).json({
      success: true,
      files: results,
      remaining:
        photosLimit === -1
          ? 'unlimited'
          : photosLimit - (photosUsed + results.filter((r) => !r.error).length),
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

async function processImage(buffer, options) {
  try {
    let processedBuffer = buffer;

    // WebP optimization (simplified - in production use Sharp or similar)
    if (options.optimize) {
      // In a real implementation, you'd use Sharp or similar library
      // For now, we'll simulate compression
      processedBuffer = buffer; // Placeholder
    }

    // Background removal
    if (options.removeBackground) {
      processedBuffer = await removeBackground(processedBuffer);
    }

    return processedBuffer;
  } catch (error) {
    console.error('Image processing error:', error);
    return null;
  }
}

async function removeBackground(imageBuffer) {
  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVEBG_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_file_b64: imageBuffer.toString('base64'),
        size: 'auto',
      }),
    });

    if (!response.ok) {
      throw new Error(`Remove.bg API error: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Background removal error:', error);
    return null;
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable body parser to handle multipart/form-data
  },
};
