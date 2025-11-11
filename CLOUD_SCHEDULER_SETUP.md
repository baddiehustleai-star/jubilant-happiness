# Cloud Scheduler Setup for Auto-Publishing

This guide shows you how to set up Google Cloud Scheduler to automatically publish products every hour (or on your custom schedule).

## 🎯 What This Does

- **Cloud Scheduler** pings your API endpoint on a schedule (e.g., every hour)
- Your API scans for unpublished products across all users
- Products are automatically published to eBay and Facebook
- You get a summary of what was published

## 🚀 Quick Setup (Copy & Paste)

### 1. Set Your API URL

Add to `api/.env`:
```bash
API_URL=https://photo2profit-api-758851214311.us-west2.run.app
```

### 2. Create the Cloud Scheduler Job

Run this command in Google Cloud Shell:

```bash
gcloud scheduler jobs create http autopublish-photo2profit \
  --schedule="0 * * * *" \
  --uri="https://photo2profit-api-758851214311.us-west2.run.app/api/publish/pending" \
  --http-method=POST \
  --oidc-service-account-email="758851214311-compute@developer.gserviceaccount.com" \
  --location="us-west2"
```

**What this does:**
- Creates a job called `autopublish-photo2profit`
- Runs every hour (at the top of the hour)
- Hits your `/api/publish/pending` endpoint
- Uses OIDC authentication (secure, no API keys needed)

✅ **Done!** Your products will now publish automatically every hour.

---

## ⏰ Custom Schedules

The `--schedule` flag uses cron syntax. Here are common patterns:

| Schedule | Cron Expression | Description |
|----------|----------------|-------------|
| Every hour | `0 * * * *` | At minute 0 of every hour |
| Every 30 minutes | `*/30 * * * *` | Twice per hour |
| Every 2 hours | `0 */2 * * *` | Every even hour |
| Daily at 9 AM | `0 9 * * *` | Once per day at 9:00 AM |
| Twice daily | `0 9,17 * * *` | At 9 AM and 5 PM |
| Weekdays only | `0 9 * * 1-5` | Monday-Friday at 9 AM |
| Every 15 minutes | `*/15 * * * *` | Four times per hour |

### Examples:

**Publish every 30 minutes:**
```bash
gcloud scheduler jobs create http autopublish-photo2profit \
  --schedule="*/30 * * * *" \
  --uri="https://photo2profit-api-758851214311.us-west2.run.app/api/publish/pending" \
  --http-method=POST \
  --oidc-service-account-email="758851214311-compute@developer.gserviceaccount.com" \
  --location="us-west2"
```

**Publish twice daily (9 AM and 5 PM):**
```bash
gcloud scheduler jobs create http autopublish-photo2profit \
  --schedule="0 9,17 * * *" \
  --uri="https://photo2profit-api-758851214311.us-west2.run.app/api/publish/pending" \
  --http-method=POST \
  --oidc-service-account-email="758851214311-compute@developer.gserviceaccount.com" \
  --location="us-west2"
```

---

## 🔍 Managing Your Scheduler Job

### List all scheduler jobs:
```bash
gcloud scheduler jobs list --location=us-west2
```

### View job details:
```bash
gcloud scheduler jobs describe autopublish-photo2profit --location=us-west2
```

### Test the job manually (without waiting for schedule):
```bash
gcloud scheduler jobs run autopublish-photo2profit --location=us-west2
```

### Pause the job (without deleting):
```bash
gcloud scheduler jobs pause autopublish-photo2profit --location=us-west2
```

### Resume a paused job:
```bash
gcloud scheduler jobs resume autopublish-photo2profit --location=us-west2
```

### Delete the job:
```bash
gcloud scheduler jobs delete autopublish-photo2profit --location=us-west2
```

### Update the schedule:
```bash
gcloud scheduler jobs update http autopublish-photo2profit \
  --schedule="0 */2 * * *" \
  --location=us-west2
```

---

## 📊 Monitoring

### View recent runs:
```bash
gcloud scheduler jobs describe autopublish-photo2profit \
  --location=us-west2 \
  --format="table(status.lastAttemptTime, status.code)"
```

### Check logs:
```bash
gcloud logging read "resource.type=cloud_scheduler_job AND resource.labels.job_id=autopublish-photo2profit" \
  --limit=10 \
  --format=json
```

