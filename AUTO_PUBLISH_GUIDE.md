# Automated Batch Publishing Guide

## Overview

The Photo2Profit app includes **automated batch publishing** to eBay and Facebook Marketplace. Instead of manually publishing each product, the system intelligently batches uploads and publishes them automatically.

### Why Batch Publishing?

- **Avoid API Rate Limits**: Burst uploads can trigger throttling on eBay/Facebook
- **Enable Review Workflow**: Create products in bulk, review, then auto-publish
- **Professional Pipeline**: Mimics real e-commerce workflows (photo shoot → batch → publish)
- **Prevent Spam Detection**: Gradual publishing looks more legitimate to marketplace algorithms

## Publishing Strategies

### 1. **Threshold-Based Publishing** (Default)

Products are automatically published when you hit a certain count.

**How it works:**
- Set `AUTO_PUBLISH_THRESHOLD=5` (default)
- Upload products as normal via `/api/upload` or `/magic`
- When you reach 5 unpublished products, they're **all** published automatically
- Check console for: `✅ Auto-publish triggered`

**Best for:**
- Regular photo shoot sessions
- Bulk upload workflows
- Consistent product creation patterns

### 2. **Time-Based Publishing** (Cloud Scheduler)

Products are published on a schedule (e.g., every hour).

**How it works:**
- Set up Google Cloud Scheduler to hit `/admin/publish-all-pending`
- Runs hourly (or custom schedule)
- Publishes all unpublished products across all users
- Sends summary report

**Best for:**
- Multiple users uploading independently
- Predictable marketplace posting times
- High-volume operations

## Configuration

### Environment Variables

```bash
# Enable/disable auto-publishing
AUTO_PUBLISH_ENABLED="true"

# How many unpublished products trigger auto-publish
AUTO_PUBLISH_THRESHOLD="5"

# Which marketplaces to publish to
AUTO_PUBLISH_CHANNELS="ebay,facebook"

# API key for admin routes (Cloud Scheduler)
ADMIN_API_KEY="your-secure-random-string"

# eBay API credentials
EBAY_OAUTH_TOKEN="v^1.1#i^1#..."

# Facebook/Meta credentials
FACEBOOK_ACCESS_TOKEN="EAABsbCS..."
FB_CATALOG_ID="123456789"
```

### Product Schema

All products now include publishing metadata:

```javascript
{
  id: "abc123",
  image: "data:image/png;base64,...",
  description: "Product title and description",
  prices: { average: 45, listings: [...] },
  userEmail: "user@example.com",
  
  // Publishing fields
  published: false,              // Status
  channels: ["ebay", "facebook"], // Where to publish
  publishedAt: null,              // Timestamp when published
  publishResults: {               // Results from each channel
    ebay: { success: true, ebayId: "..." },
    facebook: { success: true, facebookId: "..." }
  }
}
```

## API Endpoints

### 1. Check Publishing Config

```bash
GET /admin/publish-config
Authorization: Bearer <your-jwt>
```

**Response:**
```json
{
  "config": {
    "enabled": true,
    "threshold": 5,
    "channels": ["ebay", "facebook"]
  },
  "userEmail": "user@example.com",
  "unpublishedCount": 3,
  "thresholdReached": false
}
```

### 2. Manually Publish Your Products

```bash
POST /admin/publish-my-products
Authorization: Bearer <your-jwt>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "successCount": 4,
  "errorCount": 1,
  "results": [
    {
      "productId": "abc123",
      "results": {
        "ebay": { "success": true, "ebayId": "110123..." },
        "facebook": { "success": true, "facebookId": "987..." }
      }
    }
  ]
}
```

### 3. Publish All Users' Products (Admin/Cron)

```bash
POST /admin/publish-all-pending
X-API-Key: your-admin-api-key

# OR with query param
POST /admin/publish-all-pending?key=your-admin-api-key
```

**Response:**
```json
{
  "success": true,
  "totalPublished": 47,
  "totalErrors": 2
}
```

### 4. Cloud Scheduler Endpoint (Simplified)

```bash
POST /api/publish/pending
# No authentication needed - uses OIDC from Cloud Scheduler
```

**Response:**
```json
{
  "message": "Successfully published 12 products",
  "published": 12,
  "errors": 0
}
```

**This is the recommended endpoint for Cloud Scheduler** - it's simpler and uses OIDC authentication.

## Setting Up Marketplaces

