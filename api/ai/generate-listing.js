/**
 * AI-Powered Listing Generator for Photo2Profit Resellers
 * Uses GPT-4 Vision to analyze product photos and generate structured listing data
 */

const OpenAI = require('openai').default;

// Initialize OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// THE GOLDEN PROMPT: Makes AI behave as professional reseller tool
const SYSTEM_PROMPT = `
You are an expert e-commerce reseller tool. Your job is to analyze images of clothing, shoes, or accessories (especially clothing tags) and extract structured product data for a listing.

You must output ONLY a raw JSON object. Do not include markdown formatting like \`\`\`json.

Your JSON output must match this exact structure. Use "N/A" if you cannot confidently determine a field from the image.
{
  "title": "Brand + Style + Key Features + Size + Gender",
  "description": "A professional, keyword-rich description suitable for Poshmark/eBay. Include condition details visible, fabric content if on tag, and key features.",
  "brand": "Brand name",
  "size": "Size on tag (e.g., 'M', '10', '34x32')",
  "color": "Dominant color(s)",
  "category": "Best fit category (e.g., 'Men's T-Shirts', 'Women's Dresses')",
  "condition": "NEW, LIKE NEW, GOOD, or FAIR based on visual assessment",
  "suggestedPrice": "An estimated resale price in USD integer based on brand/item type (conservative estimate)."
}

Rules:
- If the image is of a clothing tag, prioritize the data printed on it.
- Title should be SEO friendly: "Patagonia Better Sweater 1/4 Zip Fleece Pullover Men's Large Gray"
- Keep the description professional and bulleted if possible.
- For condition: NEW means tags attached, LIKE NEW means no visible wear, GOOD means minor wear, FAIR means noticeable wear.
- Price should be realistic for resale market, not retail price.
`;

/**
 * Generate listing data from product image
 * POST /api/ai/generate-listing
 */
module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({
      error: 'imageUrl is required',
      hint: 'Use the background removal API first to get a hosted URL',
    });
  }

  try {
    console.log('🧠 Sending image to OpenAI Vision...');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // GPT-4o has vision capabilities
      max_tokens: 1024,
      response_format: { type: 'json_object' }, // Force JSON output
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this image and generate the listing JSON. Look carefully at any tags or labels visible.',
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high', // 'high' allows model to read small text on tags
              },
            },
          ],
        },
      ],
    });

    // Parse the generated JSON string back into an object
    const generatedData = JSON.parse(response.choices[0].message.content);

    console.log('✅ AI generation successful!', {
      brand: generatedData.brand,
      title: generatedData.title?.substring(0, 50) + '...',
    });

    return res.json({
      success: true,
      data: generatedData,
      tokensUsed: response.usage?.total_tokens,
    });
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);

    if (error.message?.includes('model')) {
      return res.status(400).json({
        error: 'GPT-4 Vision not available. Check your OpenAI API key has access to gpt-4o model.',
      });
    }

    return res.status(500).json({
      error: 'Failed to generate listing data',
      details: error.message,
    });
  }
};

module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
