#!/usr/bin/env node

/**
 * Monthly Pricing Refresh
 * 
 * This script performs monthly pricing analysis and optimization for Photo2Profit listings.
 * It analyzes market trends and suggests pricing adjustments to maximize sales.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_DIR = path.join(__dirname, '..', 'output', 'pricing');
const DATA_FILE = path.join(__dirname, '..', 'data', 'listings.json');

// Pricing strategy constants
const MARKET_MULTIPLIERS = {
  'New': 0.85,          // 85% of retail for new items
  'Like New': 0.75,     // 75% of retail for like new
  'Excellent': 0.65,    // 65% of retail for excellent
  'Good': 0.50,         // 50% of retail for good
  'Fair': 0.35          // 35% of retail for fair
};

const CATEGORY_DEMAND = {
  'Top': 1.0,
  'Dress': 1.2,         // Higher demand
  'Shoes': 1.1,
  'Bag': 1.3,           // Highest demand
  'Jewelry': 0.9
};

const SEASONAL_FACTORS = {
  'winter': { 'Dress': 0.9, 'Top': 0.95, 'Shoes': 1.0, 'Bag': 1.0, 'Jewelry': 1.0 },
  'spring': { 'Dress': 1.1, 'Top': 1.05, 'Shoes': 1.0, 'Bag': 1.0, 'Jewelry': 1.0 },
  'summer': { 'Dress': 1.15, 'Top': 1.1, 'Shoes': 1.05, 'Bag': 1.05, 'Jewelry': 1.05 },
  'fall': { 'Dress': 1.0, 'Top': 1.0, 'Shoes': 1.0, 'Bag': 1.1, 'Jewelry': 1.0 }
};

/**
 * Get current season
 */
function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

/**
 * Load listings data
 */
function loadListings() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading listings:', error.message);
    return { listings: [] };
  }
}

/**
 * Estimate retail value based on brand and category
 */
function estimateRetailValue(brand, category) {
  // Simplified retail estimation (in production, use actual market data)
  const brandMultipliers = {
    'Zara': 80,
    'H&M': 50,
    'Nike': 120,
    'Adidas': 110,
    'Gucci': 1200,
    'Prada': 1500,
    'Coach': 300
  };
  
  const categoryBase = {
    'Top': 1.0,
    'Dress': 1.5,
    'Shoes': 1.3,
    'Bag': 2.0,
    'Jewelry': 0.8
  };
  
  const brandBase = brandMultipliers[brand] || 60;
  const categoryFactor = categoryBase[category] || 1.0;
  
  return brandBase * categoryFactor;
}

/**
 * Calculate optimized price for a listing
 */
function calculateOptimizedPrice(listing) {
  const { brand, category, condition, price: currentPrice } = listing;
  
  // Get base retail value
  const retailValue = estimateRetailValue(brand, category);
  
  // Apply condition multiplier
  const conditionMultiplier = MARKET_MULTIPLIERS[condition] || 0.5;
  
  // Apply category demand factor
  const demandMultiplier = CATEGORY_DEMAND[category] || 1.0;
  
  // Apply seasonal factor
  const season = getCurrentSeason();
  const seasonalMultiplier = SEASONAL_FACTORS[season][category] || 1.0;
  
  // Calculate optimized price
  const optimizedPrice = retailValue * conditionMultiplier * demandMultiplier * seasonalMultiplier;
  
  // Round to nearest .99
  const roundedPrice = Math.floor(optimizedPrice) + 0.99;
  
  // Calculate difference from current price
  const priceDifference = roundedPrice - currentPrice;
  const percentChange = ((priceDifference / currentPrice) * 100).toFixed(1);
  
  return {
    currentPrice,
    optimizedPrice: roundedPrice,
    priceDifference,
    percentChange: parseFloat(percentChange),
    factors: {
      retail: retailValue,
      condition: conditionMultiplier,
      demand: demandMultiplier,
      seasonal: seasonalMultiplier
    },
    recommendation: getRecommendation(percentChange)
  };
}

/**
 * Get pricing recommendation
 */
function getRecommendation(percentChange) {
  const change = parseFloat(percentChange);
  
  if (change > 10) {
    return 'INCREASE - Underpriced for market';
  } else if (change > 5) {
    return 'SLIGHT INCREASE - Room for optimization';
  } else if (change < -10) {
    return 'DECREASE - Overpriced, may affect sales';
  } else if (change < -5) {
    return 'SLIGHT DECREASE - Consider competitive pricing';
  } else {
    return 'MAINTAIN - Well priced for market';
  }
}

/**
 * Generate pricing report
 */
