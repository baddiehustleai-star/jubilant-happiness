# Auto-Publishing Production Checklist

Use this checklist before enabling auto-publishing in production.

## 🔐 Credentials Setup

### eBay
- [ ] Created eBay Developer account at https://developer.ebay.com
- [ ] Created Production app (not Sandbox)
- [ ] Enabled OAuth 2.0
- [ ] Generated OAuth access token with scopes:
  - [ ] `https://api.ebay.com/oauth/api_scope/sell.inventory`
  - [ ] `https://api.ebay.com/oauth/api_scope/sell.inventory.readonly`
- [ ] Added `EBAY_OAUTH_TOKEN` to production environment
- [ ] Tested token with manual publish endpoint
- [ ] Set up refresh token flow (tokens expire after 2 hours)

### Facebook
- [ ] Created Facebook Business account at https://business.facebook.com
- [ ] Created Facebook App at https://developers.facebook.com
- [ ] Created Product Catalog in Business Manager
- [ ] Noted Catalog ID
- [ ] Generated Page Access Token with permissions:
  - [ ] `catalog_management`
  - [ ] `pages_manage_posts`
  - [ ] `business_management`
- [ ] Added `FACEBOOK_ACCESS_TOKEN` to production environment
- [ ] Added `FB_CATALOG_ID` to production environment
- [ ] Tested token with manual publish endpoint
- [ ] Set calendar reminder to refresh token (expires after 60 days)

## ⚙️ Configuration

### Environment Variables
- [ ] `AUTO_PUBLISH_ENABLED=true` (or `false` for manual-only)
- [ ] `AUTO_PUBLISH_THRESHOLD=5` (adjusted based on usage patterns)
- [ ] `AUTO_PUBLISH_CHANNELS=ebay,facebook` (or subset)
- [ ] `ADMIN_API_KEY` generated with `openssl rand -base64 32`
- [ ] All credentials added to Cloud Run secrets
- [ ] `.env` file NOT committed to git
- [ ] `.env.example` updated with all variables

### Database
- [ ] Firestore security rules allow product writes
- [ ] Index created for `published=false` queries (if needed for large datasets)
- [ ] Backup strategy in place for product data
- [ ] Test data cleared from production database

## 🧪 Testing

### Manual Testing
- [ ] Upload a single product
- [ ] Verify it has `published: false`
- [ ] Call `/admin/publish-my-products` manually
- [ ] Check product appears on eBay
- [ ] Check product appears on Facebook
- [ ] Verify product now has `published: true`
- [ ] Check `publishResults` contains correct IDs

### Threshold Testing
- [ ] Set `AUTO_PUBLISH_THRESHOLD=2` for testing
- [ ] Upload 2 products
- [ ] Verify auto-publish triggers
- [ ] Check server logs show: `✅ Auto-publish triggered`
- [ ] Verify both products published successfully
- [ ] Increase threshold to production value

### Error Handling
- [ ] Test with invalid eBay token (verify graceful failure)
- [ ] Test with invalid Facebook token (verify graceful failure)
- [ ] Test with one valid, one invalid token (verify partial success)
- [ ] Verify failed products remain `published: false`
- [ ] Verify failed products can be retried with manual publish

### Rate Limiting
- [ ] Upload 20 products in quick succession
- [ ] Verify no rate limit errors from eBay
- [ ] Verify no rate limit errors from Facebook
- [ ] If rate limits hit, adjust threshold or use scheduler

## 🌐 Cloud Scheduler (Optional)

If using time-based publishing:

- [ ] Created Cloud Scheduler job
- [ ] Configured schedule (e.g., `0 * * * *` for hourly)
- [ ] Set correct API URL for production
- [ ] Added `X-API-Key` header with `ADMIN_API_KEY`
- [ ] Tested manual trigger: `gcloud scheduler jobs run publish-products`
- [ ] Verified job runs successfully
- [ ] Set up Cloud Logging alerts for failures
- [ ] Configured notification email for errors

## 📊 Monitoring

### Logging
- [ ] Server logs include publishing events
- [ ] Logs capture: `✅ Auto-publish triggered`
- [ ] Logs capture: `📤 Publishing product abc123...`
- [ ] Logs capture: `❌ Product failed to publish: error`
- [ ] Cloud Logging filters created for publishing events
- [ ] Log retention configured (30 days minimum)

