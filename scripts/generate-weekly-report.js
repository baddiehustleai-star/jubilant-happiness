#!/usr/bin/env node

/**
 * Generate Weekly Analytics Report
 * 
 * This script generates comprehensive weekly analytics reports for Photo2Profit,
 * including sales metrics, listing performance, and platform comparisons.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_DIR = path.join(__dirname, '..', 'output', 'reports');
const DATA_FILE = path.join(__dirname, '..', 'data', 'listings.json');

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
 * Calculate total inventory value
 */
function calculateInventoryValue(listings) {
  return listings.reduce((total, listing) => total + listing.price, 0);
}

/**
 * Get category breakdown
 */
function getCategoryBreakdown(listings) {
  const breakdown = {};
  
  listings.forEach(listing => {
    const category = listing.category;
    if (!breakdown[category]) {
      breakdown[category] = {
        count: 0,
        totalValue: 0
      };
    }
    breakdown[category].count++;
    breakdown[category].totalValue += listing.price;
  });
  
  return breakdown;
}

/**
 * Get brand breakdown
 */
function getBrandBreakdown(listings) {
  const breakdown = {};
  
  listings.forEach(listing => {
    const brand = listing.brand;
    if (!breakdown[brand]) {
      breakdown[brand] = {
        count: 0,
        totalValue: 0,
        avgPrice: 0
      };
    }
    breakdown[brand].count++;
    breakdown[brand].totalValue += listing.price;
  });
  
  // Calculate average prices
  Object.keys(breakdown).forEach(brand => {
    breakdown[brand].avgPrice = breakdown[brand].totalValue / breakdown[brand].count;
  });
  
  return breakdown;
}

/**
 * Get condition breakdown
 */
function getConditionBreakdown(listings) {
  const breakdown = {};
  
  listings.forEach(listing => {
    const condition = listing.condition;
    if (!breakdown[condition]) {
      breakdown[condition] = 0;
    }
    breakdown[condition]++;
  });
  
  return breakdown;
}

/**
 * Get top listings by price
 */
function getTopListings(listings, count = 10) {
  return listings
    .sort((a, b) => b.price - a.price)
    .slice(0, count)
    .map(listing => ({
      id: listing.id,
      title: `${listing.brand} ${listing.category}`,
      price: listing.price,
      condition: listing.condition
    }));
}

/**
 * Generate platform recommendations
 */
