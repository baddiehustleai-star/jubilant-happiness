import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateImageAlt(imageUrl, title, description) {
  try {
    const prompt = `
      You are an e-commerce vision assistant.
      The image URL is ${imageUrl}.
      The product title is "${title}".
      The description is "${description}".

      Create:
      1. A concise alt text (≤120 characters) describing the image clearly.
      2. A one-sentence image caption suitable for SEO.
    `;

    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    });

    const text = resp.choices[0].message.content;
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    return {
      alt: lines.find((l) => l.toLowerCase().startsWith('alt'))?.replace(/alt[:\-]/i, '').trim() || title,
      caption:
        lines
          .find((l) => l.toLowerCase().startsWith('caption'))
          ?.replace(/caption[:\-]/i, '')
          .trim() || description
    };
  } catch (e) {
    console.error('Image caption generation failed:', e);
    return { alt: title, caption: description };
  }
}

export default { generateImageAlt };
