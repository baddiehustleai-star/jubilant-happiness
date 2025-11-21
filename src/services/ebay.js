/**
 * eBay Service (Client-side)
 *
 * Provides client-side interface for eBay listing operations
 * Communicates with server-side API endpoints for actual eBay integration
 */

import { analytics } from '../lib/monitoring.js';

class EbayService {
  constructor() {
    this.baseUrl = '/api/ebay-listings';
  }

  /**
   * Create a new eBay listing
   */
  async createListing(listingData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_listing',
          ...listingData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create listing');
      }

      analytics.track('ebay_listing_created', {
        itemId: result.itemId,
        title: listingData.title,
        price: listingData.price,
        category: listingData.categoryId,
      });

      return result;
    } catch (error) {
      analytics.track('ebay_listing_failed', {
        error: error.message,
        title: listingData.title,
      });
      throw error;
    }
  }

  /**
   * Get eBay categories
   */
  async getCategories(parentCategoryId = null) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_categories',
          parentCategoryId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch categories');
      }

      return result.categories;
    } catch (error) {
      console.error('Failed to fetch eBay categories:', error);
      throw error;
    }
  }

  /**
   * Generate listing data from image analysis
   */
  generateListingFromImage(imageAnalysis, userPreferences = {}) {
    // This would use AI/ML to analyze the image and generate listing data
    // For now, we'll provide a template-based approach

    const {
      detectedObjects = [],
      colors = [],
      estimatedCategory = 'Other',
      suggestedKeywords = [],
    } = imageAnalysis;

    const templates = this.getListingTemplates();
    const template = templates[estimatedCategory] || templates.default;

    return {
      title: this.generateTitle(detectedObjects, colors, suggestedKeywords),
      description: this.generateDescription(template, detectedObjects, colors),
      categoryId: this.getCategoryId(estimatedCategory),
      price: userPreferences.price || template.suggestedPrice,
      itemSpecifics: this.generateItemSpecifics(detectedObjects, colors, estimatedCategory),
      shippingDetails: userPreferences.shipping || template.shipping,
      returnPolicy: userPreferences.returns || template.returns,
    };
  }

  /**
   * Generate SEO-optimized title
   */
  generateTitle(objects, colors, keywords) {
    const mainObject = objects[0] || 'Item';
    const primaryColor = colors[0] || '';
    const keywordString = keywords.slice(0, 3).join(' ');

    // Keep under eBay's 80 character limit
    let title = `${primaryColor} ${mainObject}`.trim();

    if (keywordString && title.length + keywordString.length < 75) {
      title += ` ${keywordString}`;
    }

    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  /**
   * Generate detailed description
   */
  generateDescription(template, objects, colors) {
    return template.description
      .replace('{objects}', objects.join(', '))
      .replace('{colors}', colors.join(', '))
      .replace('{timestamp}', new Date().toLocaleDateString());
  }

  /**
   * Get category ID from detected category
   */
  getCategoryId(category) {
    const categoryMap = {
      Clothing: '11450',
      Electronics: '58058',
      'Pet Supplies': '26395',
      'Home & Garden': '11700',
      Toys: '220',
      Sports: '888',
      Books: '267',
      Other: '99',
    };

    return categoryMap[category] || categoryMap.Other;
  }

  /**
   * Generate item specifics based on analysis
   */
  generateItemSpecifics(objects, colors, category) {
    const specifics = {
      Color: colors,
      Condition: ['New'],
    };

    // Add category-specific item specifics
    if (category === 'Clothing') {
      specifics['Size Type'] = ['Regular'];
      specifics['Department'] = ['Unisex Adult'];
    } else if (category === 'Electronics') {
      specifics['Brand'] = ['Unbranded'];
      specifics['Type'] = objects;
    }

    return specifics;
  }

  /**
   * Get listing templates for different categories
   */
  getListingTemplates() {
    return {
      default: {
        description: `
High-quality item featuring {objects} in {colors}.

✨ Key Features:
• Excellent condition
• Fast shipping
• Satisfaction guaranteed

📦 Shipping:
• Same-day processing
• Tracking provided
• Carefully packaged

🔄 Returns:
• 30-day return policy
• Buyer pays return shipping

Listed on {timestamp} using Photo2Profit automation.
        `,
        suggestedPrice: 19.99,
        shipping: {
          service: 'USPSPriority',
          cost: '5.99',
        },
        returns: {
          accepted: true,
          within: 'Days_30',
          refundOption: 'MoneyBack',
          shippingCostPaidBy: 'Buyer',
        },
      },
      Clothing: {
        description: `
Stylish {colors} clothing item in excellent condition.

✨ Details:
• {objects}
• Colors: {colors}
• Ready to wear

📏 Please check measurements carefully before ordering.

📦 Fast shipping with tracking included!

Listed {timestamp}
        `,
        suggestedPrice: 24.99,
        shipping: { service: 'USPSPriority', cost: '4.99' },
        returns: { accepted: true, within: 'Days_30' },
      },
      Electronics: {
        description: `
{objects} - {colors}

🔧 Specifications:
• Item type: {objects}
• Color: {colors}
• Condition: Excellent

⚡ Features:
• Fully functional
• Tested and verified
• Original packaging (when available)

📦 Secure packaging and fast shipping!

Questions? Message us anytime.

Posted {timestamp}
        `,
        suggestedPrice: 49.99,
        shipping: { service: 'USPSPriority', cost: '7.99' },
        returns: { accepted: true, within: 'Days_14' },
      },
    };
  }

  /**
   * Validate listing data before submission
   */
  validateListingData(data) {
    const errors = [];

    if (!data.title || data.title.length < 5) {
      errors.push('Title must be at least 5 characters long');
    }

    if (data.title && data.title.length > 80) {
      errors.push('Title must be 80 characters or less');
    }

    if (!data.description || data.description.length < 20) {
      errors.push('Description must be at least 20 characters long');
    }

    if (!data.price || data.price <= 0) {
      errors.push('Price must be greater than $0');
    }

    if (!data.categoryId) {
      errors.push('Category must be selected');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const ebayService = new EbayService();
export default ebayService;