function generatePricingReport(listings, analyses) {
  const totalCurrentValue = listings.reduce((sum, l) => sum + l.price, 0);
  const totalOptimizedValue = analyses.reduce((sum, a) => sum + a.pricing.optimizedPrice, 0);
  const potentialIncrease = totalOptimizedValue - totalCurrentValue;
  
  return {
    summary: {
      totalListings: listings.length,
      currentTotalValue: totalCurrentValue.toFixed(2),
      optimizedTotalValue: totalOptimizedValue.toFixed(2),
      potentialIncrease: potentialIncrease.toFixed(2),
      percentIncrease: ((potentialIncrease / totalCurrentValue) * 100).toFixed(2),
      season: getCurrentSeason()
    },
    recommendations: {
      increase: analyses.filter(a => a.pricing.percentChange > 5).length,
      decrease: analyses.filter(a => a.pricing.percentChange < -5).length,
      maintain: analyses.filter(a => Math.abs(a.pricing.percentChange) <= 5).length
    },
    listings: analyses
  };
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(report) {
  const { summary, recommendations, listings } = report;
  
  let md = `# Monthly Pricing Refresh Report\n\n`;
  md += `**Generated:** ${new Date().toLocaleString()}\n`;
  md += `**Season:** ${summary.season.charAt(0).toUpperCase() + summary.season.slice(1)}\n\n`;
  md += `---\n\n`;
  
  // Summary
  md += `## 💰 Summary\n\n`;
  md += `- **Total Listings:** ${summary.totalListings}\n`;
  md += `- **Current Total Value:** $${summary.currentTotalValue}\n`;
  md += `- **Optimized Total Value:** $${summary.optimizedTotalValue}\n`;
  md += `- **Potential Increase:** $${summary.potentialIncrease} (${summary.percentIncrease}%)\n\n`;
  
  // Recommendations
  md += `## 📊 Recommendations\n\n`;
  md += `- **Increase Price:** ${recommendations.increase} listings\n`;
  md += `- **Decrease Price:** ${recommendations.decrease} listings\n`;
  md += `- **Maintain Price:** ${recommendations.maintain} listings\n\n`;
  
  // Detailed listings
  md += `## 📝 Detailed Analysis\n\n`;
  md += `| Item | Current | Optimized | Change | Recommendation |\n`;
  md += `|------|---------|-----------|--------|----------------|\n`;
  
  listings.forEach(analysis => {
    const { listing, pricing } = analysis;
    const changeSign = pricing.percentChange > 0 ? '+' : '';
    md += `| ${listing.brand} ${listing.category} | `;
    md += `$${pricing.currentPrice.toFixed(2)} | `;
    md += `$${pricing.optimizedPrice.toFixed(2)} | `;
    md += `${changeSign}${pricing.percentChange}% | `;
    md += `${pricing.recommendation} |\n`;
  });
  
  md += `\n---\n\n`;
  md += `*Pricing optimization by Photo2Profit AI*\n`;
  
  return md;
}

/**
 * Main execution
 */
function main() {
  console.log('💰 Starting monthly pricing refresh...');
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Load listings
  const data = loadListings();
  console.log(`📦 Loaded ${data.listings.length} listings`);
  
  // Analyze each listing
  const analyses = data.listings.map(listing => ({
    listing: {
      id: listing.id,
      brand: listing.brand,
      category: listing.category,
      condition: listing.condition
    },
    pricing: calculateOptimizedPrice(listing)
  }));
  
  // Generate report
  const report = generatePricingReport(data.listings, analyses);
  
  // Generate timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  
  // Save JSON report
  const jsonFile = path.join(OUTPUT_DIR, `pricing-${timestamp}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(report, null, 2));
  console.log(`📁 JSON report saved to: ${jsonFile}`);
  
  // Save Markdown report
  const markdownReport = generateMarkdownReport(report);
  const mdFile = path.join(OUTPUT_DIR, `pricing-${timestamp}.md`);
  fs.writeFileSync(mdFile, markdownReport);
  console.log(`📁 Markdown report saved to: ${mdFile}`);
  
  // Print summary
  console.log('\n📊 Pricing Analysis Summary:');
  console.log(`   Current Value: $${report.summary.currentTotalValue}`);
  console.log(`   Optimized Value: $${report.summary.optimizedTotalValue}`);
  console.log(`   Potential Increase: $${report.summary.potentialIncrease} (${report.summary.percentIncrease}%)`);
  console.log(`   Recommendations: ${report.recommendations.increase} increase, ${report.recommendations.decrease} decrease, ${report.recommendations.maintain} maintain`);
  
  console.log('\n🎉 Monthly pricing refresh complete!');
}

// Run the script
main();
