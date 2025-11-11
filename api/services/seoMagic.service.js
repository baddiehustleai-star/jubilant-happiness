import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateProductSEO(listing) {
  try {
    const prompt = `
      You are an e-commerce SEO assistant.
      Product title: ${listing.title}
      Description: ${listing.description}
      Generate:
      - A catchy SEO title (max 60 characters)
      - A meta description (max 160 chars)
      - 8 relevant keywords
      - 5 relevant hashtags
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0].message.content;
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    return {
      title:
        lines
          .find((l) => l.toLowerCase().startsWith('title:'))
          ?.replace(/title:/i, '')
          .trim() || listing.title,
      description:
        lines
          .find((l) => l.toLowerCase().startsWith('description:'))
          ?.replace(/description:/i, '')
          .trim() || listing.description,
      keywords:
        lines
          .find((l) => l.toLowerCase().startsWith('keywords:'))
          ?.replace(/keywords:/i, '')
          .split(',')
          .map((k) => k.trim()) || [],
      hashtags:
        lines
          .find((l) => l.toLowerCase().startsWith('hashtags:'))
          ?.replace(/hashtags:/i, '')
          .split(' ')
          .map((h) => h.trim()) || [],
    };
  } catch (e) {
    console.error('SEO generation failed:', e);
    return {
      title: listing.title,
      description: listing.description,
      keywords: [],
      hashtags: [],
    };
  }
}

export default { generateProductSEO };
