# 🚀 Post-Deployment Checklist for Photo2Profit

This checklist should be completed after merging the PR and confirming successful deployment to production.

## 📋 Deployment Verification

### 1. Check GitHub Actions Deployment Status

- [ ] **Backend Deployment (Cloud Run)**
  - Navigate to: [Actions → Auto Deploy to Cloud Run](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/deploy.yml)
  - Verify the workflow completed successfully (green checkmark)
  - Check deployment logs for any warnings or errors
  - Confirm the Cloud Run URL is displayed in the logs

- [ ] **Frontend Deployment (Firebase Hosting)**
  - Navigate to: [Actions → Auto Deploy Frontend to Firebase Hosting](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/frontend-deploy.yml)
  - Verify the workflow completed successfully (green checkmark)
  - Check deployment logs for build success
  - Confirm backend health check passed before deployment

### 2. Access Deployment Logs

#### Cloud Run Logs (Backend)

```bash
# View Cloud Run deployment logs
gcloud run services logs read photo2profit-api --region us-west2 --project photo2profitbaddie --limit 100

# Or access via Google Cloud Console:
# https://console.cloud.google.com/run/detail/us-west2/photo2profit-api/logs
```

#### Firebase Hosting Logs (Frontend)

```bash
# View Firebase Hosting deployment history
firebase hosting:channel:list --project photo2profitbaddie

# Or access via Firebase Console:
# https://console.firebase.google.com/project/photo2profitbaddie/hosting/sites
```

#### GitHub Actions Logs

- Go to: https://github.com/baddiehustleai-star/jubilant-happiness/actions
- Click on the latest workflow run
- Review each step's logs for any issues

---

## 🧪 Sanity Check & Smoke Testing

### 3. Verify Backend API Health

- [ ] **Health Check Endpoint**

  ```bash
  # Check backend health
  curl https://photo2profit-api-[HASH]-uw.a.run.app/api/health

  # Expected response: 200 OK
  ```

- [ ] **SEO Refresh Endpoint**

  ```bash
  # Test SEO refresh (if CRON_SECRET is set)
  curl -X POST -H "x-cron-secret: YOUR_CRON_SECRET" \
    https://photo2profit-api-[HASH]-uw.a.run.app/api/seo/refresh

  # Expected response: {"success":true}
  ```

### 4. Frontend Application Testing

- [ ] **Open Live Application**
  - Visit: https://photo2profitbaddie.web.app (or your custom domain)
  - Verify the page loads without errors
  - Check browser console for JavaScript errors (F12 → Console)

- [ ] **User Authentication Flow**
  - Navigate to Login/Signup page
  - Test user registration (create a test account)
  - Test login functionality
  - Test logout functionality
  - Verify Firebase Authentication is working

- [ ] **Core Features Test**
  - Test image upload functionality
  - Verify image preview works
  - Check that uploaded images are processed correctly
  - Test any AI-powered features (listing generation, etc.)

### 5. Payment Integration (Stripe)

- [ ] **Test Payment Flow**
  - Navigate to pricing/checkout page
  - Click "Subscribe" or "Start Trial"
  - Complete test checkout using Stripe test card:
    - Card: `4242 4242 4242 4242`
    - Date: Any future date
    - CVC: Any 3 digits
    - ZIP: Any 5 digits
  - Verify redirect to success page
  - Check Stripe Dashboard for test payment

- [ ] **Verify Stripe Webhook** (if configured)
  - Check that subscription events are being received
  - Verify user access is granted after successful payment

### 6. Cross-Platform Integration Tests

- [ ] **Test Export Functionality**
  - Create a test listing
  - Generate CSV export for various platforms:
    - [ ] eBay
    - [ ] Poshmark
    - [ ] Mercari
    - [ ] Depop
  - Verify CSV format and data accuracy

- [ ] **Test API Integrations**
  - Verify eBay API connection (if configured)
  - Test image background removal (if RemoveBG is configured)
  - Check any third-party API integrations

---

## 📊 Monitoring & Alerts

### 7. Set Up Monitoring

- [ ] **Google Cloud Monitoring (Cloud Run)**
  - Set up alerts for:
    - High error rates (>5% 5xx errors)
    - High latency (>2s response time)
    - Memory/CPU usage threshold alerts
  - Configure notification channels (email, Slack)

- [ ] **Firebase Performance Monitoring**
  - Enable performance monitoring in Firebase Console
  - Monitor page load times
  - Track user engagement metrics

- [ ] **Error Tracking** (Sentry - if configured)
  - Verify Sentry is receiving error reports
  - Set up alert rules for critical errors
  - Check error rate is acceptable (<1%)

### 8. Review Slack Notifications (if configured)

- [ ] Verify deployment notifications are being sent to Slack
- [ ] Check that success/failure alerts are working
- [ ] Update notification channels if needed

