#!/usr/bin/env node

/**
 * Photo2Profit Monthly Pricing Refresh
 * Updates pricing strategies based on market analysis and performance data
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  fetchListings, 
  fetchReports, 
  saveReport, 
  savePricingUpdate, 
  saveListing,
  initializeFirebase 
} from './firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Photo2ProfitMonthly {
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

  async loadReports() {
    // Fetch all reports from Firebase (last 100)
    return await fetchReports(null, 100);
  }

  analyzeMarketTrends() {
    // Mock market analysis (in real implementation, this would integrate with market APIs)
    const trends = {
      fashion: {
        rising: ['Y2K revival', 'sustainable brands', 'oversized blazers', 'platform shoes'],
        declining: ['fast fashion', 'ultra-skinny jeans', 'logo-heavy items'],
        price_trends: {
          vintage_denim: '+15%',
          designer_bags: '+20%',
          athletic_wear: '+5%',
          formal_wear: '-10%'
        }
      },
      electronics: {
        rising: ['wireless earbuds', 'smart home devices', 'gaming accessories'],
        declining: ['wired headphones', 'DVDs', 'older smartphone models'],
        price_trends: {
          gaming: '+25%',
          audio: '+10%',
          mobile: '-5%',
          computing: 'stable'
        }
      },
      home_decor: {
        rising: ['minimalist design', 'plants', 'vintage furniture', 'sustainable materials'],
        declining: ['mass-produced decor', 'plastic items'],
        price_trends: {
          vintage_furniture: '+30%',
          plants: '+20%',
          lighting: '+15%',
          textiles: '+10%'
        }
      },
      seasonal_factors: this.getSeasonalFactors()
    };
    
    return trends;
  }

  getSeasonalFactors() {
    const month = new Date().getMonth();
    const seasonalMap = {
      0: { factor: 0.9, reason: 'Post-holiday slowdown' }, // January
      1: { factor: 0.95, reason: 'Winter clearance period' }, // February
      2: { factor: 1.1, reason: 'Spring cleaning surge' }, // March
      3: { factor: 1.15, reason: 'Spring fashion demand' }, // April
      4: { factor: 1.2, reason: 'Pre-summer shopping' }, // May
      5: { factor: 1.1, reason: 'Graduation season' }, // June
      6: { factor: 1.0, reason: 'Summer vacation impact' }, // July
      7: { factor: 1.05, reason: 'Back-to-school prep' }, // August
      8: { factor: 1.25, reason: 'Fall fashion peak' }, // September
      9: { factor: 1.2, reason: 'Halloween costume season' }, // October
      10: { factor: 1.3, reason: 'Holiday shopping begins' }, // November
      11: { factor: 1.4, reason: 'Holiday gift peak' } // December
    };
    
    return seasonalMap[month] || { factor: 1.0, reason: 'Normal market conditions' };
  }

  async calculatePricingAdjustments(listings, marketTrends, performanceData) {
    const adjustments = [];
    const seasonalFactor = marketTrends.seasonal_factors.factor;
    
    for (const item of listings) {
      const currentPrice = parseFloat(item.price.replace('$', ''));
      const category = this.categorizeItem(item);
      const performance = this.getItemPerformance(item);
      
      let adjustment = {
        item: item.title,
        current_price: item.price,
        category: category,
        recommendations: []
      };
      
      // Market trend adjustments
      const trendAdjustment = this.calculateTrendAdjustment(item, marketTrends, category);
      if (trendAdjustment !== 0) {
        const newPrice = Math.round(currentPrice * (1 + trendAdjustment));
        adjustment.recommendations.push({
          type: 'market_trend',
          current: currentPrice,
          suggested: newPrice,
          change_percent: Math.round(trendAdjustment * 100),
          reason: `Market trends show ${trendAdjustment > 0 ? 'increasing' : 'decreasing'} demand for ${category}`
        });
      }
      
      // Seasonal adjustments
      if (seasonalFactor !== 1.0) {
        const seasonalPrice = Math.round(currentPrice * seasonalFactor);
        adjustment.recommendations.push({
          type: 'seasonal',
          current: currentPrice,
          suggested: seasonalPrice,
          change_percent: Math.round((seasonalFactor - 1) * 100),
          reason: marketTrends.seasonal_factors.reason
        });
      }
      
      // Performance-based adjustments
      const perfAdjustment = this.calculatePerformanceAdjustment(performance);
      if (perfAdjustment !== 0) {
        const perfPrice = Math.round(currentPrice * (1 + perfAdjustment));
        adjustment.recommendations.push({
          type: 'performance',
          current: currentPrice,
          suggested: perfPrice,
          change_percent: Math.round(perfAdjustment * 100),
          reason: this.getPerformanceReason(performance)
        });
      }
      
      // Calculate final recommended price
      if (adjustment.recommendations.length > 0) {
        const avgSuggested = adjustment.recommendations.reduce((sum, rec) => 
          sum + rec.suggested, 0) / adjustment.recommendations.length;
        
        adjustment.final_recommendation = {
          suggested_price: Math.round(avgSuggested),
          confidence: this.calculateConfidence(adjustment.recommendations),
          priority: this.calculatePriority(currentPrice, avgSuggested, performance)
        };
        
        // Save pricing update to Firebase
        await savePricingUpdate(item.id, {
          suggestedPrice: adjustment.final_recommendation.suggested_price,
          confidence: adjustment.final_recommendation.confidence,
          priority: adjustment.final_recommendation.priority,
          recommendations: adjustment.recommendations,
          marketTrends: category,
          performanceData: performance
        });
        
        adjustments.push(adjustment);
      }
    }
    
    return adjustments.sort((a, b) => 
      b.final_recommendation.priority - a.final_recommendation.priority
    );
  }

  categorizeItem(item) {
    const title = item.title.toLowerCase();
    const tags = item.tags.map(tag => tag.toLowerCase());
    
    if (title.includes('vintage') || tags.includes('vintage')) return 'vintage';
    if (title.includes('designer') || title.includes('luxury')) return 'designer';
    if (title.includes('electronics') || title.includes('tech')) return 'electronics';
    if (tags.includes('denim') || title.includes('jeans')) return 'denim';
    if (tags.includes('tools') || title.includes('tool')) return 'tools';
    if (tags.includes('style') || tags.includes('fashion')) return 'fashion';
    
    return 'general';
  }

  calculateTrendAdjustment(item, trends, category) {
    // Simple trend-based adjustment logic
    const trendMap = {
      vintage: 0.15,      // Vintage items trending up
      designer: 0.20,     // Designer items strong
      electronics: 0.05,  // Electronics moderate growth
      denim: 0.10,        // Denim stable to growing
      tools: 0.00,        // Tools stable
      fashion: 0.08,      // General fashion growing
      general: 0.00       // No specific trend
    };
    
    return trendMap[category] || 0;
  }

  getItemPerformance(item) {
    // Mock performance data (in real implementation, track actual metrics)
    return {
      views: Math.floor(Math.random() * 100) + 20,
      likes: Math.floor(Math.random() * 20) + 2,
      messages: Math.floor(Math.random() * 5),
      days_listed: Math.floor(Math.random() * 30) + 1,
      price_changes: Math.floor(Math.random() * 3)
    };
  }

  calculatePerformanceAdjustment(performance) {
    // Performance-based pricing logic
    let adjustment = 0;
    
    // High engagement but no sales = price too high
    if (performance.views > 50 && performance.messages < 2 && performance.days_listed > 14) {
      adjustment -= 0.10; // Reduce price by 10%
    }
    
    // Low engagement = may need price reduction to attract attention
    if (performance.views < 20 && performance.days_listed > 7) {
      adjustment -= 0.05; // Reduce price by 5%
    }
    
    // High engagement with messages = can potentially increase price
    if (performance.views > 70 && performance.messages >= 3 && performance.days_listed < 7) {
      adjustment += 0.05; // Increase price by 5%
    }
    
    return adjustment;
  }

  getPerformanceReason(performance) {
    if (performance.views > 50 && performance.messages < 2) {
      return 'High views but low inquiries suggest price may be too high';
    }
    if (performance.views < 20) {
      return 'Low visibility - price reduction may increase interest';
    }
    if (performance.messages >= 3) {
      return 'High interest indicates potential for price increase';
    }
    return 'Standard performance-based adjustment';
  }

  calculateConfidence(recommendations) {
    // Higher confidence when multiple factors align
    if (recommendations.length >= 3) return 'high';
    if (recommendations.length === 2) return 'medium';
    return 'low';
  }

  calculatePriority(currentPrice, suggestedPrice, performance) {
    let priority = 0;
    
    // Higher priority for larger price changes
    const priceChange = Math.abs(suggestedPrice - currentPrice) / currentPrice;
    priority += priceChange * 100;
    
    // Higher priority for older listings
    priority += performance.days_listed * 2;
    
    // Higher priority for items with high engagement but no sales
    if (performance.views > 50 && performance.messages < 2) {
      priority += 20;
    }
    
    return Math.round(priority);
  }

  generateMarketInsights(trends, adjustments) {
    const insights = {
      trending_categories: this.identifyTrendingCategories(trends),
      pricing_opportunities: this.identifyPricingOpportunities(adjustments),
      inventory_recommendations: this.generateInventoryRecommendations(trends),
      competitive_analysis: this.mockCompetitiveAnalysis(),
      seasonal_strategy: this.generateSeasonalStrategy(trends.seasonal_factors)
    };
    
    return insights;
  }

  identifyTrendingCategories(trends) {
    const trending = [];
    
    Object.entries(trends).forEach(([category, data]) => {
      if (data.rising && data.rising.length > 0) {
        trending.push({
          category: category,
          rising_items: data.rising.slice(0, 3),
          opportunity: `Focus on sourcing ${data.rising[0]} for maximum profit potential`
        });
      }
    });
    
    return trending;
  }

  identifyPricingOpportunities(adjustments) {
    const opportunities = adjustments
      .filter(adj => adj.final_recommendation.confidence === 'high')
      .slice(0, 5)
      .map(adj => ({
        item: adj.item,
        current_price: adj.current_price,
        suggested_price: adj.final_recommendation.suggested_price,
        potential_gain: adj.final_recommendation.suggested_price - parseFloat(adj.current_price.replace('$', '')),
        category: adj.category
      }));
    
    return opportunities;
  }

  generateInventoryRecommendations(trends) {
    const recommendations = [];
    
    // Fashion recommendations
    if (trends.fashion) {
      recommendations.push({
        category: 'Fashion',
        action: 'source_more',
        items: trends.fashion.rising.slice(0, 3),
        reason: 'High demand trends in fashion market'
      });
    }
    
    // Electronics recommendations
    if (trends.electronics) {
      recommendations.push({
        category: 'Electronics',
        action: 'selective_sourcing',
        items: trends.electronics.rising.slice(0, 2),
        reason: 'Technology trends favor these categories'
      });
    }
    
    return recommendations;
  }

  mockCompetitiveAnalysis() {
    return {
      market_position: 'competitive',
      price_comparison: {
        above_market: 15,
        at_market: 60,
        below_market: 25
      },
      recommendations: [
        'Maintain competitive pricing on high-demand items',
        'Consider premium pricing for unique vintage pieces',
        'Bundle slow-moving items for better value proposition'
      ]
    };
  }

  generateSeasonalStrategy(seasonalFactors) {
    const strategy = {
      current_factor: seasonalFactors.factor,
      market_condition: seasonalFactors.reason,
      recommendations: []
    };
    
    if (seasonalFactors.factor > 1.1) {
      strategy.recommendations.push('Increase inventory for high-demand season');
      strategy.recommendations.push('Consider premium pricing on seasonal items');
    } else if (seasonalFactors.factor < 0.95) {
      strategy.recommendations.push('Focus on clearance and competitive pricing');
      strategy.recommendations.push('Prepare inventory for next season');
    }
    
    return strategy;
  }

  async saveMonthlyReport(adjustments, insights, trends) {
    const report = {
      date: new Date().toISOString().split('T')[0],
      type: 'monthly_pricing_refresh',
      market_analysis: trends,
      pricing_adjustments: {
        total_items_analyzed: adjustments.length,
        high_priority_adjustments: adjustments.filter(a => a.final_recommendation.priority > 50).length,
        average_price_change: this.calculateAveragePriceChange(adjustments),
        adjustments: adjustments
      },
      market_insights: insights,
      action_plan: {
        immediate_actions: this.generateImmediateActions(adjustments),
        short_term_goals: this.generateShortTermGoals(insights),
        long_term_strategy: this.generateLongTermStrategy(trends)
      },
      next_review_date: this.calculateNextReviewDate()
    };
    
    // Save to Firebase
    const reportId = await saveReport('monthly_pricing_refresh', report);
    
    // Also save locally for backup (optional)
    const filename = `monthly-pricing-refresh-${report.date}.json`;
    const reportPath = path.join(this.reportsPath, filename);
    
    try {
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      console.log(`✅ Monthly report saved locally to ${filename} and to Firebase (${reportId})`);
    } catch (error) {
      console.log(`✅ Monthly report saved to Firebase (${reportId})`);
      console.log(`⚠️ Could not save local backup: ${error.message}`);
    }
    
    return report;
  }

  calculateAveragePriceChange(adjustments) {
    if (adjustments.length === 0) return 0;
    
    const totalChange = adjustments.reduce((sum, adj) => {
      const current = parseFloat(adj.current_price.replace('$', ''));
      const suggested = adj.final_recommendation.suggested_price;
      return sum + ((suggested - current) / current);
    }, 0);
    
    return Math.round((totalChange / adjustments.length) * 100);
  }

  generateImmediateActions(adjustments) {
    const actions = [];
    
    const highPriority = adjustments.filter(a => a.final_recommendation.priority > 50);
    if (highPriority.length > 0) {
      actions.push(`Update pricing on ${highPriority.length} high-priority items`);
    }
    
    const significantReductions = adjustments.filter(a => {
      const current = parseFloat(a.current_price.replace('$', ''));
      return a.final_recommendation.suggested_price < current * 0.9;
    });
    
    if (significantReductions.length > 0) {
      actions.push(`Consider promotional pricing for ${significantReductions.length} items`);
    }
    
    return actions;
  }

  generateShortTermGoals(insights) {
    const goals = [];
    
    if (insights.trending_categories.length > 0) {
      goals.push(`Source more ${insights.trending_categories[0].category} items`);
    }
    
    if (insights.pricing_opportunities.length > 0) {
      goals.push('Implement recommended pricing changes within 1 week');
    }
    
    goals.push('Monitor market response to pricing adjustments');
    
    return goals;
  }

  generateLongTermStrategy(trends) {
    return [
      'Develop expertise in trending categories',
      'Build relationships with suppliers in high-demand niches',
      'Create seasonal inventory planning system',
      'Implement automated pricing adjustment triggers'
    ];
  }

  calculateNextReviewDate() {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1); // First day of next month
    return nextMonth.toISOString().split('T')[0];
  }

  async run() {
    try {
      console.log('🔄 Running Photo2Profit Monthly Pricing Refresh...');
      
      // Initialize Firebase connection
      await initializeFirebase();
      
      // Load agent config
      this.agentConfig = await this.loadAgentConfig();
      
      // Load data from Firebase
      const listings = await this.loadListings();
      const reports = await this.loadReports();
      
      console.log(`📦 Analyzing ${listings.length} listings from Firestore`);
      console.log(`📊 Processing ${reports.length} historical reports from Firestore`);
      
      // Analyze market trends
      const marketTrends = this.analyzeMarketTrends();
      console.log(`📈 Market analysis complete`);
      
      // Calculate pricing adjustments (now async)
      const adjustments = await this.calculatePricingAdjustments(listings, marketTrends, reports);
      console.log(`💰 Generated ${adjustments.length} pricing recommendations`);
      
      // Generate insights
      const insights = this.generateMarketInsights(marketTrends, adjustments);
      
      // Save monthly report
      const report = await this.saveMonthlyReport(adjustments, insights, marketTrends);
      
      console.log('✨ Monthly pricing refresh complete!');
      console.log(`📊 Check reports/monthly-pricing-refresh-${report.date}.json for full analysis`);
      
      // Print summary
      console.log('\n📋 MONTHLY SUMMARY:');
      console.log(`💰 Items requiring price adjustment: ${adjustments.length}`);
      console.log(`🎯 High priority changes: ${adjustments.filter(a => a.final_recommendation.priority > 50).length}`);
      console.log(`📈 Average price adjustment: ${report.pricing_adjustments.average_price_change}%`);
      console.log(`🔥 Top trending category: ${insights.trending_categories[0]?.category || 'General'}`);
      
      if (adjustments.length > 0) {
        console.log('\n🚀 TOP RECOMMENDATIONS:');
        adjustments.slice(0, 3).forEach((adj, index) => {
          console.log(`${index + 1}. ${adj.item}: ${adj.current_price} → $${adj.final_recommendation.suggested_price}`);
        });
      }
      
    } catch (error) {
      console.error('❌ Error running monthly pricing refresh:', error);
      process.exit(1);
    }
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  new Photo2ProfitMonthly().run();
}

export default Photo2ProfitMonthly;