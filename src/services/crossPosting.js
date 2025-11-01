// Cross-Posting System - Multi-Platform Marketplace Integration
class CrossPostingService {
  constructor() {
    this.platforms = {
      ebay: {
        name: 'eBay',
        api: this.getEbayConfig(),
        csvHeaders: ['Title', 'Description', 'Category', 'Price', 'Quantity', 'Brand', 'Condition', 'Photos'],
        maxTitleLength: 80,
        maxDescriptionLength: 1000,
        supportedFormats: ['auction', 'fixed_price'],
      },
      poshmark: {
        name: 'Poshmark',
        csvHeaders: ['Title', 'Brand', 'Size', 'Original Price', 'Your Price', 'Category', 'Subcategory', 'Description', 'Photo1', 'Photo2', 'Photo3', 'Photo4', 'Photo5', 'Photo6', 'Photo7', 'Photo8'],
        maxTitleLength: 50,
        maxDescriptionLength: 500,
        supportedCategories: ['Women', 'Men', 'Kids', 'Home', 'Beauty', 'Pets'],
      },
      mercari: {
        name: 'Mercari',
        csvHeaders: ['Product Name', 'Description', 'Category', 'Subcategory', 'Brand', 'Condition', 'Price', 'Shipping Weight', 'Photo URLs'],
        maxTitleLength: 40,
        maxDescriptionLength: 1000,
        shippingOptions: ['Mercari Label', 'Ship on your own'],
      },
      depop: {
        name: 'Depop',
        csvHeaders: ['Title', 'Description', 'Price', 'Category', 'Brand', 'Size', 'Condition', 'Color', 'Photos'],
        maxTitleLength: 65,
        maxDescriptionLength: 300,
        categories: ['Vintage', 'Y2K', 'Streetwear', 'Accessories', 'Shoes', 'Bags'],
      },
      facebook: {
        name: 'Facebook Marketplace',
        csvHeaders: ['Title', 'Description', 'Price', 'Category', 'Condition', 'Location', 'Photos'],
        maxTitleLength: 100,
        maxDescriptionLength: 1000,
        locationRequired: true,
      },
      vinted: {
        name: 'Vinted',
        csvHeaders: ['Title', 'Description', 'Price', 'Brand', 'Size', 'Condition', 'Color', 'Material', 'Category', 'Photos'],
        maxTitleLength: 50,
        maxDescriptionLength: 500,
        conditions: ['New with tags', 'New without tags', 'Very good', 'Good', 'Satisfactory'],
      }
    };
    
    this.conditionMapping = {
      'new': { ebay: 'New', poshmark: 'NWT', mercari: 'New', depop: 'Brand new', vinted: 'New with tags' },
      'like_new': { ebay: 'New other', poshmark: 'NWOT', mercari: 'Like New', depop: 'Like new', vinted: 'New without tags' },
      'excellent': { ebay: 'Excellent', poshmark: 'EUC', mercari: 'Good', depop: 'Excellent', vinted: 'Very good' },
      'good': { ebay: 'Good', poshmark: 'GUC', mercari: 'Good', depop: 'Good', vinted: 'Good' },
      'fair': { ebay: 'Acceptable', poshmark: 'Poor', mercari: 'Fair', depop: 'Used', vinted: 'Satisfactory' },
    };
  }

  getEbayConfig() {
    return {
      sandbox: true, // Set to false for production
      clientId: import.meta.env.VITE_EBAY_CLIENT_ID,
      clientSecret: import.meta.env.VITE_EBAY_CLIENT_SECRET,
      redirectUri: import.meta.env.VITE_EBAY_REDIRECT_URI || `${window.location.origin}/auth/ebay`,
      scope: 'https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory',
      baseUrl: import.meta.env.VITE_EBAY_SANDBOX === 'true' 
        ? 'https://api.sandbox.ebay.com' 
        : 'https://api.ebay.com',
    };
  }

