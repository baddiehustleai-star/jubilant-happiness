// AI Listing Generator Service - OpenAI/Gemini Integration
class ListingGeneratorService {
  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.preferredProvider = 'openai'; // or 'gemini'
  }

  // Main function to analyze image and generate listing
  async analyzeImageAndGenerateListing(imageUrl, imageFile = null) {
    try {
      console.log('Starting AI analysis for image:', imageUrl);

      // Try OpenAI first, then fallback to Gemini
      let result;
      
      if (this.openaiApiKey && this.preferredProvider === 'openai') {
        try {
          result = await this.analyzeWithOpenAI(imageUrl, imageFile);
        } catch (error) {
          console.warn('OpenAI failed, trying Gemini:', error.message);
          if (this.geminiApiKey) {
            result = await this.analyzeWithGemini(imageUrl, imageFile);
          } else {
            throw error;
          }
        }
      } else if (this.geminiApiKey) {
        try {
          result = await this.analyzeWithGemini(imageUrl, imageFile);
        } catch (error) {
          console.warn('Gemini failed, trying OpenAI:', error.message);
          if (this.openaiApiKey) {
            result = await this.analyzeWithOpenAI(imageUrl, imageFile);
          } else {
            throw error;
          }
        }
      } else {
        // No API keys available, return mock data
        console.warn('No AI API keys configured, using mock data');
        result = this.generateMockListing(imageUrl);
      }

      // Enhance and validate the result
      return this.enhanceListing(result);

    } catch (error) {
      console.error('AI analysis failed:', error);
      // Return mock data as final fallback
      return this.generateMockListing(imageUrl);
    }
  }

  // OpenAI GPT-4 Vision analysis
  async analyzeWithOpenAI(imageUrl, _imageFile) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this product image and generate a detailed listing for resale platforms. Provide a JSON response with the following structure:
{
  "title": "SEO-optimized title (50-80 characters)",
  "description": "Detailed description highlighting key features, condition, and selling points (200-500 words)",
  "category": "Primary category (e.g., Fashion, Electronics, Home, etc.)",
  "subcategory": "Specific subcategory",
  "brand": "Brand name if identifiable",
  "condition": "New, Like New, Excellent, Good, Fair, or Poor",
  "priceRange": {"min": 0, "max": 0},
  "keywords": ["array", "of", "relevant", "tags"],
  "measurements": "Size/dimensions if applicable",
  "materials": "Materials/fabric if applicable",
  "color": "Primary color",
  "features": ["key", "features", "list"],
  "targetMarkets": ["Poshmark", "Mercari", "eBay", "Depop"],
  "confidence": 0.95
}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from OpenAI');
    }

    return JSON.parse(jsonMatch[0]);
  }

  // Google Gemini analysis
  async analyzeWithGemini(imageUrl, imageFile) {
    // Convert image to base64 if needed
    let base64Image = '';
    if (imageFile) {
      base64Image = await this.fileToBase64(imageFile);
    } else {
      // Fetch image and convert to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      base64Image = await this.blobToBase64(blob);
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Analyze this product image and generate a detailed listing for resale platforms. Provide a JSON response with the following structure:
{
  "title": "SEO-optimized title (50-80 characters)",
  "description": "Detailed description highlighting key features, condition, and selling points (200-500 words)",
  "category": "Primary category (e.g., Fashion, Electronics, Home, etc.)",
  "subcategory": "Specific subcategory",
  "brand": "Brand name if identifiable",
  "condition": "New, Like New, Excellent, Good, Fair, or Poor",
  "priceRange": {"min": 0, "max": 0},
  "keywords": ["array", "of", "relevant", "tags"],
  "measurements": "Size/dimensions if applicable",
  "materials": "Materials/fabric if applicable",
  "color": "Primary color",
  "features": ["key", "features", "list"],
  "targetMarkets": ["Poshmark", "Mercari", "eBay", "Depop"],
  "confidence": 0.95
}`
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image.split(',')[1] // Remove data:image/jpeg;base64, prefix
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates[0]?.content?.parts[0]?.text;
    
    if (!content) {
      throw new Error('No content received from Gemini');
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }

    return JSON.parse(jsonMatch[0]);
  }

  // Generate mock listing for demo/fallback
  generateMockListing(_imageUrl) {
    const mockListings = [
      {
        title: 'Vintage Designer Handbag - Excellent Condition',
        description: 'Beautiful vintage designer handbag in excellent condition. Features premium leather construction with gold-tone hardware. Shows minimal wear with authentic craftsmanship and timeless style. Perfect for collectors or everyday use. Comes from smoke-free home.',
        category: 'Fashion',
        subcategory: 'Handbags',
        brand: 'Designer',
        condition: 'Excellent',
        priceRange: { min: 85, max: 125 },
        keywords: ['vintage', 'designer', 'handbag', 'leather', 'luxury', 'authentic'],
        measurements: 'Approximately 12" x 8" x 4"',
        materials: 'Genuine leather with gold-tone hardware',
        color: 'Black',
        features: ['Zipper closure', 'Multiple compartments', 'Adjustable strap'],
        targetMarkets: ['Poshmark', 'Mercari', 'eBay', 'Depop'],
        confidence: 0.95
      },
      {
        title: 'Stylish Sneakers - Like New Condition',
        description: 'Trendy sneakers in like-new condition, worn only a few times. Features comfortable cushioning and durable construction. Perfect for casual wear or athletic activities. No signs of wear on soles. Great addition to any shoe collection.',
        category: 'Fashion',
        subcategory: 'Shoes',
        brand: 'Athletic Brand',
        condition: 'Like New',
        priceRange: { min: 45, max: 75 },
        keywords: ['sneakers', 'athletic', 'casual', 'comfortable', 'trendy'],
        measurements: 'Size 9',
        materials: 'Synthetic and mesh upper',
        color: 'White',
        features: ['Cushioned sole', 'Breathable mesh', 'Lace-up closure'],
        targetMarkets: ['Poshmark', 'Mercari', 'eBay', 'Depop'],
        confidence: 0.90
      },
      {
        title: 'Home Decor Item - Excellent Condition',
        description: 'Beautiful home decor piece in excellent condition. Perfect for adding style to any room. Quality construction with attention to detail. No chips, cracks, or damage. Comes from pet-free, smoke-free home.',
        category: 'Home & Garden',
        subcategory: 'Decor',
        brand: 'Home Brand',
        condition: 'Excellent',
        priceRange: { min: 25, max: 45 },
        keywords: ['home', 'decor', 'decoration', 'interior', 'style'],
        measurements: 'See photos for dimensions',
        materials: 'Mixed materials',
        color: 'Multi-color',
        features: ['Decorative', 'Quality construction', 'Versatile style'],
        targetMarkets: ['Mercari', 'eBay', 'Facebook Marketplace'],
        confidence: 0.85
      }
    ];

    // Return a random mock listing
    return mockListings[Math.floor(Math.random() * mockListings.length)];
  }

  // Enhance and validate the listing
  enhanceListing(listing) {
    // Add pricing intelligence
    listing.priceRange = this.optimizePricing(listing);
    
    // Optimize title for SEO
    listing.optimizedTitle = this.optimizeTitle(listing.title, listing.keywords);
    
    // Add platform-specific recommendations
    listing.platformRecommendations = this.getPlatformRecommendations(listing);
    
    // Add SEO score
    listing.seoScore = this.calculateSEOScore(listing);
    
    // Add estimated processing time
    listing.processedAt = new Date().toISOString();
    
    return listing;
  }

  // Optimize pricing based on category and condition
  optimizePricing(listing) {
    const { category, condition, priceRange } = listing;
    
    // Price adjustment factors
    const conditionMultipliers = {
      'New': 1.0,
      'Like New': 0.85,
      'Excellent': 0.75,
      'Good': 0.60,
      'Fair': 0.40,
      'Poor': 0.25
    };
    
    const categoryFactors = {
      'Fashion': 1.2,
      'Electronics': 1.1,
      'Home & Garden': 0.9,
      'Collectibles': 1.3,
      'Sports': 1.0
    };
    
    const conditionFactor = conditionMultipliers[condition] || 0.75;
    const categoryFactor = categoryFactors[category] || 1.0;
    
    const adjustedMin = Math.round(priceRange.min * conditionFactor * categoryFactor);
    const adjustedMax = Math.round(priceRange.max * conditionFactor * categoryFactor);
    
    return {
      min: Math.max(5, adjustedMin), // Minimum $5
      max: Math.max(adjustedMin + 5, adjustedMax),
      recommended: Math.round((adjustedMin + adjustedMax) / 2)
    };
  }

  // Optimize title for SEO and character limits
  optimizeTitle(title, keywords) {
    // Platform character limits
    const limits = {
      poshmark: 80,
      mercari: 80,
      ebay: 80,
      depop: 100
    };
    
    // Add top keywords if not already present
    let optimizedTitle = title;
    const titleLower = title.toLowerCase();
    
    keywords.slice(0, 3).forEach(keyword => {
      if (!titleLower.includes(keyword.toLowerCase()) && optimizedTitle.length + keyword.length + 3 < limits.poshmark) {
        optimizedTitle += ` ${keyword}`;
      }
    });
    
    return optimizedTitle.length > limits.poshmark 
      ? optimizedTitle.substring(0, limits.poshmark - 3) + '...'
      : optimizedTitle;
  }

  // Get platform-specific recommendations
  getPlatformRecommendations(listing) {
    return {
      poshmark: {
        recommended: listing.category === 'Fashion',
        tips: ['Add brand story', 'Use lifestyle photos', 'Share to parties'],
        priceAdjustment: 1.1 // 10% higher for fashion
      },
      mercari: {
        recommended: true,
        tips: ['Fast shipping', 'Competitive pricing', 'Clear photos'],
        priceAdjustment: 0.95 // 5% lower for quick sales
      },
      ebay: {
        recommended: listing.category !== 'Fashion',
        tips: ['Detailed specs', 'Multiple photos', 'Return policy'],
        priceAdjustment: 1.0
      },
      depop: {
        recommended: listing.category === 'Fashion' && ['vintage', 'trendy', 'unique'].some(k => 
          listing.keywords.includes(k)
        ),
        tips: ['Aesthetic photos', 'Hashtag strategy', 'Story telling'],
        priceAdjustment: 1.05
      }
    };
  }

  // Calculate SEO score
  calculateSEOScore(listing) {
    let score = 0;
    
    // Title optimization (30 points)
    if (listing.title.length >= 40 && listing.title.length <= 80) score += 15;
    if (listing.keywords.some(k => listing.title.toLowerCase().includes(k.toLowerCase()))) score += 15;
    
    // Description quality (25 points)
    if (listing.description.length >= 200) score += 10;
    if (listing.description.length <= 500) score += 5;
    if (listing.keywords.some(k => listing.description.toLowerCase().includes(k.toLowerCase()))) score += 10;
    
    // Keyword optimization (20 points)
    if (listing.keywords.length >= 5) score += 10;
    if (listing.keywords.length <= 10) score += 10;
    
    // Category and condition (15 points)
    if (listing.category && listing.condition) score += 15;
    
    // Additional details (10 points)
    if (listing.brand && listing.brand !== 'Unknown') score += 5;
    if (listing.measurements || listing.materials) score += 5;
    
    return {
      score,
      grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
      suggestions: this.getSEOSuggestions(score, listing)
    };
  }

  // Get SEO improvement suggestions
  getSEOSuggestions(score, listing) {
    const suggestions = [];
    
    if (listing.title.length < 40) {
      suggestions.push('Add more descriptive words to your title');
    }
    if (listing.description.length < 200) {
      suggestions.push('Expand your description with more details');
    }
    if (listing.keywords.length < 5) {
      suggestions.push('Add more relevant keywords');
    }
    if (!listing.brand || listing.brand === 'Unknown') {
      suggestions.push('Identify and add the brand name if possible');
    }
    if (!listing.measurements && !listing.materials) {
      suggestions.push('Add size, dimensions, or material information');
    }
    
    return suggestions;
  }

  // Helper function to convert file to base64
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Helper function to convert blob to base64
  async blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Test API connection
  async testConnection() {
    const testResults = {
      openai: false,
      gemini: false,
      error: null
    };

    try {
      if (this.openaiApiKey) {
        // Test OpenAI connection
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${this.openaiApiKey}` }
        });
        testResults.openai = response.ok;
      }

      if (this.geminiApiKey) {
        // Test Gemini connection
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.geminiApiKey}`);
        testResults.gemini = response.ok;
      }
    } catch (error) {
      testResults.error = error.message;
    }

    return testResults;
  }
}

// Export singleton instance
export const listingGeneratorService = new ListingGeneratorService();