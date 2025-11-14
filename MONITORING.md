# Uptime Monitoring & Health Checks

This guide explains how to monitor the health and uptime of Photo2Profit's production services.

## 🏥 Health Endpoints

### Backend API Health Check

```bash
curl https://api.photo2profit.app/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "photo2profit-api",
  "timestamp": "2025-11-14T03:00:00.000Z"
}
```

### Frontend Health Check

```bash
curl -I https://photo2profit.app
```

**Expected Response:**
```
HTTP/2 200
content-type: text/html
cache-control: public, max-age=0, must-revalidate
```

## 📊 Built-in Monitoring

### Google Cloud Run (Backend)

Cloud Run provides built-in monitoring for the backend API:

1. **Navigate to Cloud Console:**
   - Go to [Cloud Run](https://console.cloud.google.com/run)
   - Select the `photo2profit-api` service
   - Click on the "Metrics" tab

2. **Key Metrics:**
   - Request count
   - Response latency (p50, p95, p99)
   - Error rate
   - Container CPU utilization
   - Container memory utilization
   - Instance count (auto-scaling)

3. **Alerts:**
   ```bash
   # Create alert for high error rate (via gcloud)
   gcloud alpha monitoring policies create \
     --notification-channels=CHANNEL_ID \
     --display-name="High Error Rate - Photo2Profit API" \
     --condition-display-name="Error rate > 5%" \
     --condition-threshold-value=0.05
   ```

### Firebase Hosting (Frontend)

Firebase Hosting includes analytics in the Firebase Console:

1. **Navigate to Firebase Console:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select project: `photo2profitbaddie`
   - Navigate to **Hosting** → **Usage**

2. **Key Metrics:**
   - Total requests
   - Bandwidth usage
   - Data transfer by country
   - Top requested files

## 🔔 Uptime Monitoring Solutions

### Option 1: UptimeRobot (Free)

UptimeRobot offers free monitoring for up to 50 monitors:

1. **Sign up:** https://uptimerobot.com
2. **Add monitors:**
   - Name: "Photo2Profit Frontend"
   - URL: `https://photo2profit.app`
   - Type: HTTP(s)
   - Interval: 5 minutes
   
   - Name: "Photo2Profit API Health"
   - URL: `https://api.photo2profit.app/api/health`
   - Type: HTTP(s)
   - Interval: 5 minutes
   - Keyword: "ok" (to verify response contains "ok")

3. **Configure alerts:**
   - Email notifications
   - SMS (premium)
   - Slack webhook
   - PagerDuty

### Option 2: Pingdom

Professional monitoring with advanced features:

1. **Sign up:** https://www.pingdom.com
2. **Create checks:**
   - Uptime check
   - Transaction monitoring
   - Real user monitoring (RUM)
   - Page speed monitoring

3. **Set up alerts:**
   - Multiple contact methods
   - Escalation policies
   - Custom alert thresholds

### Option 3: Google Cloud Monitoring (Included)

Google Cloud includes monitoring for Cloud Run:

```bash
# Install gcloud SDK and set up monitoring

# Create uptime check for API
gcloud monitoring uptime create api-health \
  --display-name="Photo2Profit API Health Check" \
  --http-check-path="/api/health" \
  --http-check-hostname="api.photo2profit.app" \
  --http-check-port=443 \
  --use-ssl \
  --period=60s

# Create notification channel
gcloud alpha monitoring channels create \
  --display-name="Email Notifications" \
  --type=email \
  --channel-labels=email_address=support@photo2profit.app

# Create alert policy
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="API Down Alert" \
  --condition-display-name="Uptime check failed" \
  --condition-threshold-value=1 \
  --duration=300s
```

### Option 4: Status Page

Create a public status page using:

- **Statuspage.io** (Atlassian) - https://www.statuspage.io
- **Cachet** (Self-hosted, open source) - https://cachethq.io
- **Upptime** (Free, GitHub-based) - https://upptime.js.org

## 🔍 Health Check Automation

### GitHub Actions Health Check

Add a scheduled workflow to check health:

```yaml
name: Health Check

on:
  schedule:
    - cron: '*/30 * * * *' # Every 30 minutes
  workflow_dispatch:

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check API Health
        run: |
          RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://api.photo2profit.app/api/health)
          if [ "$RESPONSE" != "200" ]; then
            echo "❌ API health check failed with status: $RESPONSE"
            exit 1
          fi
          echo "✅ API is healthy"
      
      - name: Check Frontend
        run: |
          RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://photo2profit.app)
          if [ "$RESPONSE" != "200" ]; then
            echo "❌ Frontend health check failed with status: $RESPONSE"
            exit 1
          fi
          echo "✅ Frontend is healthy"
      
      - name: Notify on failure
        if: failure()
        run: |
          # Send notification (customize as needed)
          curl -X POST -H 'Content-type: application/json' \
          --data '{"text":"🚨 Photo2Profit health check failed!"}' \
          ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Bash Health Check Script

Create a simple monitoring script:

```bash
#!/bin/bash
# health-check.sh - Check Photo2Profit services health

API_URL="https://api.photo2profit.app/api/health"
FRONTEND_URL="https://photo2profit.app"

echo "🔍 Checking Photo2Profit services..."

# Check API
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL")
if [ "$API_STATUS" = "200" ]; then
  echo "✅ API is healthy (HTTP $API_STATUS)"
else
  echo "❌ API is down (HTTP $API_STATUS)"
fi

# Check Frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$FRONTEND_STATUS" = "200" ]; then
  echo "✅ Frontend is healthy (HTTP $FRONTEND_STATUS)"
else
  echo "❌ Frontend is down (HTTP $FRONTEND_STATUS)"
fi

# Check response time
API_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$API_URL")
echo "⏱️  API response time: ${API_TIME}s"

exit 0
```

Run with cron:
```bash
# Add to crontab (run every 5 minutes)
*/5 * * * * /path/to/health-check.sh >> /var/log/photo2profit-health.log 2>&1
```

## 📈 Key Metrics to Monitor

### Critical Metrics

1. **Uptime** - Should be > 99.9%
2. **Response Time** - API < 500ms, Frontend < 2s
3. **Error Rate** - Should be < 1%
4. **Availability** - Should be 100%

### Performance Metrics

1. **Time to First Byte (TTFB)** - < 200ms
2. **First Contentful Paint (FCP)** - < 1.8s
3. **Largest Contentful Paint (LCP)** - < 2.5s
4. **Cumulative Layout Shift (CLS)** - < 0.1
5. **First Input Delay (FID)** - < 100ms

### Infrastructure Metrics

1. **CPU Usage** - < 70% average
2. **Memory Usage** - < 80%
3. **Request Count** - Track trends
4. **Active Instances** - Monitor auto-scaling

## 🚨 Incident Response

### Automated Response

1. **Cloud Run Auto-Scaling** - Handles traffic spikes automatically
2. **Firebase CDN** - Handles frontend load globally
3. **Health Check Retries** - Built into load balancers

### Manual Response

If services are down:

1. **Check Cloud Run Logs:**
   ```bash
   gcloud logging read "resource.type=cloud_run_revision \
     AND resource.labels.service_name=photo2profit-api" \
     --limit 50 --format json
   ```

2. **Check Firebase Hosting Status:**
   - Visit [Firebase Status](https://status.firebase.google.com)
   - Check your hosting dashboard

3. **Restart Cloud Run Service:**
   ```bash
   gcloud run services update photo2profit-api \
     --region us-west2 \
     --min-instances=1
   ```

4. **Rollback if needed:**
   ```bash
   # List revisions
   gcloud run revisions list --service photo2profit-api --region us-west2
   
   # Rollback to previous revision
   gcloud run services update-traffic photo2profit-api \
     --to-revisions REVISION_NAME=100 \
     --region us-west2
   ```

## 📊 Recommended Setup

For production Photo2Profit monitoring:

1. ✅ **UptimeRobot** - Free 5-minute checks for both frontend and API
2. ✅ **Google Cloud Monitoring** - Built-in Cloud Run metrics and alerts
3. ✅ **Firebase Analytics** - Built-in hosting usage metrics
4. ✅ **Sentry** (Optional) - Error tracking and performance monitoring
5. ✅ **Slack Notifications** - Alert channel for team notifications

### Quick Setup Commands

```bash
# 1. Create UptimeRobot monitors (via web UI)
# 2. Set up Google Cloud monitoring
gcloud monitoring uptime create api-health \
  --display-name="Photo2Profit API" \
  --http-check-path="/api/health" \
  --http-check-hostname="api.photo2profit.app" \
  --use-ssl --period=60s

# 3. Add Slack webhook to GitHub Secrets
# Settings → Secrets → New repository secret
# Name: SLACK_WEBHOOK_URL
# Value: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

## 📚 Additional Resources

- [Google Cloud Monitoring](https://cloud.google.com/monitoring/docs)
- [Firebase Hosting Metrics](https://firebase.google.com/docs/hosting/usage-quotas-pricing)
- [UptimeRobot Documentation](https://uptimerobot.com/api/)
- [Statuspage.io](https://www.statuspage.io)

---

**Need Help?** Contact support@photo2profit.app or check [DEPLOYMENT-STATUS.md](./DEPLOYMENT-STATUS.md) for deployment verification steps.