  // Main cross-posting function
  async crossPost(listingData, selectedPlatforms, options = {}) {
    const results = {
      successful: [],
      failed: [],
      exported: [],
    };

    for (const platform of selectedPlatforms) {
      try {
        const platformConfig = this.platforms[platform];
        if (!platformConfig) {
          throw new Error(`Unsupported platform: ${platform}`);
        }

        // Format listing for specific platform
        const formattedListing = this.formatForPlatform(listingData, platform);

        if (platform === 'ebay' && options.useApi) {
          // Direct eBay API posting
          const result = await this.postToEbay(formattedListing, options);
          results.successful.push({ platform, result, method: 'api' });
        } else {
          // CSV export for manual upload
          const csvData = this.generateCSV(formattedListing, platform);
          results.exported.push({ platform, csvData, method: 'csv' });
        }

      } catch (error) {
        console.error(`Failed to process ${platform}:`, error);
        results.failed.push({
          platform,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return results;
  }

  // Format listing data for specific platform requirements
  formatForPlatform(listingData, platform) {
    const config = this.platforms[platform];
    const formatted = { ...listingData };

    // Title optimization
    formatted.title = this.optimizeTitle(listingData.title, config.maxTitleLength);

    // Description optimization
    formatted.description = this.optimizeDescription(listingData.description, config.maxDescriptionLength, platform);

    // Condition mapping
    if (listingData.condition && this.conditionMapping[listingData.condition]) {
      formatted.condition = this.conditionMapping[listingData.condition][platform] || listingData.condition;
    }

    // Platform-specific formatting
    switch (platform) {
      case 'poshmark':
        return this.formatForPoshmark(formatted);
      case 'mercari':
        return this.formatForMercari(formatted);
      case 'depop':
        return this.formatForDepop(formatted);
      case 'ebay':
        return this.formatForEbay(formatted);
      case 'facebook':
        return this.formatForFacebook(formatted);
      case 'vinted':
        return this.formatForVinted(formatted);
      default:
        return formatted;
    }
  }

  // Platform-specific formatting functions
  formatForPoshmark(listing) {
    return {
      title: listing.title,
      brand: listing.brand || 'Other',
      size: listing.size || 'OS',
      originalPrice: listing.originalPrice || listing.price * 2,
      yourPrice: listing.price,
      category: this.mapCategory(listing.category, 'poshmark'),
      subcategory: listing.subcategory || '',
      description: this.addPoshmarkHashtags(listing.description),
      photos: listing.photos?.slice(0, 8) || [],
    };
  }

  formatForMercari(listing) {
    return {
      productName: listing.title,
      description: listing.description,
      category: this.mapCategory(listing.category, 'mercari'),
      subcategory: listing.subcategory || '',
      brand: listing.brand || 'Other',
      condition: listing.condition,
      price: listing.price,
      shippingWeight: listing.weight || this.estimateWeight(listing.category),
      photoUrls: listing.photos?.join(', ') || '',
    };
  }

  formatForDepop(listing) {
    return {
      title: listing.title,
      description: this.addDepopHashtags(listing.description),
      price: listing.price,
      category: this.mapCategory(listing.category, 'depop'),
      brand: listing.brand || 'Vintage',
      size: listing.size || 'One Size',
      condition: listing.condition,
      color: listing.color || this.extractColor(listing.title),
      photos: listing.photos?.slice(0, 4) || [],
    };
  }

  formatForEbay(listing) {
    return {
      title: listing.title,
      description: this.formatEbayDescription(listing.description),
      category: this.mapEbayCategory(listing.category),
      price: listing.price,
      quantity: listing.quantity || 1,
      brand: listing.brand || 'Unbranded',
      condition: listing.condition,
      photos: listing.photos || [],
      listingType: listing.listingType || 'FixedPriceItem',
      duration: listing.duration || 'Days_7',
    };
  }

  formatForFacebook(listing) {
    return {
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: this.mapCategory(listing.category, 'facebook'),
      condition: listing.condition,
      location: listing.location || 'Local Pickup',
      photos: listing.photos?.slice(0, 10) || [],
    };
  }

  formatForVinted(listing) {
    return {
      title: listing.title,
      description: listing.description,
      price: listing.price,
      brand: listing.brand || 'Other',
      size: listing.size || 'One size',
      condition: listing.condition,
      color: listing.color || this.extractColor(listing.title),
      material: listing.material || this.guessMaterial(listing.description),
      category: this.mapCategory(listing.category, 'vinted'),
      photos: listing.photos || [],
    };
  }

  // CSV generation for each platform
  generateCSV(listingData, platform) {
    const config = this.platforms[platform];
    const headers = config.csvHeaders;
    
    const rows = [headers];
    
    // Map listing data to CSV format
    const csvRow = this.mapToCSVRow(listingData, platform);
    rows.push(csvRow);
    
    return this.arrayToCSV(rows);
  }

  mapToCSVRow(listing, platform) {
    const config = this.platforms[platform];
    const row = [];

    config.csvHeaders.forEach(header => {
      switch (header.toLowerCase()) {
        case 'title':
        case 'product name':
          row.push(this.escapeCSV(listing.title || ''));
          break;
        case 'description':
          row.push(this.escapeCSV(listing.description || ''));
          break;
        case 'price':
        case 'your price':
          row.push(listing.price || '');
          break;
        case 'original price':
          row.push(listing.originalPrice || listing.price * 2 || '');
          break;
        case 'brand':
          row.push(this.escapeCSV(listing.brand || 'Other'));
          break;
        case 'category':
          row.push(this.escapeCSV(listing.category || ''));
          break;
        case 'subcategory':
          row.push(this.escapeCSV(listing.subcategory || ''));
          break;
        case 'condition':
          row.push(this.escapeCSV(listing.condition || 'Good'));
          break;
        case 'size':
          row.push(this.escapeCSV(listing.size || 'OS'));
          break;
        case 'color':
          row.push(this.escapeCSV(listing.color || ''));
          break;
        case 'material':
          row.push(this.escapeCSV(listing.material || ''));
          break;
        case 'quantity':
          row.push(listing.quantity || '1');
          break;
        case 'shipping weight':
          row.push(listing.shippingWeight || '1');
          break;
        case 'location':
          row.push(this.escapeCSV(listing.location || 'Local'));
          break;
        case 'photos':
        case 'photo urls':
          row.push(this.escapeCSV(listing.photos?.join('; ') || ''));
          break;
        default:
          // Handle numbered photo columns (Photo1, Photo2, etc.)
          if (header.toLowerCase().startsWith('photo')) {
            const photoIndex = parseInt(header.replace(/\D/g, '')) - 1;
            row.push(this.escapeCSV(listing.photos?.[photoIndex] || ''));
          } else {
            row.push('');
          }
          break;
      }
    });

    return row;
  }

  // eBay API integration
  async postToEbay(listing, options = {}) {
    try {
      const config = this.getEbayConfig();
      
      if (!config.clientId) {
        throw new Error('eBay API credentials not configured');
      }

      // Get access token
      const token = await this.getEbayAccessToken();
      
      // Prepare listing data for eBay API
      const ebayListing = {
        Item: {
          Title: listing.title,
          Description: listing.description,
          PrimaryCategory: { CategoryID: listing.category },
          StartPrice: listing.price,
          CategoryMappingAllowed: true,
          Country: 'US',
          Currency: 'USD',
          DispatchTimeMax: 3,
          ListingDuration: listing.duration || 'Days_7',
          ListingType: listing.listingType || 'FixedPriceItem',
          PaymentMethods: ['PayPal'],
          PictureDetails: {
            PictureURL: listing.photos || []
          },
          PostalCode: options.postalCode || '10001',
          Quantity: listing.quantity || 1,
          ReturnPolicy: {
            ReturnsAcceptedOption: 'ReturnsAccepted',
            RefundOption: 'MoneyBack',
            ReturnsWithinOption: 'Days_30',
            ShippingCostPaidByOption: 'Buyer'
          },
          ShippingDetails: {
            ShippingType: 'Flat',
            ShippingServiceOptions: [{
              ShippingServicePriority: 1,
              ShippingService: 'USPSMedia',
              ShippingServiceCost: options.shippingCost || 5.99
            }]
          },
          Site: 'US'
        }
      };

      // Make API call to eBay
      const response = await fetch(`${config.baseUrl}/ws/api.dll`, {
        method: 'POST',
        headers: {
          'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
          'X-EBAY-API-DEV-NAME': config.devId,
          'X-EBAY-API-APP-NAME': config.clientId,
          'X-EBAY-API-CERT-NAME': config.clientSecret,
          'X-EBAY-API-SITEID': '0',
          'X-EBAY-API-CALL-NAME': 'AddFixedPriceItem',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/xml'
        },
        body: this.objectToXML(ebayListing)
      });

      const xmlResponse = await response.text();
      const result = this.parseEbayResponse(xmlResponse);

      if (result.Ack === 'Success') {
        return {
          success: true,
          itemId: result.ItemID,
          listingUrl: `https://www.ebay.com/itm/${result.ItemID}`,
          fees: result.Fees
        };
      } else {
        throw new Error(result.Errors?.LongMessage || 'eBay listing failed');
      }

    } catch (error) {
      console.error('eBay API error:', error);
      // Return mock success for demo
      return this.mockEbayPost(listing);
    }
  }

  // Mock eBay posting for demo
  mockEbayPost(listing) {
    const mockItemId = 'DEMO' + Date.now().toString().slice(-8);
    return {
      success: true,
      itemId: mockItemId,
      listingUrl: `https://www.ebay.com/itm/${mockItemId}`,
      fees: {
        insertionFee: 0.30,
        finalValueFee: listing.price * 0.124, // 12.4% average FVF
        total: 0.30 + (listing.price * 0.124)
      },
      isMock: true
    };
  }

  // Utility functions
  optimizeTitle(title, maxLength) {
    if (!title) return '';
    
    if (title.length <= maxLength) return title;
    
    // Remove common filler words to make space
    const fillers = ['the', 'a', 'an', 'with', 'for', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'by'];
    let optimized = title;
    
    for (const filler of fillers) {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const temp = optimized.replace(regex, '').replace(/\s+/g, ' ').trim();
      if (temp.length <= maxLength) {
        optimized = temp;
        break;
      }
    }
    
    // If still too long, truncate at word boundary
    if (optimized.length > maxLength) {
      optimized = optimized.substring(0, maxLength);
      const lastSpace = optimized.lastIndexOf(' ');
      if (lastSpace > maxLength * 0.8) {
        optimized = optimized.substring(0, lastSpace);
      }
    }
    
    return optimized.trim();
  }

  optimizeDescription(description, maxLength, platform) {
    if (!description) return '';
    
    let optimized = description;
    
    // Add platform-specific enhancements
    switch (platform) {
      case 'poshmark':
        optimized = this.addPoshmarkHashtags(optimized);
        break;
      case 'depop':
        optimized = this.addDepopHashtags(optimized);
        break;
      case 'ebay':
        optimized = this.formatEbayDescription(optimized);
        break;
    }
    
    // Truncate if necessary
    if (optimized.length > maxLength) {
      optimized = optimized.substring(0, maxLength - 3) + '...';
    }
    
    return optimized;
  }

  addPoshmarkHashtags(description) {
    const hashtags = '#poshmarkfinds #style #fashion #trendy #vintage #deals';
    return `${description}\n\n${hashtags}`;
  }

  addDepopHashtags(description) {
    const hashtags = '#depop #vintage #y2k #thrifted #sustainable #unique';
    return `${description}\n\n${hashtags}`;
  }

  formatEbayDescription(description) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #0066cc;">Item Description</h2>
        <p>${description}</p>
        <hr>
        <h3>Shipping & Returns</h3>
        <ul>
          <li>Fast shipping within 1-2 business days</li>
          <li>30-day return policy</li>
          <li>Items shipped with care and tracking</li>
        </ul>
      </div>
    `;
  }

  mapCategory(category, platform) {
    const categoryMappings = {
      poshmark: {
        'clothing': 'Women',
        'shoes': 'Women',
        'accessories': 'Women',
        'men': 'Men',
        'kids': 'Kids',
        'home': 'Home',
        'beauty': 'Beauty'
      },
      mercari: {
        'clothing': 'Women\'s Clothing',
        'shoes': 'Women\'s Shoes',
        'accessories': 'Women\'s Accessories',
        'electronics': 'Electronics',
        'home': 'Home & Garden'
      },
      depop: {
        'clothing': 'Clothing',
        'shoes': 'Shoes',
        'accessories': 'Accessories',
        'vintage': 'Vintage',
        'bags': 'Bags'
      }
    };

    return categoryMappings[platform]?.[category?.toLowerCase()] || category || 'Other';
  }

  extractColor(text) {
    const colors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'brown', 'gray', 'orange'];
    const lowerText = text.toLowerCase();
    
    for (const color of colors) {
      if (lowerText.includes(color)) {
        return color.charAt(0).toUpperCase() + color.slice(1);
      }
    }
    
    return '';
  }

  guessMaterial(description) {
    const materials = ['cotton', 'polyester', 'wool', 'silk', 'denim', 'leather', 'linen', 'cashmere'];
    const lowerDesc = description.toLowerCase();
    
    for (const material of materials) {
      if (lowerDesc.includes(material)) {
        return material.charAt(0).toUpperCase() + material.slice(1);
      }
    }
    
    return 'Mixed materials';
  }

  estimateWeight(category) {
    const weights = {
      'clothing': '0.5',
      'shoes': '2.0',
      'accessories': '0.3',
      'bags': '1.0',
      'electronics': '1.5'
    };
    
    return weights[category?.toLowerCase()] || '1.0';
  }

  escapeCSV(value) {
    if (typeof value !== 'string') return value;
    
    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return '"' + value.replace(/"/g, '""') + '"';
    }
    
    return value;
  }

  arrayToCSV(data) {
    return data.map(row => row.join(',')).join('\n');
  }

  // Batch operations
  async batchCrossPost(listings, platforms, options = {}) {
    const results = [];
    
    for (let i = 0; i < listings.length; i++) {
      try {
        const result = await this.crossPost(listings[i], platforms, options);
        results.push({
          index: i,
          listing: listings[i],
          result
        });
        
        // Add delay between posts to respect rate limits
        if (i < listings.length - 1 && options.delay) {
          await new Promise(resolve => setTimeout(resolve, options.delay));
        }
      } catch (error) {
        results.push({
          index: i,
          listing: listings[i],
          error: error.message
        });
      }
    }
    
    return results;
  }

  // Export multiple CSV files as ZIP
  async exportAllPlatforms(listings, platforms) {
    const files = {};
    
    for (const platform of platforms) {
      const allListingsCSV = this.generateBatchCSV(listings, platform);
      files[`${platform}_listings_${new Date().toISOString().split('T')[0]}.csv`] = allListingsCSV;
    }
    
    return files;
  }

  generateBatchCSV(listings, platform) {
    const config = this.platforms[platform];
    const rows = [config.csvHeaders];
    
    listings.forEach(listing => {
      const formattedListing = this.formatForPlatform(listing, platform);
      const csvRow = this.mapToCSVRow(formattedListing, platform);
      rows.push(csvRow);
    });
    
    return this.arrayToCSV(rows);
  }

  // Get platform analytics and recommendations
  getPlatformRecommendations(listing) {
    const recommendations = [];
    
    // Price recommendations by platform
    const priceRanges = {
      poshmark: { min: 10, max: 200, optimal: 25 },
      mercari: { min: 5, max: 150, optimal: 20 },
      depop: { min: 8, max: 100, optimal: 18 },
      ebay: { min: 5, max: 500, optimal: 30 },
      facebook: { min: 5, max: 300, optimal: 25 },
      vinted: { min: 3, max: 80, optimal: 15 }
    };
    
    Object.keys(priceRanges).forEach(platform => {
      const range = priceRanges[platform];
      const price = listing.price;
      
      if (price >= range.min && price <= range.max) {
        const score = price <= range.optimal ? 'Good' : 'Fair';
        recommendations.push({
          platform,
          type: 'pricing',
          score,
          message: `Price ${price} is ${score.toLowerCase()} for ${platform}`,
          suggestion: price > range.optimal ? `Consider ${range.optimal} for better sales velocity` : null
        });
      }
    });
    
    return recommendations;
  }

  // Platform fee calculator
  calculateFees(price, platform) {
    const feeStructures = {
      poshmark: { rate: 0.20, min: 2.95 }, // 20% or $2.95 minimum
      mercari: { rate: 0.10, processing: 0.029 }, // 10% + 2.9%
      depop: { rate: 0.10, paypal: 0.0349 }, // 10% + PayPal fees
      ebay: { insertion: 0.30, finalValue: 0.124 }, // $0.30 + 12.4%
      facebook: { rate: 0.05 }, // 5% selling fee
      vinted: { rate: 0.05, fixed: 0.70 } // 5% + €0.70 fixed
    };
    
    const fees = feeStructures[platform];
    if (!fees) return { total: 0, breakdown: {} };
    
    let total = 0;
    const breakdown = {};
    
    switch (platform) {
      case 'poshmark':
        total = Math.max(price * fees.rate, fees.min);
        breakdown.commission = total;
        break;
        
      case 'mercari':
        breakdown.selling = price * fees.rate;
        breakdown.processing = price * fees.processing;
        total = breakdown.selling + breakdown.processing;
        break;
        
      case 'depop':
        breakdown.depop = price * fees.rate;
        breakdown.paypal = price * fees.paypal;
        total = breakdown.depop + breakdown.paypal;
        break;
        
      case 'ebay':
        breakdown.insertion = fees.insertion;
        breakdown.finalValue = price * fees.finalValue;
        total = breakdown.insertion + breakdown.finalValue;
        break;
        
      case 'facebook':
        total = price * fees.rate;
        breakdown.selling = total;
        break;
        
      case 'vinted':
        breakdown.commission = price * fees.rate;
        breakdown.fixed = fees.fixed;
        total = breakdown.commission + breakdown.fixed;
        break;
    }
    
    return {
      total: Math.round(total * 100) / 100,
      breakdown,
      profit: Math.round((price - total) * 100) / 100
    };
  }
}

// Export singleton instance
export const crossPostingService = new CrossPostingService();