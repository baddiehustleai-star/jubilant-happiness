// AI listing generation service using OpenAI/Gemini
export class ListingGeneratorService {
  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  }

  // Generate listing using AI image analysis
  async generateListing(imageUrl, userPrompt = '') {
    try {
      // Try OpenAI first, fallback to Gemini
      if (this.openaiApiKey) {
        return await this.generateWithOpenAI(imageUrl, userPrompt);
      } else if (this.geminiApiKey) {
        return await this.generateWithGemini(imageUrl, userPrompt);
      } else {
        // Fallback to mock data for development
        return this.generateMockListing(userPrompt);
      }
    } catch (error) {
      console.error('AI listing generation error:', error);
      // Return fallback listing
      return this.generateFallbackListing(userPrompt);
    }
  }

  // OpenAI GPT-4 Vision implementation
  async generateWithOpenAI(imageUrl, userPrompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this product image and create a compelling resale listing. ${userPrompt || ''}\n\nGenerate:\n1. Title (max 80 chars)\n2. Description (detailed, SEO-friendly)\n3. Category\n4. Condition\n5. Suggested price range\n6. Keywords/tags\n7. Brand (if identifiable)\n\nFormat as JSON.`
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch {
      return this.parseNaturalLanguageResponse(content);
    }
  }

  // Google Gemini implementation
  async generateWithGemini(imageUrl, userPrompt) {
    // Convert image to base64 for Gemini
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const base64 = await this.blobToBase64(imageBlob);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Analyze this product image and create a compelling resale listing. ${userPrompt || ''}\n\nGenerate:\n1. Title (max 80 chars)\n2. Description (detailed, SEO-friendly)\n3. Category\n4. Condition\n5. Suggested price range\n6. Keywords/tags\n7. Brand (if identifiable)\n\nFormat as JSON.`
            },
            {
              inline_data: {
                mime_type: imageBlob.type,
                data: base64.split(',')[1]
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    try {
      return JSON.parse(content);
    } catch {
      return this.parseNaturalLanguageResponse(content);
    }
  }

  // Helper: Convert blob to base64
  blobToBase64(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  // Parse natural language AI response into structured data
  parseNaturalLanguageResponse(content) {
    const lines = content.split('\n');
    const result = {
      title: 'Quality Item for Sale',
      description: content.substring(0, 300) + '...',
      category: 'Other',
      condition: 'Good',
      priceRange: { min: 10, max: 50 },
      keywords: ['quality', 'authentic', 'resale'],
      brand: 'Unknown',
    };

    // Extract title
    const titleMatch = lines.find(line => line.toLowerCase().includes('title'));
    if (titleMatch) {
      result.title = titleMatch.replace(/^.*?title:?\s*/i, '').substring(0, 80);
    }

    // Extract price mentions
    const priceMatch = content.match(/\$(\d+)(?:\s*-\s*\$?(\d+))?/);
    if (priceMatch) {
      result.priceRange = {
        min: parseInt(priceMatch[1]),
        max: priceMatch[2] ? parseInt(priceMatch[2]) : parseInt(priceMatch[1]) * 1.5
      };
    }

    return result;
  }

  // Mock listing for development/testing
  generateMockListing(userPrompt) {
    const mockTitles = [
      'Vintage Designer Item - Excellent Condition',
      'Authentic Brand Name Product - Like New',
      'Quality Fashion Piece - Great for Resale',
      'Rare Find - Perfect Condition',
      'Designer Quality Item - Excellent Value'
    ];

    const mockDescriptions = [
      'Beautiful item in excellent condition. Perfect for fashion lovers and collectors. No visible wear or damage. Comes from smoke-free home. Great investment piece that holds its value well.',
      'Authentic designer item in like-new condition. Minimal signs of wear. Perfect for someone looking for quality at a fraction of retail price. Fast shipping and careful packaging guaranteed.',
      'High-quality fashion piece that never goes out of style. Great condition with normal signs of gentle use. Perfect addition to any wardrobe. Priced to sell quickly.'
    ];

    return {
      title: mockTitles[Math.floor(Math.random() * mockTitles.length)],
      description: mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)] + (userPrompt ? ` ${userPrompt}` : ''),
      category: 'Fashion',
      condition: 'Excellent',
      priceRange: { min: 25, max: 75 },
      keywords: ['authentic', 'designer', 'quality', 'fashion', 'excellent condition'],
      brand: 'Designer Brand',
      confidence: 0.7,
      aiGenerated: true,
    };
  }

  // Fallback listing when AI fails
  generateFallbackListing(userPrompt) {
    return {
      title: 'Quality Item for Sale',
      description: `High-quality item in good condition. ${userPrompt || 'Perfect for resale or personal use. Priced to sell quickly.'}`,
      category: 'Other',
      condition: 'Good',
      priceRange: { min: 15, max: 45 },
      keywords: ['quality', 'good condition', 'resale'],
      brand: 'Unknown',
      confidence: 0.3,
      aiGenerated: false,
    };
  }

  // Generate SEO-optimized keywords
  generateSEOKeywords(category, brand, condition) {
    const baseKeywords = ['authentic', 'quality', 'fast shipping'];
    const categoryKeywords = {
      'Fashion': ['designer', 'style', 'trendy', 'wardrobe'],
      'Electronics': ['working', 'tested', 'tech', 'gadget'],
      'Home': ['decor', 'functional', 'interior', 'lifestyle'],
      'Sports': ['fitness', 'active', 'outdoor', 'equipment'],
    };

    const conditionKeywords = {
      'Excellent': ['like new', 'pristine', 'perfect'],
      'Good': ['gently used', 'minor wear', 'functional'],
      'Fair': ['some wear', 'functional', 'priced accordingly'],
    };

    return [
      ...baseKeywords,
      ...(categoryKeywords[category] || []),
      ...(conditionKeywords[condition] || []),
      brand?.toLowerCase() || '',
    ].filter(Boolean);
  }
}

export const listingGeneratorService = new ListingGeneratorService();