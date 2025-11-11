import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Describe a product from an image URL using Gemini
 * Returns { title, description }
 */
export async function describeProductFromImage(imageUrl) {
  if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');
  if (!imageUrl) throw new Error('imageUrl required');

  const body = {
    contents: [
      {
        parts: [
          { text: 'Describe this product as if for an online marketplace listing. Include a title, description, and key tags.' },
          { inline_data: { mime_type: 'image/jpeg', data: imageUrl } }
        ]
      }
    ]
  };

  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Gemini request failed');

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return parseGeminiDescription(text);
}

function parseGeminiDescription(rawText) {
  const titleMatch = rawText.match(/Title[:\-]?\s*(.*)/i);
  const descMatch = rawText.match(/Description[:\-]?\s*([\s\S]*)/i);

  return {
    title: titleMatch ? titleMatch[1].trim() : 'AI Product Title',
    description: descMatch ? descMatch[1].trim() : rawText.slice(0, 300)
  };
}

export default { describeProductFromImage };