function generatePlatformRecommendations(listings) {
  const recommendations = [];
  
  // High-value items -> eBay
  const highValueItems = listings.filter(l => l.price > 100).length;
  if (highValueItems > 0) {
    recommendations.push({
      platform: 'eBay',
      reason: `${highValueItems} high-value items ($100+) - best for premium items`,
      priority: 'high'
    });
  }
  
  // Fashion items -> Poshmark
  const fashionCategories = ['Top', 'Dress', 'Shoes', 'Bag'];
  const fashionItems = listings.filter(l => 
    fashionCategories.includes(l.category)
  ).length;
  if (fashionItems > 0) {
    recommendations.push({
      platform: 'Poshmark',
      reason: `${fashionItems} fashion items - strong fashion community`,
      priority: 'high'
    });
  }
  
  // All items -> Mercari
  recommendations.push({
    platform: 'Mercari',
    reason: 'Great for quick sales across all categories',
    priority: 'medium'
  });
  
  // Vintage/unique -> Depop
  const vintageItems = listings.filter(l => 
    l.tags && l.tags.includes('vintage')
  ).length;
  if (vintageItems > 0) {
    recommendations.push({
      platform: 'Depop',
      reason: `${vintageItems} vintage items - younger, trend-focused audience`,
      priority: 'medium'
    });
  }
  
  return recommendations;
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(analytics) {
  const { summary, categories, brands, conditions, topListings, recommendations, timestamp } = analytics;
  
  let report = `# Photo2Profit Weekly Analytics Report\n\n`;
  report += `**Generated:** ${new Date(timestamp).toLocaleString()}\n\n`;
  report += `---\n\n`;
  
  // Summary
  report += `## 📊 Summary\n\n`;
  report += `- **Total Listings:** ${summary.totalListings}\n`;
  report += `- **Total Inventory Value:** $${summary.totalValue.toFixed(2)}\n`;
  report += `- **Average Price:** $${summary.avgPrice.toFixed(2)}\n`;
  report += `- **Price Range:** $${summary.minPrice.toFixed(2)} - $${summary.maxPrice.toFixed(2)}\n\n`;
  
  // Category breakdown
  report += `## 📦 Category Breakdown\n\n`;
  report += `| Category | Count | Total Value | Avg Price |\n`;
  report += `|----------|-------|-------------|----------|\n`;
  Object.entries(categories).forEach(([category, data]) => {
    const avgPrice = data.totalValue / data.count;
    report += `| ${category} | ${data.count} | $${data.totalValue.toFixed(2)} | $${avgPrice.toFixed(2)} |\n`;
  });
  report += `\n`;
  
  // Brand breakdown
  report += `## 🏷️ Brand Breakdown\n\n`;
  report += `| Brand | Count | Total Value | Avg Price |\n`;
  report += `|-------|-------|-------------|----------|\n`;
  Object.entries(brands).forEach(([brand, data]) => {
    report += `| ${brand} | ${data.count} | $${data.totalValue.toFixed(2)} | $${data.avgPrice.toFixed(2)} |\n`;
  });
  report += `\n`;
  
  // Condition breakdown
  report += `## ✨ Condition Breakdown\n\n`;
  Object.entries(conditions).forEach(([condition, count]) => {
    const percentage = (count / summary.totalListings * 100).toFixed(1);
    report += `- **${condition}:** ${count} (${percentage}%)\n`;
  });
  report += `\n`;
  
  // Top listings
  report += `## 💎 Top 10 Listings by Price\n\n`;
  report += `| Rank | Item | Price | Condition |\n`;
  report += `|------|------|-------|----------|\n`;
  topListings.forEach((listing, index) => {
    report += `| ${index + 1} | ${listing.title} | $${listing.price.toFixed(2)} | ${listing.condition} |\n`;
  });
  report += `\n`;
  
  // Platform recommendations
  report += `## 🎯 Platform Recommendations\n\n`;
  recommendations.forEach(rec => {
    const emoji = rec.priority === 'high' ? '🔥' : '📌';
    report += `${emoji} **${rec.platform}** - ${rec.reason}\n\n`;
  });
  
  report += `---\n\n`;
  report += `*Report generated by Photo2Profit AI*\n`;
  
  return report;
}

/**
 * Main execution
 */
function main() {
  console.log('📊 Starting weekly report generation...');
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Load listings
  const data = loadListings();
  console.log(`📦 Loaded ${data.listings.length} listings`);
  
  // Calculate analytics
  const totalValue = calculateInventoryValue(data.listings);
  const categories = getCategoryBreakdown(data.listings);
  const brands = getBrandBreakdown(data.listings);
  const conditions = getConditionBreakdown(data.listings);
  const topListings = getTopListings(data.listings);
  const recommendations = generatePlatformRecommendations(data.listings);
  
  const analytics = {
    summary: {
      totalListings: data.listings.length,
      totalValue: totalValue,
      avgPrice: totalValue / data.listings.length,
      minPrice: Math.min(...data.listings.map(l => l.price)),
      maxPrice: Math.max(...data.listings.map(l => l.price))
    },
    categories,
    brands,
    conditions,
    topListings,
    recommendations,
    timestamp: new Date().toISOString()
  };
  
  // Generate timestamp for files
  const timestamp = new Date().toISOString().split('T')[0];
  
  // Save JSON report
  const jsonFile = path.join(OUTPUT_DIR, `report-${timestamp}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(analytics, null, 2));
  console.log(`📁 JSON report saved to: ${jsonFile}`);
  
  // Save Markdown report
  const markdownReport = generateMarkdownReport(analytics);
  const mdFile = path.join(OUTPUT_DIR, `report-${timestamp}.md`);
  fs.writeFileSync(mdFile, markdownReport);
  console.log(`📁 Markdown report saved to: ${mdFile}`);
  
  console.log('🎉 Weekly report generation complete!');
}

// Run the script
main();
