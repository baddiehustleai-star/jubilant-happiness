// Vision AI service for product recognition using Gemini 1.5 Pro Vision
import { VertexAI } from '@google-cloud/vertexai';
import logger from '../utils/logger.js';

const PROJECT_ID = process.env.GCLOUD_PROJECT || '758851214311';
const LOCATION = 'us-central1';

const vertex = new VertexAI({ project: PROJECT_ID, location: LOCATION });

/**
 * Analyze product image using Gemini 1.5 Pro Vision
 * @param {string} imageUrl - Public URL or base64 data URI of the image
 * @returns {Promise<Object>} - Product analysis with title, category, brand, condition, keywords
 */
export async function analyzeProduct(imageUrl) {
  try {
    const model = vertex.preview.getGenerativeModel({
      model: 'gemini-1.5-pro-002',
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.4,
        topP: 0.95,
      },
    });

    const prompt = `Analyze this product image for resale listing creation. Provide:
1. Product title (concise, SEO-friendly, 60 chars max)
2. Category (clothing, electronics, home, accessories, collectibles, etc.)
3. Brand (if visible/recognizable)
4. Condition estimate (new, like new, good, fair)
5. Key features/keywords (color, material, style, size indicators)
6. Estimated resale value range (USD)

Return JSON only:
{
  "title": "...",
  "category": "...",
  "brand": "...",
  "condition": "...",
  "keywords": ["...", "..."],
  "priceRange": { "min": 0, "max": 0 },
  "confidence": 0.0
}`;

    const imagePart = imageUrl.startsWith('data:')
      ? { inlineData: { data: imageUrl.split(',')[1], mimeType: 'image/jpeg' } }
      : { fileData: { fileUri: imageUrl, mimeType: 'image/jpeg' } };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }, imagePart] }],
    });

    const responseText = result.response.candidates[0].content.parts[0].text;
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;
    
    const analysis = JSON.parse(jsonText);
    
    logger.info('Vision analysis complete', { title: analysis.title, category: analysis.category });
    return {
      success: true,
      data: analysis,
    };
  } catch (error) {
    logger.error('Vision analysis failed', error);
    return {
      success: false,
      error: error.message,
      fallback: {
        title: 'Quality Item for Sale',
        category: 'general',
        brand: 'Unknown',
        condition: 'good',
        keywords: ['resale', 'vintage'],
        priceRange: { min: 10, max: 50 },
        confidence: 0.1,
      },
    };
  }
}

export default { analyzeProduct };