### eBay Integration

1. **Create eBay Developer Account**
   - Go to https://developer.ebay.com
   - Create an app in Production environment

2. **Generate OAuth Token**
   ```bash
   # Use eBay OAuth flow to get user consent
   # Store the resulting access token
   export EBAY_OAUTH_TOKEN="v^1.1#i^1#..."
   ```

3. **Test Publishing**
   ```bash
   curl -X POST https://your-api.com/admin/publish-my-products \
     -H "Authorization: Bearer YOUR_JWT"
   ```

**Required eBay Permissions:**
- `https://api.ebay.com/oauth/api_scope/sell.inventory`
- `https://api.ebay.com/oauth/api_scope/sell.inventory.readonly`

### Facebook Marketplace Integration

1. **Create Facebook App**
   - Go to https://developers.facebook.com
   - Create Business app with Catalog permission

2. **Create Product Catalog**
   - In Business Manager, create new catalog
   - Note the Catalog ID

3. **Generate Page Access Token**
   ```bash
   # Use Facebook Graph API Explorer
   # Request permissions: catalog_management, pages_manage_posts
   export FACEBOOK_ACCESS_TOKEN="EAABsbCS..."
   export FB_CATALOG_ID="123456789"
   ```

4. **Test Publishing**
   ```bash
   curl -X POST https://your-api.com/admin/publish-my-products \
     -H "Authorization: Bearer YOUR_JWT"
   ```

**Required Facebook Permissions:**
- `catalog_management`
- `pages_manage_posts`
- `business_management`

## Cloud Scheduler Setup (Time-Based Publishing)

**📚 Full Guide:** See [`CLOUD_SCHEDULER_SETUP.md`](./CLOUD_SCHEDULER_SETUP.md) for complete instructions with examples and troubleshooting.

### Quick Setup

**Option 1: Using OIDC (Recommended)**
```bash
gcloud scheduler jobs create http autopublish-photo2profit \
  --schedule="0 * * * *" \
  --uri="https://photo2profit-api-758851214311.us-west2.run.app/api/publish/pending" \
  --http-method=POST \
  --oidc-service-account-email="758851214311-compute@developer.gserviceaccount.com" \
  --location="us-west2"
```

**Option 2: Using API Key**
```bash
gcloud scheduler jobs create http publish-products \
  --schedule="0 * * * *" \
  --uri="https://your-api-url.run.app/admin/publish-all-pending" \
  --http-method=POST \
  --headers="X-API-Key=your-admin-api-key" \
  --location="us-west2"
```

### Custom Schedules

```bash
# Every 30 minutes
--schedule="*/30 * * * *"

# Every day at 9 AM
--schedule="0 9 * * *"

# Every weekday at 6 PM
--schedule="0 18 * * 1-5"

# Twice daily (9 AM and 5 PM)
--schedule="0 9,17 * * *"
```

### Monitor Scheduler

```bash
# List jobs
gcloud scheduler jobs list --location=us-west2

# View job details
gcloud scheduler jobs describe autopublish-photo2profit --location=us-west2

# Manually trigger (for testing)
gcloud scheduler jobs run autopublish-photo2profit --location=us-west2
```

## Workflow Examples

### Example 1: Photo Shoot Workflow

```
1. User takes 50 product photos
2. Uploads all via drag-and-drop
3. After every 5 uploads, batch auto-publishes
4. Result: 10 publishing batches, avoiding rate limits
```

### Example 2: Review Before Publish

```
1. Set AUTO_PUBLISH_ENABLED="false"
2. Upload products throughout the day
3. Review/edit descriptions and prices
4. Manually trigger: POST /admin/publish-my-products
5. All reviewed products publish at once
```

### Example 3: Multi-User Platform

```
1. 100 users each upload 3 products per day
2. Cloud Scheduler runs hourly
3. Each hour: publishes ~12 products (300/day ÷ 24 hours)
4. Smooth, distributed publishing
```

## Monitoring & Logs

### Check Auto-Publish Status

```bash
# View unpublished count
curl https://your-api.com/admin/publish-config \
  -H "Authorization: Bearer YOUR_JWT"
```

### Server Logs

Look for these indicators:

```
✅ Auto-publish triggered for user@example.com
📊 Unpublished products for user@example.com: 5/5
🚀 Threshold reached! Publishing 5 products...
📤 Publishing product abc123...
✅ Product abc123 published
```

### Failed Publishing