---

## 🔐 Security & Configuration

### 9. Verify Environment Variables

- [ ] **GitHub Actions Secrets**
  - [ ] `GOOGLE_APPLICATION_CREDENTIALS_JSON` is set
  - [ ] `FIREBASE_SERVICE_ACCOUNT` is set
  - [ ] `SLACK_WEBHOOK_URL` is set (optional)
  - [ ] `CRON_SECRET` is set (optional)

- [ ] **Production Environment Variables**
  - [ ] Stripe keys are production keys (not test)
  - [ ] Firebase config is for production project
  - [ ] API keys are properly secured
  - [ ] No secrets are exposed in client-side code

### 10. Security Checks

- [ ] **SSL/TLS Certificate**
  - Verify HTTPS is working on both frontend and backend
  - Check certificate validity (should be auto-managed by Cloud Run/Firebase)

- [ ] **CORS Configuration**
  - Verify frontend can communicate with backend
  - Check that CORS is properly configured to allow your domain

- [ ] **Authentication & Authorization**
  - Test that protected routes require authentication
  - Verify Firebase Security Rules are properly configured
  - Test that users can only access their own data

---

## 📈 Performance & Optimization

### 11. Performance Validation

- [ ] **Page Load Speed**
  - Run Google PageSpeed Insights
  - Target: >90 score on mobile and desktop
  - Address any critical performance issues

- [ ] **API Response Times**
  - Check Cloud Run metrics for average response time
  - Target: <500ms for most endpoints
  - Investigate any slow endpoints

- [ ] **Asset Optimization**
  - Verify images are properly compressed
  - Check that CSS/JS bundles are minified
  - Confirm CDN is serving static assets (if configured)

### 12. Database Performance (Firebase)

- [ ] Check Firestore read/write metrics
- [ ] Verify indexes are created for common queries
- [ ] Monitor Firebase quota usage
- [ ] Set up billing alerts to avoid unexpected charges

---

## 📝 Documentation & Communication

### 13. Update Documentation

- [ ] Update README.md with production URLs
- [ ] Document any configuration changes
- [ ] Update API documentation (if applicable)
- [ ] Create/update user guides or help documentation

### 14. Team Communication

- [ ] Notify team that deployment is complete
- [ ] Share production URLs and access instructions
- [ ] Document any known issues or limitations
- [ ] Schedule post-deployment review meeting (if needed)

### 15. User Communication (if applicable)

- [ ] Announce new features to users (email, social media)
- [ ] Update changelog or release notes
- [ ] Address any user-reported issues promptly

---

## 🎯 Optional: Advanced Monitoring

### 16. Set Up Advanced Analytics

- [ ] Configure Google Analytics 4 (if not already set up)
- [ ] Set up conversion tracking for key actions:
  - User signups
  - Subscription purchases
  - Listing creations
- [ ] Create custom dashboards in Google Analytics

### 17. A/B Testing (if applicable)

- [ ] Verify A/B testing tools are working (if configured)
- [ ] Set up experiments for new features
- [ ] Monitor test results

---

## ✅ Final Verification

### 18. Complete Smoke Test Checklist

- [ ] Homepage loads correctly
- [ ] User can sign up/login
- [ ] User can upload an image
- [ ] User can create a listing
- [ ] User can export to platforms
- [ ] Payment flow works end-to-end
- [ ] No console errors or warnings
- [ ] All critical user flows work as expected

### 19. Rollback Plan (Know Before You Need It)

If critical issues are discovered:

1. **Frontend Rollback (Firebase)**

   ```bash
   firebase hosting:rollback --project photo2profitbaddie
   ```

2. **Backend Rollback (Cloud Run)**

   ```bash
   # List revisions
   gcloud run revisions list --service photo2profit-api --region us-west2

   # Rollback to previous revision
   gcloud run services update-traffic photo2profit-api \
     --region us-west2 \
     --to-revisions REVISION_NAME=100
   ```

3. **GitHub Revert**
   - Create a new PR that reverts the merge commit
   - Get quick approval and merge

---

## 🎉 Launch Complete!

Once all items are checked:

- [ ] Mark deployment as successful in project management tool
- [ ] Archive this checklist for future reference
- [ ] Start monitoring for the first 24-48 hours
- [ ] Celebrate the launch! 🎊

---

## 📞 Emergency Contacts

- **Technical Lead**: [Name/Email]
- **DevOps**: [Name/Email]
- **On-Call Engineer**: [Contact Info]
- **Google Cloud Support**: https://cloud.google.com/support
- **Firebase Support**: https://firebase.google.com/support

---

**Last Updated**: 2025-11-12
**Version**: 1.0
**Deployment Date**: [To be filled after merge]
