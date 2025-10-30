const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const Papa = require('papaparse');

admin.initializeApp();

// Initialize SendGrid
sgMail.setApiKey(functions.config().sendgrid?.key || process.env.SENDGRID_API_KEY);

/**
 * Generate AI-powered market trend summary
 * In production, this would call an AI service (OpenAI, Anthropic, etc.)
 */
async function generateMarketTrendSummary(userListings, recentSales) {
  // Mock implementation - replace with actual AI API call
  const categories = [...new Set(userListings.map(item => item.category))];
  const avgPrice = userListings.reduce((sum, item) => sum + parseFloat(item.price || 0), 0) / userListings.length;
  
  return `
📊 **Weekly Market Insights**

Based on your ${userListings.length} active listings, here are this week's trends:

**Top Categories**: ${categories.slice(0, 3).join(', ')}
**Average Price Point**: $${avgPrice.toFixed(2)}

**Market Trends**:
- Vintage and retro items continue to perform well this season
- Sustainable fashion is seeing increased buyer interest
- Quick shipping and excellent photos drive higher conversion rates

**Recommendations**:
- Consider adjusting prices on items listed over 30 days
- Refresh your listings with new photos to boost visibility
- Cross-posting increases your reach by 3-4x on average

Keep up the great work! 💎
  `.trim();
}

/**
 * Weekly automated export function
 * Runs every Sunday at 9 AM
 */
exports.weeklyExportAutomation = functions.pubsub
  .schedule('0 9 * * 0') // Every Sunday at 9 AM
  .timeZone('America/New_York')
  .onRun(async (context) => {
    try {
      console.log('Starting weekly export automation...');
      
      const db = admin.firestore();
      const storage = admin.storage();
      
      // Get all active users
      const usersSnapshot = await db.collection('users').where('autoExport', '==', true).get();
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;
        
        console.log(`Processing user: ${userId}`);
        
        // Get user's listings
        const listingsSnapshot = await db.collection('listings')
          .where('userId', '==', userId)
          .where('status', '==', 'active')
          .get();
        
        const listings = listingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (listings.length === 0) {
          console.log(`No listings for user ${userId}, skipping...`);
          continue;
        }
        
        // Refresh pricing (mock implementation - replace with actual pricing logic)
        const updatedListings = listings.map(listing => ({
          ...listing,
          price: listing.price, // In production, apply pricing algorithm
          lastUpdated: new Date()
        }));
        
        // Generate CSVs for each platform
        const platforms = userData.platforms || ['mercari', 'depop', 'poshmark', 'ebay'];
        const exports = [];
        
        for (const platform of platforms) {
          // Generate CSV
          const csvData = generateCSVForPlatform(updatedListings, platform);
          const csvString = Papa.unparse(csvData);
          
          // Upload to Firebase Storage
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const filename = `exports/${userId}/${platform}_export_${timestamp}.csv`;
          const bucket = storage.bucket();
          const file = bucket.file(filename);
          
          await file.save(csvString, {
            contentType: 'text/csv',
            metadata: {
              metadata: {
                userId,
                platform,
                itemCount: updatedListings.length
              }
            }
          });
          
          // Get signed URL
          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
          });
          
          // Log export to Firestore
          await db.collection('exports').add({
            userId,
            platform,
            downloadURL: url,
            filename: `${platform}_export_${timestamp}.csv`,
            itemCount: updatedListings.length,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'completed'
          });
          
          exports.push({
            platform,
            url,
            filename: `${platform}_export_${timestamp}.csv`,
            itemCount: updatedListings.length
          });
        }
        
        // Generate AI market trend summary
        const marketSummary = await generateMarketTrendSummary(updatedListings, []);
        
        // Send email with download links
        await sendWeeklyExportEmail(userData.email, exports, marketSummary);
        
        console.log(`Successfully processed exports for user ${userId}`);
      }
      
      console.log('Weekly export automation completed successfully');
      return null;
      
    } catch (error) {
      console.error('Error in weekly export automation:', error);
      throw error;
    }
  });

/**
 * Generate CSV data for specific platform
 */
