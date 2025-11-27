# 🧠 AI Listing Generator Documentation

## Overview

The AI Listing Generator uses **OpenAI's GPT-4o Vision** model to analyze product photos (especially clothing tags) and automatically generate structured listing data for resale platforms like Poshmark, eBay, Mercari, and more.

## Key Features

- 📸 **Tag Reading**: Analyzes clothing tags to extract brand, size, fabric content
- 🎨 **Visual Analysis**: Identifies colors, condition, and product category from photos
- ✍️ **SEO Optimization**: Generates keyword-rich titles and descriptions
- 💰 **Price Suggestions**: Estimates realistic resale prices based on brand and item type
- ⚡ **Fast Processing**: Typically completes in 3-5 seconds per image

## API Endpoint

### `POST /api/ai/generate-listing`

Generates structured listing data from a product image URL.

#### Request Body

```json
{
  "imageUrl": "https://your-image-host.com/product-photo.jpg"
}
```

**Important**: The image must be publicly accessible via HTTPS. Use Cloudinary, Imgur, or the `/api/media/process` endpoint to host your images first.

#### Response (Success)

```json
{
  "success": true,
  "data": {
    "title": "Patagonia Better Sweater 1/4 Zip Fleece Pullover Men's Large Gray",
    "description": "High-quality Patagonia Better Sweater fleece in excellent pre-owned condition. Features:\n• 1/4 zip pullover style\n• Soft fleece material\n• Men's size Large\n• Color: Heather Gray\n• No visible stains or damage\n• Pet-free, smoke-free home",
    "brand": "Patagonia",
    "size": "L",
    "color": "Heather Gray",
    "category": "Men's Fleece & Jackets",
    "condition": "LIKE NEW",
    "suggestedPrice": 45
  },
  "tokensUsed": 892
}
```

#### Response (Error)

```json
{
  "error": "Failed to generate listing data",
  "details": "Invalid image URL or model unavailable"
}
```

## Usage Examples

### JavaScript/Fetch

```javascript
const response = await fetch('/api/ai/generate-listing', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageUrl: 'https://res.cloudinary.com/your-cloud/image/upload/product.jpg',
  }),
});

const result = await response.json();
console.log('Generated Title:', result.data.title);
console.log('Suggested Price:', result.data.suggestedPrice);
```

### cURL

```bash
curl -X POST https://www.photo2profit.online/api/ai/generate-listing \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/product.jpg"}'
```

### Complete Workflow Example

```javascript
// 1. Remove background from product photo
const bgRemovalResponse = await fetch('/api/images/remove-background', {
  method: 'POST',
  body: formData, // Contains the image file
});
const { processedImageUrl } = await bgRemovalResponse.json();

// 2. Generate listing data with AI
const listingResponse = await fetch('/api/ai/generate-listing', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ imageUrl: processedImageUrl }),
});
const { data } = await listingResponse.json();

// 3. Post to multiple platforms
await fetch('/api/post/reseller_blast', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    title: data.title,
    description: data.description,
    price: data.suggestedPrice,
    images: [processedImageUrl],
  }),
});
```

## Environment Setup

### Required Environment Variable

```env
OPENAI_API_KEY=sk-proj-your_openai_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys

### Vercel/Production Setup

Add the environment variable in your Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add `OPENAI_API_KEY` with your key
3. Redeploy the project

## Testing the AI Lister

### Option 1: HTML Test Harness

Open `test-ai-lister.html` in a browser:

```bash
# If using a local dev server
npm run dev
# Then open: http://localhost:5173/test-ai-lister.html
```

The test harness provides:

- Image URL input with sample images
- Real-time AI generation
- Formatted results display
- Raw JSON response inspection
- Token usage tracking

### Option 2: Command Line Test

```bash
# Set your API key
export OPENAI_API_KEY="sk-proj-..."

# Test with a sample image URL
curl -X POST http://localhost:5173/api/ai/generate-listing \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600"}'
```

## How It Works

### 1. System Prompt Engineering

The AI is instructed with a carefully crafted system prompt that:

- Forces JSON output format
- Defines exact field structure
- Specifies reseller-friendly formatting
- Includes condition assessment guidelines
- Requests realistic pricing estimates

### 2. Vision Analysis

GPT-4o Vision processes the image with `detail: 'high'` to:

- Read small text on clothing tags
- Identify brand logos and labels
- Assess product condition from visual cues
- Detect colors, patterns, and styles

### 3. Structured Output

The model returns a JSON object matching this schema:

```typescript
interface ListingData {
  title: string; // SEO-optimized product title
  description: string; // Bulleted, professional description
  brand: string; // Brand name (or "N/A")
  size: string; // Size from tag (or "N/A")
  color: string; // Dominant color(s)
  category: string; // Best-fit category for listing
  condition: string; // NEW | LIKE NEW | GOOD | FAIR
  suggestedPrice: number; // USD integer estimate
}
```

## Best Practices

### Image Quality Tips

✅ **Do:**

- Use clear, well-lit photos
- Include close-ups of tags when possible
- Show product from multiple angles
- Use high-resolution images (min 600px width)

❌ **Don't:**

- Use blurry or poorly lit photos
- Include multiple products in one image
- Use images with heavy filters or editing

### Prompt Optimization

The current system prompt is optimized for **clothing and accessories**. To customize for other product categories, modify the `SYSTEM_PROMPT` in `/api/ai/generate-listing.js`:

```javascript
const SYSTEM_PROMPT = `
You are an expert e-commerce reseller tool for [YOUR CATEGORY].
Your job is to analyze images of [YOUR PRODUCT TYPE]...
`;
```

### Cost Management

- Each request costs approximately **0.01-0.03 USD** depending on image size
- Use the `tokensUsed` field to track API consumption
- Consider caching results for identical images
- Set up billing alerts in OpenAI dashboard

## Error Handling

| Error                        | Cause                                  | Solution                        |
| ---------------------------- | -------------------------------------- | ------------------------------- |
| `imageUrl is required`       | Missing URL in request body            | Include `imageUrl` field        |
| `GPT-4 Vision not available` | Invalid API key or no access to gpt-4o | Verify API key and model access |
| `Failed to generate listing` | Network error or invalid image         | Check image URL is accessible   |
| `Parsing error`              | AI returned non-JSON                   | Retry request (rare occurrence) |

## Performance Metrics

- **Average Response Time**: 3-5 seconds
- **Token Usage**: 500-1500 tokens per request
- **Success Rate**: >95% with clear images
- **Model**: GPT-4o (vision-enabled)

## Roadmap

Future enhancements planned:

- [ ] Batch processing for multiple images
- [ ] Custom prompt templates per product category
- [ ] Fine-tuned model for specific brands
- [ ] Automatic competitive pricing research
- [ ] Multi-language support for international resale

## Support

For issues or questions:

1. Check the error message details in the API response
2. Verify your OpenAI API key has GPT-4o access
3. Test with the HTML harness for easier debugging
4. Review OpenAI usage dashboard for quota/billing issues

---

**Pro Tip**: Combine the AI Lister with the background removal API (`/api/media/process`) for the ultimate automation workflow:

```
Upload Photo → Remove Background → AI Analysis → Multi-Platform Posting
```

This creates a complete hands-free listing pipeline for resellers! 🚀
