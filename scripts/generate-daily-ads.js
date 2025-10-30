#!/usr/bin/env node

/**
 * Photo2Profit Daily Ads & Social Posts Script
 * Generates daily social media content and optimizes listings
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  fetchListings, 
  saveListing, 
  saveReport, 
  saveSocialPost, 
  initializeFirebase 
} from './firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Photo2ProfitDaily {
  constructor() {
    this.reportsPath = path.join(__dirname, '../reports');
  }

  async loadAgentConfig() {
    const configData = await fs.readFile(path.join(__dirname, '../.github/agents/photo2profit.json'), 'utf8');
    return JSON.parse(configData);
  }

  async loadListings() {
    // Use Firebase to fetch listings instead of local JSON file
    return await fetchListings();
  }

  async generateSocialPosts(listings) {
    const posts = [];
    const today = new Date().toISOString().split('T')[0];
    
    // Select 3-5 featured items for today
    const featuredItems = listings.slice(0, Math.min(5, listings.length));
    
    for (const item of featuredItems) {
      // Instagram post
      const instagramPost = {
        platform: 'instagram',
        item: item.title,
        caption: this.generateInstagramCaption(item),
        hashtags: this.generateHashtags(item),
        image: item.image,
        scheduledTime: `${today}T12:00:00Z`,
        listingId: item.id
      };
      
      // TikTok concept
      const tiktokPost = {
        platform: 'tiktok',
        item: item.title,
        concept: this.generateTikTokConcept(item),
        hooks: this.generateTikTokHooks(item),
        trending_sounds: ['original_audio', 'trending_fashion_sound'],
        scheduledTime: `${today}T15:00:00Z`,
        listingId: item.id
      };
      
      // Save social posts to Firebase
      await saveSocialPost(instagramPost);
      await saveSocialPost(tiktokPost);
      
      posts.push(instagramPost, tiktokPost);
    }
    
    return posts;
  }

  generateInstagramCaption(item) {
    const captions = [
      `✨ JUST DROPPED: ${item.title}! This beauty is calling your name 💕`,
      `🔥 New listing alert! Who's ready to add some style to their wardrobe?`,
      `💎 Found this gem and knew it needed a new home! Swipe to see all angles ➡️`,
      `🌟 Style steal incoming! This piece is perfect for [styling suggestion]`
    ];
    
    return captions[Math.floor(Math.random() * captions.length)] + 
           `\n\n${item.description.substring(0, 100)}...` +
           `\n\n💰 ${item.price} | Link in bio!` +
           `\n\n#Photo2Profit #ResellLife #ThriftFlip #SustainableFashion`;
  }

  generateHashtags(item) {
    const baseHashtags = ['#Photo2Profit', '#ResellLife', '#ThriftFlip', '#SustainableFashion'];
    const itemTags = item.tags.map(tag => `#${tag.replace(/\s+/g, '')}`);
    
    return [...baseHashtags, ...itemTags].slice(0, 20);
  }

  generateTikTokConcept(item) {
    const concepts = [
      `"POV: You find the perfect ${item.title.toLowerCase()} for ${item.price}" transition video`,
      `Styling ${item.title.toLowerCase()} 3 different ways - which look is your fave?`,
      `Thrift flip transformation: before vs after with this ${item.title.toLowerCase()}`,
      `Rating ${item.title.toLowerCase()} finds - this one's definitely a 10/10!`
    ];
    
    return concepts[Math.floor(Math.random() * concepts.length)];
  }

  generateTikTokHooks(item) {
    return [
      "You won't believe what I found thrifting today...",
      "This is why I love sustainable fashion",
      "Rating thrift finds that are actually worth it",
      "POV: You're building the perfect wardrobe on a budget"
    ];
  }

  async optimizeListings(listings) {
    const optimizations = [];
    
    for (const item of listings) {
      const optimization = {
        title: item.title,
        current_price: item.price,
        suggestions: {
          seo_title: this.generateSEOTitle(item),
          price_adjustment: this.suggestPriceAdjustment(item),
          description_enhancement: this.enhanceDescription(item),
          trending_tags: this.suggestTrendingTags(item)
        },
        priority: this.calculateOptimizationPriority(item)
      };
      
      optimizations.push(optimization);
    }
    
    return optimizations.sort((a, b) => b.priority - a.priority);
  }

  generateSEOTitle(item) {
    const keywords = ['trendy', 'stylish', 'quality', 'authentic'];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    
    return `${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)} ${item.title} - ${item.tags[0] || 'Fashion'} Essential`;
  }

  suggestPriceAdjustment(item) {
    const currentPrice = parseFloat(item.price.replace('$', ''));
    const suggestions = [];
    
    // Mock market analysis
    if (currentPrice > 50) {
      suggestions.push({ type: 'discount', amount: '10%', reason: 'High price point - consider promotional pricing' });
    }
    
    if (currentPrice < 20) {
      suggestions.push({ type: 'increase', amount: '$5-10', reason: 'Undervalued - room for price increase' });
    }
    
    return suggestions;
  }

  enhanceDescription(item) {
    const enhancements = [
      'Add styling suggestions and outfit ideas',
      'Include care instructions and material details',
      'Mention sustainability benefits',
      'Add measurements for better fit guidance',
      'Include lifestyle context and occasions to wear'
    ];
    
    return enhancements.slice(0, 3);
  }

  suggestTrendingTags(item) {
    const trendingTags = [
      'Y2K', 'cottagecore', 'dark academia', 'minimalist', 'boho chic',
      'vintage inspired', 'sustainable fashion', 'thrift find', 'unique piece'
    ];
    
    return trendingTags.slice(0, 5);
  }

  calculateOptimizationPriority(item) {
    // Simple priority scoring based on various factors
    let score = 0;
    
    // Newer items get higher priority
    score += 10;
    
    // Higher priced items get more attention
    const price = parseFloat(item.price.replace('$', ''));
    if (price > 50) score += 5;
    
    // Items with fewer tags need optimization
    if (item.tags.length < 3) score += 8;
    
    return score;
  }

  async saveReport(socialPosts, optimizations) {
    const report = {
      date: new Date().toISOString().split('T')[0],
      type: 'daily_automation',
      social_posts: {
        generated: socialPosts.length,
        platforms: [...new Set(socialPosts.map(p => p.platform))],
        posts: socialPosts
      },
      listing_optimizations: {
        analyzed: optimizations.length,
        high_priority: optimizations.filter(o => o.priority > 15).length,
        suggestions: optimizations
      },
      next_actions: [
        'Review and approve social media posts',
        'Implement high-priority listing optimizations',
        'Schedule posts for optimal engagement times',
        'Monitor performance metrics'
      ]
    };
    
    // Save to Firebase instead of local file
    const reportId = await saveReport('daily_automation', report);
    
    // Also save locally for backup (optional)
    const filename = `daily-report-${report.date}.json`;
    const reportPath = path.join(this.reportsPath, filename);
    
    try {
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      console.log(`✅ Daily report saved locally to ${filename} and to Firebase (${reportId})`);
    } catch (error) {
      console.log(`✅ Daily report saved to Firebase (${reportId})`);
      console.log(`⚠️ Could not save local backup: ${error.message}`);
    }
    
    return report;
  }

  async run() {
    try {
      console.log('🚀 Running Photo2Profit Daily Automation...');
      
      // Initialize Firebase connection
      await initializeFirebase();
      
      // Load agent config
      this.agentConfig = await this.loadAgentConfig();
      
      // Load current listings from Firebase
      const listings = await this.loadListings();
      console.log(`📦 Loaded ${listings.length} listings from Firestore`);
      
      if (listings.length === 0) {
        console.log("⚠️ No listings found in database. Add some listings first!");
        return;
      }
      
      // Generate social media content
      const socialPosts = await this.generateSocialPosts(listings);
      console.log(`📱 Generated ${socialPosts.length} social media posts`);
      
      // Optimize listings
      const optimizations = await this.optimizeListings(listings);
      console.log(`⚡ Generated ${optimizations.length} listing optimizations`);
      
      // Save daily report
      const report = await this.saveReport(socialPosts, optimizations);
      
      console.log('✨ Daily automation complete!');
      console.log(`📊 Check reports/daily-report-${report.date}.json for details`);
      
    } catch (error) {
      console.error('❌ Error running daily automation:', error);
      process.exit(1);
    }
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  new Photo2ProfitDaily().run();
}

export default Photo2ProfitDaily;