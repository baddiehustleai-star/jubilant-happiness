// eBay API integration for cross-posting
export class EbayService {
  constructor() {
    this.appId = import.meta.env.VITE_EBAY_APP_ID;
    this.certId = import.meta.env.VITE_EBAY_CERT_ID;
    this.devId = import.meta.env.VITE_EBAY_DEV_ID;
    this.oauthToken = import.meta.env.VITE_EBAY_OAUTH_TOKEN;
    this.apiUrl = 'https://api.ebay.com';
    this.sandboxUrl = 'https://api.sandbox.ebay.com';
  }

  // Create eBay listing
  async createListing(listingData) {
    if (!this.validateCredentials()) {
      throw new Error('eBay API credentials not configured');
    }

    try {
      const ebayListing = this.formatForEbay(listingData);
      
      // For now, return mock success - replace with actual API call
      return this.mockEbayResponse(ebayListing);
      
      // Actual API implementation would be:
      // const response = await this.makeEbayApiCall('AddFixedPriceItem', ebayListing);
      // return this.parseEbayResponse(response);
    } catch (error) {
      console.error('eBay listing error:', error);
      throw error;
    }
  }

  // Format listing data for eBay API
  formatForEbay(listingData) {
    return {
      Item: {
        Title: listingData.title.substring(0, 80), // eBay title limit
        Description: `<![CDATA[${listingData.description}]]>`,
        PrimaryCategory: { CategoryID: this.mapCategoryToEbay(listingData.category) },
        StartPrice: listingData.priceRange.min,
        CategoryMappingAllowed: true,
        ConditionID: this.mapConditionToEbay(listingData.condition),
        Country: 'US',
        Currency: 'USD',
        DispatchTimeMax: 1,
        ListingDuration: 'GTC', // Good Till Cancelled
        ListingType: 'FixedPriceItem',
        PaymentMethods: ['PayPal'],
        PictureDetails: {
          PictureURL: listingData.images || []
        },
        PostalCode: '95125',
        Quantity: 1,
        ReturnPolicy: {
          ReturnsAcceptedOption: 'ReturnsAccepted',
          RefundOption: 'MoneyBack',
          ReturnsWithinOption: 'Days_30'
        },
        ShippingDetails: {
          ShippingType: 'Flat',
          ShippingServiceOptions: [{
            ShippingServicePriority: 1,
            ShippingService: 'USPSMedia',
            ShippingServiceCost: 4.99
          }]
        }
      }
    };
  }

  // Map category to eBay category ID
  mapCategoryToEbay(category) {
    const categoryMap = {
      'Fashion': '11450', // Clothing, Shoes & Accessories
      'Electronics': '58058', // Electronics
      'Home': '11700', // Home & Garden
      'Sports': '888', // Sporting Goods
      'Books': '267', // Books
      'Toys': '220', // Toys & Hobbies
      'Other': '99', // Everything Else
    };
    return categoryMap[category] || '99';
  }

  // Map condition to eBay condition ID
  mapConditionToEbay(condition) {
    const conditionMap = {
      'New': '1000',
      'Excellent': '1500',
      'Good': '2000',
      'Fair': '2500',
      'Poor': '3000',
    };
    return conditionMap[condition] || '2000';
  }

  // Validate API credentials
  validateCredentials() {
    return this.appId && this.certId && this.devId;
  }

  // Mock eBay response for development
  mockEbayResponse(_listing) {
    return {
      success: true,
      itemId: `MOCK${Date.now()}`,
      listingUrl: `https://www.ebay.com/itm/MOCK${Date.now()}`,
      fees: {
        insertionFee: 0.35,
        finalValueFee: '13%',
      },
      status: 'Active',
      endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
  }
}

// Poshmark CSV export service
export class PoshmarkService {
  static generateCSV(listings) {
    const headers = [
      'Title',
      'Description', 
      'Category',
      'SubCategory',
      'Size',
      'Brand',
      'Color',
      'Price',
      'Image1',
      'Image2',
      'Image3',
      'Image4'
    ];

    const rows = listings.map(listing => [
      listing.title,
      listing.description.replace(/\n/g, ' ').substring(0, 500),
      listing.category,
      listing.subcategory || '',
      listing.size || '',
      listing.brand || '',
      listing.color || '',
      listing.priceRange.min,
      listing.images?.[0] || '',
      listing.images?.[1] || '',
      listing.images?.[2] || '',
      listing.images?.[3] || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  static downloadCSV(listings, filename = 'poshmark_listings.csv') {
    const csv = this.generateCSV(listings);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    window.URL.revokeObjectURL(url);
  }
}

// Mercari CSV export service
export class MercariService {
  static generateCSV(listings) {
    const headers = [
      'Product Name',
      'Description',
      'Category',
      'Brand',
      'Condition',
      'Price',
      'Shipping Weight',
      'Image URLs'
    ];

    const rows = listings.map(listing => [
      listing.title,
      listing.description.substring(0, 1000),
      listing.category,
      listing.brand || '',
      listing.condition,
      listing.priceRange.min,
      '1', // Default weight in lbs
      (listing.images || []).join(';')
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  static downloadCSV(listings, filename = 'mercari_listings.csv') {
    const csv = this.generateCSV(listings);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    window.URL.revokeObjectURL(url);
  }
}

// Cross-posting coordinator
export class CrossPostingService {
  constructor() {
    this.ebayService = new EbayService();
  }

  // Post to multiple platforms
  async crossPost(listing, platforms = ['ebay']) {
    const results = {};

    for (const platform of platforms) {
      try {
        switch (platform.toLowerCase()) {
          case 'ebay':
            results.ebay = await this.ebayService.createListing(listing);
            break;
          case 'poshmark':
            results.poshmark = { 
              success: true, 
              message: 'CSV generated for manual upload',
              csv: PoshmarkService.generateCSV([listing])
            };
            break;
          case 'mercari':
            results.mercari = { 
              success: true, 
              message: 'CSV generated for manual upload',
              csv: MercariService.generateCSV([listing])
            };
            break;
          default:
            results[platform] = { success: false, error: 'Platform not supported' };
        }
      } catch (error) {
        results[platform] = { success: false, error: error.message };
      }
    }

    return results;
  }

  // Bulk export for CSV platforms
  exportForPlatform(listings, platform) {
    switch (platform.toLowerCase()) {
      case 'poshmark':
        PoshmarkService.downloadCSV(listings);
        break;
      case 'mercari':
        MercariService.downloadCSV(listings);
        break;
      case 'depop':
        // Similar CSV format to Mercari
        MercariService.downloadCSV(listings, 'depop_listings.csv');
        break;
      default:
        throw new Error(`Export not supported for ${platform}`);
    }
  }
}

export const crossPostingService = new CrossPostingService();