Products that fail to publish remain unpublished and can be retried:

```javascript
{
  published: false,
  publishResults: {
    ebay: { success: false, error: "Rate limit exceeded" },
    facebook: { success: true, facebookId: "987..." }
  }
}
```

Retry failed products:
```bash
POST /admin/publish-my-products
```

## Troubleshooting

### "eBay token not configured"

**Problem:** `EBAY_OAUTH_TOKEN` not set

**Solution:**
```bash
export EBAY_OAUTH_TOKEN="v^1.1#..."
# Restart server
```

### "Facebook not configured"

**Problem:** Missing `FACEBOOK_ACCESS_TOKEN` or `FB_CATALOG_ID`

**Solution:**
```bash
export FACEBOOK_ACCESS_TOKEN="EAABsbCS..."
export FB_CATALOG_ID="123456789"
```

### "Rate limit exceeded"

**Problem:** Too many API calls to eBay/Facebook

**Solutions:**
- Increase `AUTO_PUBLISH_THRESHOLD` to publish less frequently
- Use time-based publishing with longer intervals
- Stagger Cloud Scheduler across multiple times

### Products Not Auto-Publishing

**Check:**
1. Is `AUTO_PUBLISH_ENABLED="true"`?
2. Are you reaching the threshold? Check `/admin/publish-config`
3. Are marketplace tokens configured?
4. Check server logs for errors

### Cloud Scheduler Not Triggering

**Debug:**
```bash
# Check job status
gcloud scheduler jobs describe publish-products

# View recent runs
gcloud scheduler jobs list --format="table(name, schedule, state, lastAttemptTime)"

# Test manually
gcloud scheduler jobs run publish-products

# Check Cloud Logging
gcloud logging read "resource.type=cloud_scheduler_job AND resource.labels.job_id=publish-products"
```

## Cost Estimates

### API Costs

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| eBay API | 5,000 calls/day | $0.001/call | Inventory API calls |
| Facebook Catalog | Unlimited | Free | Product uploads free |
| Cloud Scheduler | 3 jobs free | $0.10/job/month | Time-based publishing |

### Example: 1000 Products/Month

- **eBay:** ~1000 calls = Free tier
- **Facebook:** Free
- **Cloud Scheduler:** 1 job = Free
- **Total:** $0/month

## Security Best Practices

1. **Protect Admin API Key**
   ```bash
   # Use strong random string
   ADMIN_API_KEY=$(openssl rand -base64 32)
   ```

2. **Rotate OAuth Tokens**
   - eBay tokens expire after 2 hours (use refresh tokens)
   - Facebook tokens expire after 60 days (set calendar reminder)

3. **Rate Limit Admin Endpoints**
   ```javascript
   // Add to server.js
   const rateLimit = require('express-rate-limit');
   
   const publishLimiter = rateLimit({
     windowMs: 60 * 60 * 1000, // 1 hour
     max: 10, // 10 requests per hour
   });
   
   app.post('/admin/publish-all-pending', publishLimiter, ...);
   ```

4. **Monitor Failed Publishes**
   - Set up alerts for high error rates
   - Log failed products for manual review

## Advanced Features

### Custom Publishing Rules

Extend the service to support:

```javascript
// Only publish products above $50
if (product.prices.average >= 50) {
  await publishProduct(product, userEmail);
}

// Publish to eBay only for electronics
if (product.category === 'electronics') {
  await publishProduct(product, userEmail, ['ebay']);
}
```

### Scheduled Publishing Times

```javascript
// Publish at optimal times for each marketplace
const schedule = {
  ebay: '9:00 AM EST',    // eBay peak traffic
  facebook: '7:00 PM EST', // Facebook evening engagement
};
```

### Multi-Marketplace Optimization

```javascript
// Different descriptions for different platforms
const ebayListing = formatForEbay(product);
const facebookListing = formatForFacebook(product);
```

## Next Steps

1. ✅ Set up eBay and Facebook API credentials
2. ✅ Configure environment variables
3. ✅ Test manual publishing with `/admin/publish-my-products`
4. ✅ Enable auto-publish and test threshold triggering
5. ✅ Set up Cloud Scheduler for time-based publishing
6. ✅ Monitor logs and adjust thresholds as needed

## Support

For issues or questions:
- Check server logs for detailed error messages
- Review marketplace API documentation
- Test individual API calls outside the app
- Verify OAuth tokens haven't expired