### Alerts
- [ ] Alert for high failure rate (>10% failures)
- [ ] Alert for zero publishes in 24 hours (if auto-publish enabled)
- [ ] Alert for Cloud Scheduler job failures
- [ ] Alert for OAuth token expiration
- [ ] Notification channel configured (email/Slack)

### Metrics
- [ ] Dashboard shows: Total products created
- [ ] Dashboard shows: Total products published
- [ ] Dashboard shows: Publish success rate
- [ ] Dashboard shows: Average time to publish
- [ ] Dashboard shows: eBay vs Facebook success rates

## 🔒 Security

### API Keys
- [ ] `ADMIN_API_KEY` is strong (32+ characters)
- [ ] API keys stored in Cloud Secret Manager
- [ ] API keys not hardcoded in code
- [ ] API keys not in git history
- [ ] Access to Secret Manager restricted to service account

### Authentication
- [ ] `/admin/publish-my-products` requires valid JWT
- [ ] `/admin/publish-all-pending` requires API key
- [ ] Rate limiting enabled on admin endpoints
- [ ] CORS configured correctly for production domain
- [ ] HTTPS enforced for all API endpoints

### Data Privacy
- [ ] Products only published with user consent
- [ ] User emails not leaked in public listings
- [ ] Sensitive data removed from published descriptions
- [ ] GDPR compliance reviewed (if applicable)
- [ ] Terms of service updated to mention auto-publishing

## 📋 Documentation

### Internal
- [ ] Team trained on auto-publishing feature
- [ ] Runbook created for common issues
- [ ] Escalation path defined for marketplace API issues
- [ ] Contact info for eBay/Facebook support documented

### External
- [ ] User documentation updated
- [ ] FAQ includes auto-publishing questions
- [ ] Help center article created
- [ ] Users notified of new feature (if applicable)

## 🚨 Rollback Plan

In case of issues:

- [ ] Know how to disable: Set `AUTO_PUBLISH_ENABLED=false`
- [ ] Know how to redeploy previous version
- [ ] Database backup recent enough to restore
- [ ] Manual publish endpoint always available as fallback
- [ ] Documented steps to unpublish products from marketplaces

## 📈 Performance

### Load Testing
- [ ] Tested with 100 products uploaded rapidly
- [ ] Tested with 1000 products in database
- [ ] Tested concurrent uploads from multiple users
- [ ] Memory usage acceptable during batch publishing
- [ ] API response times acceptable during publishing

### Optimization
- [ ] Consider batching eBay API calls (if volume high)
- [ ] Consider queuing system for large batches
- [ ] Database queries optimized with indexes
- [ ] Consider caching frequently accessed data

## 💰 Cost Management

### API Costs
- [ ] eBay API usage within free tier (or budget allocated)
- [ ] Facebook API usage monitored
- [ ] Cloud Scheduler cost acceptable ($0.10/job/month)
- [ ] Cloud Run costs projected for expected traffic
- [ ] Budget alerts configured

### Rate Limits
- [ ] eBay daily limit understood (5,000 calls/day free)
- [ ] Facebook rate limits understood
- [ ] Buffer built into thresholds to avoid limits
- [ ] Strategy defined for exceeding limits

## ✅ Launch Checklist

**Before enabling in production:**

- [ ] All credentials tested and working
- [ ] Configuration values appropriate for production
- [ ] Testing completed with real marketplace accounts
- [ ] Monitoring and alerts configured
- [ ] Team trained and ready
- [ ] Documentation complete
- [ ] Rollback plan tested
- [ ] Stakeholders notified

**After enabling:**

- [ ] Monitor logs for first 24 hours
- [ ] Check marketplace listings appear correctly
- [ ] Verify no rate limit issues
- [ ] Collect user feedback
- [ ] Adjust thresholds based on usage patterns

## 🎯 Success Metrics

Track these after launch:

- **Publishing Rate**: What % of products auto-publish vs manual?
- **Success Rate**: What % of publishes succeed first try?
- **Time to Publish**: Average time from upload to live listing
- **User Satisfaction**: Feedback on auto-publishing feature
- **Marketplace Performance**: Sales on eBay vs Facebook

---

**Last Updated**: 2025-01-11  
**Owner**: Engineering Team  
**Status**: Ready for Production

## 📞 Support Contacts

- **eBay Developer Support**: https://developer.ebay.com/support
- **Facebook Developer Support**: https://developers.facebook.com/support
- **Internal Team**: [Your team contact info]

---

**🎉 Ready to launch? Start checking boxes!**
