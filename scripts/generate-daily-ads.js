#!/usr/bin/env node

/**
 * Generate Daily Ads and Social Posts
 * 
 * This script generates daily product advertisements and social media posts
 * for Photo2Profit listings. It creates optimized content for multiple platforms.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_DIR = path.join(__dirname, '..', 'output', 'daily-ads');
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
 * Generate SEO-optimized title
 */
function generateTitle(listing) {
  const { brand, category, condition, size } = listing;
  return `${brand} ${category} - ${condition} - Size ${size}`;
}

/**
 * Generate compelling description
 */
function generateDescription(listing) {
  const { brand, category, condition, description, features } = listing;
  
  let desc = `Beautiful ${brand} ${category} in ${condition} condition!\n\n`;
  desc += `${description}\n\n`;
  
  if (features && features.length > 0) {
    desc += `Features:\n`;
    features.forEach(feature => {
      desc += `• ${feature}\n`;
    });
  }
  
  desc += `\n💎 Shop with confidence - fast shipping & great customer service!`;
  desc += `\n📦 Ships within 24 hours`;
  desc += `\n💰 Reasonable offers considered`;
  
  return desc;
}

/**
 * Generate hashtags for social media
 */
function generateHashtags(listing) {
  const { brand, category, tags } = listing;
  const baseHashtags = [
    '#Photo2Profit',
    '#Reseller',
    '#Fashion',
    `#${brand.replace(/\s+/g, '')}`,
    `#${category.replace(/\s+/g, '')}`
  ];
  
  const additionalHashtags = tags.map(tag => `#${tag.replace(/\s+/g, '')}`);
  
  return [...baseHashtags, ...additionalHashtags].join(' ');
}

/**
 * Generate social media post
 */
function generateSocialPost(listing) {
  const { brand, category, price } = listing;
  
  let post = `✨ NEW LISTING ALERT ✨\n\n`;
  post += `${brand} ${category}\n`;
  post += `💰 $${price}\n\n`;
  post += `Tap the link in bio to shop now! 🛍️\n\n`;
  post += generateHashtags(listing);
  
  return post;
}

/**
 * Generate ad content for a listing
 */
function generateAd(listing) {
  return {
    id: listing.id,
    title: generateTitle(listing),
    description: generateDescription(listing),
    socialPost: generateSocialPost(listing),
    price: listing.price,
    platforms: ['poshmark', 'mercari', 'ebay', 'depop'],
    generatedAt: new Date().toISOString()
  };
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting daily ads generation...');
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Load listings
  const data = loadListings();
  console.log(`📦 Loaded ${data.listings.length} listings`);
  
  // Generate ads for each listing
  const ads = data.listings.map(listing => generateAd(listing));
  
  // Save ads to file
  const timestamp = new Date().toISOString().split('T')[0];
  const outputFile = path.join(OUTPUT_DIR, `ads-${timestamp}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(ads, null, 2));
  
  console.log(`✅ Generated ${ads.length} ads`);
  console.log(`📁 Saved to: ${outputFile}`);
  
  // Generate summary
  const summary = {
    date: timestamp,
    totalAds: ads.length,
    platforms: ['poshmark', 'mercari', 'ebay', 'depop'],
    generatedAt: new Date().toISOString()
  };
  
  const summaryFile = path.join(OUTPUT_DIR, `summary-${timestamp}.json`);
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
  
  console.log('🎉 Daily ads generation complete!');
}

// Run the script
main();