function generateCSVForPlatform(listings, platform) {
  switch (platform.toLowerCase()) {
    case 'mercari':
      return listings.map(item => ({
        'Title': item.title || '',
        'Description': item.description || '',
        'Price': item.price || '',
        'Category': item.category || '',
        'Brand': item.brand || '',
        'Condition': item.condition || '',
        'Shipping': item.shipping || 'Buyer Pays',
        'Weight': item.weight || '',
        'Photos': item.photos ? item.photos.join('; ') : ''
      }));
      
    case 'depop':
      return listings.map(item => ({
        'Title': item.title || '',
        'Description': item.description || '',
        'Price': item.price || '',
        'Category': item.category || '',
        'Size': item.size || '',
        'Brand': item.brand || '',
        'Condition': item.condition || '',
        'Color': item.color || '',
        'Style': item.style || '',
        'Image1': item.photos?.[0] || '',
        'Image2': item.photos?.[1] || '',
        'Image3': item.photos?.[2] || '',
        'Image4': item.photos?.[3] || ''
      }));
      
    case 'poshmark':
      return listings.map(item => ({
        'Title': item.title || '',
        'Description': item.description || '',
        'Price': item.price || '',
        'Original Price': item.originalPrice || '',
        'Category': item.category || '',
        'Subcategory': item.subcategory || '',
        'Brand': item.brand || '',
        'Size': item.size || '',
        'Color': item.color || '',
        'Condition': item.condition || '',
        'Tags': item.tags ? item.tags.join(', ') : '',
        'Photos': item.photos ? item.photos.join('; ') : ''
      }));
      
    case 'ebay':
      return listings.map(item => ({
        'Title': item.title || '',
        'Description': item.description || '',
        'StartPrice': item.price || '',
        'BuyItNowPrice': item.buyItNowPrice || item.price || '',
        'Category': item.category || '',
        'Brand': item.brand || '',
        'Condition': item.condition || '',
        'ConditionDescription': item.conditionDescription || '',
        'Duration': item.duration || '7',
        'Format': item.format || 'FixedPrice',
        'Quantity': item.quantity || '1',
        'ShippingService': item.shippingService || 'Standard',
        'ShippingCost': item.shippingCost || '0',
        'PicURL': item.photos?.[0] || ''
      }));
      
    default:
      return listings;
  }
}

/**
 * Send weekly export email to user
 */
async function sendWeeklyExportEmail(email, exports, marketSummary) {
  const exportLinks = exports.map(exp => 
    `• **${exp.platform.toUpperCase()}**: [Download CSV](${exp.url}) (${exp.itemCount} items)`
  ).join('\n');
  
  const msg = {
    to: email,
    from: 'exports@photo2profit.com', // Replace with your verified sender
    subject: '📦 Your Weekly Photo2Profit Export Report',
    text: `
Your weekly exports are ready!

${marketSummary}

📥 DOWNLOAD YOUR EXPORTS

${exportLinks}

These links will expire in 7 days.

Questions? Reply to this email or visit your dashboard.

Happy selling! 💎
The Photo2Profit Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Montserrat', sans-serif; color: #3D2B2B; background: #FAF6F2; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-family: 'Cinzel Decorative', serif; font-size: 28px; color: #B76E79; }
    .summary { background: #FCE9E9; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: pre-line; }
    .exports { margin: 30px 0; }
    .export-item { padding: 15px; background: #F8F8F8; margin: 10px 0; border-radius: 6px; }
    .button { display: inline-block; padding: 12px 30px; background: linear-gradient(90deg, #E6A4A4, #F5C26B); color: white; text-decoration: none; border-radius: 25px; font-weight: 600; }
    .footer { text-align: center; margin-top: 40px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">PHOTO<span style="color:#E6A4A4">2</span>PROFIT 💎</div>
      <h2>Your Weekly Export Report</h2>
    </div>
    
    <div class="summary">
      ${marketSummary.replace(/\n/g, '<br>')}
    </div>
    
    <div class="exports">
      <h3>📥 Download Your Exports</h3>
      ${exports.map(exp => `
        <div class="export-item">
          <strong>${exp.platform.toUpperCase()}</strong> - ${exp.itemCount} items<br>
          <a href="${exp.url}" class="button" style="margin-top: 10px;">Download CSV</a>
        </div>
      `).join('')}
    </div>
    
    <p style="text-align: center; color: #888; margin-top: 20px;">
      <small>Links expire in 7 days</small>
    </p>
    
    <div class="footer">
      <p>Happy selling! 💎</p>
      <p>The Photo2Profit Team</p>
    </div>
  </div>
</body>
</html>
    `.trim()
  };
  
  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
}

/**
 * Manual trigger for export generation
 * Can be called via HTTP for testing
 */
exports.generateExport = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const { listings, platform } = data;
  const userId = context.auth.uid;
  
  if (!listings || !platform) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
  }
  
  try {
    const db = admin.firestore();
    const storage = admin.storage();
    
    // Generate CSV
    const csvData = generateCSVForPlatform(listings, platform);
    const csvString = Papa.unparse(csvData);
    
    // Upload to Firebase Storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `exports/${userId}/${platform}_export_${timestamp}.csv`;
    const bucket = storage.bucket();
    const file = bucket.file(filename);
    
    await file.save(csvString, {
      contentType: 'text/csv',
      metadata: {
        metadata: {
          userId,
          platform,
          itemCount: listings.length
        }
      }
    });
    
    // Get public URL (or signed URL for private access)
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    // Log export to Firestore
    const exportDoc = await db.collection('exports').add({
      userId,
      platform,
      downloadURL: url,
      filename: `${platform}_export_${timestamp}.csv`,
      itemCount: listings.length,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'completed'
    });
    
    return {
      success: true,
      exportId: exportDoc.id,
      downloadURL: url,
      filename: `${platform}_export_${timestamp}.csv`,
      itemCount: listings.length
    };
    
  } catch (error) {
    console.error('Error generating export:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate export');
  }
});
