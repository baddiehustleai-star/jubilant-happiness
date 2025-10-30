#!/usr/bin/env node

/**
 * Photo2Profit Weekly Analytics Report
 * Generates comprehensive weekly performance analysis
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  fetchListings, 
  fetchReports, 
  saveReport, 
  saveAnalytics,
  initializeFirebase 
} from './firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Photo2ProfitWeekly {
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

  async loadDailyReports() {
    // Fetch daily reports from Firebase
    return await fetchReports('daily_automation', 30); // Last 30 reports
  }

  calculateKPIs(listings, dailyReports) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    
    const weeklyReports = dailyReports.filter(report => 
      new Date(report.date || report.createdAt) >= weekStart
    );
    
    // Mock analytics data (in real implementation, this would come from platform APIs)
    const kpis = {
      gross_revenue: this.mockRevenue(listings),
      profit_margin: this.calculateProfitMargin(),
      listing_conversion_rate: this.mockConversionRate(),
      average_sale_time: this.mockAverageSaleTime(),
      social_engagement: this.mockSocialEngagement(weeklyReports),
      active_listings: listings.length,
      new_listings_this_week: Math.floor(listings.length * 0.2),
      sold_items_this_week: Math.floor(listings.length * 0.15)
    };
    
    return kpis;
  }

  mockRevenue(listings) {
    // Simple mock calculation
    const avgPrice = listings.reduce((sum, item) => {
      return sum + parseFloat(item.price.replace('$', ''));
    }, 0) / listings.length || 0;
    
    const estimatedSales = Math.floor(listings.length * 0.15); // 15% conversion
    return Math.round(avgPrice * estimatedSales);
  }

  calculateProfitMargin() {
    // Mock profit margin calculation (typically 60-70% for reselling)
    return Math.round(60 + Math.random() * 10);
  }

  mockConversionRate() {
    // Mock conversion rate (10-20% is typical for reselling)
    return Math.round(10 + Math.random() * 10);
  }

  mockAverageSaleTime() {
    // Mock average days to sell (7-30 days typical)
    return Math.round(7 + Math.random() * 23);
  }

  mockSocialEngagement(weeklyReports) {
    const totalPosts = weeklyReports.reduce((sum, report) => {
      return sum + (report.social_posts?.generated || 0);
    }, 0);
    
    return {
      posts_generated: totalPosts,
      estimated_reach: totalPosts * 150, // Mock reach per post
      estimated_engagement: totalPosts * 25, // Mock engagement per post
      platforms_active: ['instagram', 'tiktok', 'facebook']
    };
  }

  analyzePerformance(kpis) {
    const goals = this.agentConfig.analytics.goals;
    const analysis = {
      revenue: {
        current: kpis.gross_revenue,
        goal: goals.monthly_revenue,
        weekly_goal: Math.round(goals.monthly_revenue / 4.3), // Monthly goal / avg weeks per month
        status: 'on_track',
        insight: ''
      },
      profit_margin: {
        current: kpis.profit_margin,
        goal: goals.profit_margin,
        status: kpis.profit_margin >= goals.profit_margin ? 'exceeding' : 'below_target',
        insight: ''
      },
      conversion_rate: {
        current: kpis.listing_conversion_rate,
        goal: goals.listing_conversion,
        status: kpis.listing_conversion_rate >= goals.listing_conversion ? 'good' : 'needs_improvement',
        insight: ''
      },
      sale_speed: {
        current: kpis.average_sale_time,
        goal: goals.average_sale_days,
        status: kpis.average_sale_time <= goals.average_sale_days ? 'good' : 'slow',
        insight: ''
      }
    };
    
    // Add insights
    analysis.revenue.insight = analysis.revenue.status === 'on_track' 
      ? 'Revenue tracking well toward monthly goal'
      : 'Consider increasing listing frequency or promotional pricing';
      
    analysis.profit_margin.insight = analysis.profit_margin.status === 'exceeding'
      ? 'Excellent profit margins - great sourcing!'
      : 'Review sourcing costs and pricing strategy';
      
    analysis.conversion_rate.insight = analysis.conversion_rate.status === 'good'
      ? 'Strong conversion rate - listings are compelling'
      : 'Optimize photos, descriptions, and pricing for better conversion';
      
    analysis.sale_speed.insight = analysis.sale_speed.status === 'good'
      ? 'Items selling quickly - good market demand'
      : 'Consider promotional pricing or cross-platform listing';
    
    return analysis;
  }

  generateRecommendations(kpis, performance) {
    const recommendations = [];
    
    // Revenue recommendations
    if (performance.revenue.status !== 'exceeding') {
      recommendations.push({
        category: 'revenue',
        priority: 'high',
        action: 'Increase listing frequency',
        details: 'Add 5-7 new listings this week to boost revenue potential'
      });
    }
    
    // Conversion recommendations
    if (performance.conversion_rate.status === 'needs_improvement') {
      recommendations.push({
        category: 'conversion',
        priority: 'high',
        action: 'Optimize listing photos',
        details: 'Focus on better lighting, multiple angles, and lifestyle shots'
      });
    }
    
    // Social media recommendations
    if (kpis.social_engagement.posts_generated < 10) {
      recommendations.push({
        category: 'marketing',
        priority: 'medium',
        action: 'Increase social media presence',
        details: 'Aim for 2-3 posts daily across platforms for better visibility'
      });
    }
    
    // Inventory recommendations
    if (kpis.active_listings < 20) {
      recommendations.push({
        category: 'inventory',
        priority: 'medium',
        action: 'Expand inventory',
        details: 'Build up to 30-50 active listings for consistent sales'
      });
    }
    
    // Pricing recommendations
    if (performance.sale_speed.status === 'slow') {
      recommendations.push({
        category: 'pricing',
        priority: 'medium',
        action: 'Review pricing strategy',
        details: 'Consider 10-15% price reduction on slow-moving items'
      });
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  identifyTrends(listings, dailyReports) {
    const trends = {
      hot_categories: this.analyzeHotCategories(listings),
      seasonal_opportunities: this.identifySeasonalOpportunities(),
      pricing_trends: this.analyzePricingTrends(listings),
      social_performance: this.analyzeSocialTrends(dailyReports)
    };
    
    return trends;
  }

  analyzeHotCategories(listings) {
    const categories = {};
    
    listings.forEach(item => {
      item.tags.forEach(tag => {
        categories[tag] = (categories[tag] || 0) + 1;
      });
    });
    
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({
        category,
        listings: count,
        trend: 'rising' // Mock trend data
      }));
  }

  identifySeasonalOpportunities() {
    const month = new Date().getMonth();
    const seasonalMap = {
      0: ['New Year fitness', 'winter coats', 'cozy home decor'], // January
      1: ['Valentine\'s Day outfits', 'winter accessories', 'romantic decor'], // February
      2: ['Spring cleaning', 'transitional outerwear', 'fresh home accents'], // March
      3: ['Easter fashion', 'spring jackets', 'garden accessories'], // April
      4: ['Mother\'s Day gifts', 'summer prep', 'outdoor furniture'], // May
      5: ['Summer fashion', 'graduation outfits', 'vacation accessories'], // June
      6: ['beach wear', 'summer dresses', 'outdoor entertaining'], // July
      7: ['back-to-school', 'summer clearance', 'office wear'], // August
      8: ['fall fashion', 'back-to-school', 'autumn decor'], // September
      9: ['Halloween costumes', 'cozy sweaters', 'fall accessories'], // October
      10: ['holiday fashion', 'winter prep', 'gift ideas'], // November
      11: ['holiday gifts', 'party outfits', 'winter accessories'] // December
    };
    
    return seasonalMap[month] || ['general fashion', 'home essentials', 'accessories'];
  }

  analyzePricingTrends(listings) {
    const prices = listings.map(item => parseFloat(item.price.replace('$', '')));
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length || 0;
    const minPrice = Math.min(...prices) || 0;
    const maxPrice = Math.max(...prices) || 0;
    
    return {
      average_price: Math.round(avgPrice),
      price_range: { min: minPrice, max: maxPrice },
      sweet_spot: Math.round(avgPrice * 0.8), // 20% below average often sells faster
      recommendation: avgPrice > 40 ? 'Consider more budget-friendly options' : 'Good price range for quick sales'
    };
  }

  analyzeSocialTrends(dailyReports) {
    const totalPosts = dailyReports.reduce((sum, report) => 
      sum + (report.social_posts?.generated || 0), 0
    );
    
    return {
      weekly_posts: totalPosts,
      most_active_platform: 'instagram', // Mock data
      engagement_trend: 'increasing',
      best_performing_content: 'styling videos',
      recommendation: 'Focus more on video content for higher engagement'
    };
  }

  async saveWeeklyReport(kpis, performance, recommendations, trends) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    
    const report = {
      date: new Date().toISOString().split('T')[0],
      week_start: weekStart.toISOString().split('T')[0],
      type: 'weekly_analytics',
      kpis,
      performance_analysis: performance,
      recommendations,
      trends,
      summary: {
        total_revenue: kpis.gross_revenue,
        profit_margin: `${kpis.profit_margin}%`,
        active_listings: kpis.active_listings,
        conversion_rate: `${kpis.listing_conversion_rate}%`,
        top_priority_actions: recommendations.filter(r => r.priority === 'high').length
      },
      next_week_goals: {
        new_listings: Math.max(5, Math.floor(kpis.active_listings * 0.2)),
        revenue_target: Math.round(kpis.gross_revenue * 1.1),
        social_posts: Math.max(14, kpis.social_engagement.posts_generated * 1.2),
        optimization_focus: recommendations[0]?.category || 'general'
      }
    };
    
    // Save to Firebase
    const reportId = await saveReport('weekly_analytics', report);
    
    // Save analytics data
    await saveAnalytics('weekly_kpis', kpis);
    
    // Also save locally for backup (optional)
    const filename = `weekly-report-${report.date}.json`;
    const reportPath = path.join(this.reportsPath, filename);
    
    try {
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      console.log(`✅ Weekly report saved locally to ${filename} and to Firebase (${reportId})`);
    } catch (error) {
      console.log(`✅ Weekly report saved to Firebase (${reportId})`);
      console.log(`⚠️ Could not save local backup: ${error.message}`);
    }
    
    return report;
  }

  async run() {
    try {
      console.log('📊 Running Photo2Profit Weekly Analytics...');
      
      // Initialize Firebase connection
      await initializeFirebase();
      
      // Load agent config
      this.agentConfig = await this.loadAgentConfig();
      
      // Load data from Firebase
      const listings = await this.loadListings();
      const dailyReports = await this.loadDailyReports();
      
      console.log(`📦 Analyzing ${listings.length} listings from Firestore`);
      console.log(`📈 Processing ${dailyReports.length} daily reports from Firestore`);
      
      // Calculate KPIs
      const kpis = this.calculateKPIs(listings, dailyReports);
      console.log(`💰 Weekly revenue: $${kpis.gross_revenue}`);
      
      // Analyze performance
      const performance = this.analyzePerformance(kpis);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(kpis, performance);
      console.log(`💡 Generated ${recommendations.length} recommendations`);
      
      // Identify trends
      const trends = this.identifyTrends(listings, dailyReports);
      
      // Save weekly report
      const report = await this.saveWeeklyReport(kpis, performance, recommendations, trends);
      
      console.log('✨ Weekly analytics complete!');
      console.log(`📊 Check reports/weekly-report-${report.date}.json for full analysis`);
      
      // Print summary
      console.log('\n📋 WEEKLY SUMMARY:');
      console.log(`💰 Revenue: $${kpis.gross_revenue} (${kpis.profit_margin}% margin)`);
      console.log(`📦 Active Listings: ${kpis.active_listings}`);
      console.log(`🎯 Conversion Rate: ${kpis.listing_conversion_rate}%`);
      console.log(`⚡ Top Priority: ${recommendations[0]?.action || 'Keep up the great work!'}`);
      
    } catch (error) {
      console.error('❌ Error running weekly analytics:', error);
      process.exit(1);
    }
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  new Photo2ProfitWeekly().run();
}

export default Photo2ProfitWeekly;