### Watch your API logs for scheduler triggers:
```bash
gcloud logging read "resource.type=cloud_run_revision AND textPayload=~'Cloud Scheduler triggered'" \
  --limit=10
```

You'll see messages like:
```
⏰ Cloud Scheduler triggered auto-publish
🔄 Starting batch publish for all users...
✅ Product abc123 published
```

---

## 🎛️ Alternative: Threshold-Based Publishing

If you prefer publishing after N products instead of on a schedule, you can skip Cloud Scheduler entirely.

Just set in `api/.env`:
```bash
AUTO_PUBLISH_ENABLED=true
AUTO_PUBLISH_THRESHOLD=5
```

Then products auto-publish after every 5 uploads. No scheduler needed!

**Or use both:**
- Threshold for busy times (instant publishing after 5 products)
- Scheduler for off-hours (publishes stragglers once per day)

---

## 🔐 Security Notes

### OIDC Authentication
The `--oidc-service-account-email` flag uses **OIDC (OpenID Connect)** authentication, which means:

- ✅ No API keys to manage
- ✅ Cloud Scheduler automatically gets authenticated tokens
- ✅ Your Cloud Run service verifies the tokens
- ✅ Only Google's infrastructure can trigger the endpoint

### If you need API key instead:
```bash
gcloud scheduler jobs create http autopublish-photo2profit \
  --schedule="0 * * * *" \
  --uri="https://photo2profit-api-758851214311.us-west2.run.app/api/publish/pending" \
  --http-method=POST \
  --headers="X-API-Key=YOUR_ADMIN_API_KEY" \
  --location="us-west2"
```

(Then check `ADMIN_API_KEY` in the `/api/publish/pending` handler)

---

## 💰 Costs

| Component | Free Tier | Cost After Free Tier |
|-----------|-----------|---------------------|
| Cloud Scheduler | 3 jobs free | $0.10/job/month |
| Cloud Run invocations | 2M free/month | $0.40 per 1M |
| eBay API | 5,000 calls/day | $0.001/call |
| Facebook API | Unlimited | Free |

**Example:** 1 scheduler job + 24 runs/day = **$0.10/month**

---

## 🧪 Testing

### 1. Test the endpoint manually:
```bash
curl -X POST https://photo2profit-api-758851214311.us-west2.run.app/api/publish/pending
```

Expected response:
```json
{
  "message": "Successfully published 3 products",
  "published": 3,
  "errors": 0
}
```

### 2. Test with Cloud Scheduler (manual trigger):
```bash
gcloud scheduler jobs run autopublish-photo2profit --location=us-west2
```

Check your API logs:
```bash
gcloud logs read --limit=20
```

### 3. Upload test products:
```bash
# Upload 3 products, wait for next scheduled run
# Check they get published automatically
```

---

## 🐛 Troubleshooting

### "Job not found"
- Make sure you're in the correct project: `gcloud config get-value project`
- Use the correct location: `--location=us-west2`

### "Permission denied"
- Ensure service account has `roles/run.invoker` on your Cloud Run service:
```bash
gcloud run services add-iam-policy-binding photo2profit-api \
  --region=us-west2 \
  --member="serviceAccount:758851214311-compute@developer.gserviceaccount.com" \
  --role="roles/run.invoker"
```

### "No products published"
- Check if products exist with `published: false`
- Verify eBay/Facebook credentials are configured
- Check API logs for errors

### Scheduler runs but nothing happens
- Check Cloud Run logs: `gcloud logs read --limit=50`
- Verify API URL is correct in scheduler config
- Test endpoint manually with curl

---

## 📚 Next Steps

1. ✅ Create the scheduler job with the command above
2. ✅ Test it with `gcloud scheduler jobs run`
3. ✅ Monitor logs for successful publishes
4. ✅ Adjust schedule based on your upload patterns
5. ✅ Set up alerts for failed runs (optional)

---

## 🎉 You're Done!

Your Photo2Profit app now runs on autopilot:

1. You (or your users) upload product photos
2. AI processes and creates listings
3. Products wait as `published: false`
4. Cloud Scheduler triggers every hour
5. Everything publishes to eBay and Facebook automatically
6. You wake up to a full marketplace

**No manual clicking required!** ☕️

---

**Need help?** Check API logs with:
```bash
gcloud logs tail
```
