# Cloud Run Deployment Guide

This guide walks you through deploying the Photo2Profit API to Google Cloud Run.

## Prerequisites

1. **Google Cloud SDK** installed
   ```bash
   # Install if not present
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   ```

2. **Authenticate with Google Cloud**
   ```bash
   gcloud auth login
   ```

3. **Set your project ID**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

## Deployment Steps

### 1. Navigate to the API directory
```bash
cd api
```

### 2. Deploy to Cloud Run

**Basic deployment:**
```bash
gcloud run deploy photo2profit-api \
  --source . \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated
```

**With environment variables:**
```bash
gcloud run deploy photo2profit-api \
  --source . \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "JWT_SECRET=your-secure-jwt-secret,SHARED_WEBHOOK_SECRET=your-webhook-secret,STRIPE_SECRET_KEY=sk_live_your_stripe_key"
```

### 3. Verify Deployment

After deployment, Cloud Run will provide a URL like:
`https://photo2profit-api-758851214311.us-west2.run.app`

Test the health endpoint:
```bash
curl https://photo2profit-api-758851214311.us-west2.run.app/
```

Expected response:
```json
{
  "status": "ok",
  "message": "Photo2Profit API is running"
}
```

### 4. Update CORS Origins (if needed)

If your Cloud Run URL is different, update `api/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://photo2profitbaddie.web.app',
  'https://YOUR-ACTUAL-URL.run.app'  // Update this
];
```

Then redeploy:
```bash
gcloud run deploy photo2profit-api \
  --source . \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "JWT_SECRET=your-jwt-secret,SHARED_WEBHOOK_SECRET=your-webhook-secret,STRIPE_SECRET_KEY=sk_live_your_key"
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret for JWT token generation | `your-secure-random-string` |
| `SHARED_WEBHOOK_SECRET` | Shared secret for webhook verification | `another-secure-random-string` |
| `STRIPE_SECRET_KEY` | Stripe API secret key | `sk_live_xxxxxxxxxxxxx` |

### Setting Environment Variables Later

You can update environment variables without redeploying:

```bash
gcloud run services update photo2profit-api \
  --region us-west2 \
  --update-env-vars "JWT_SECRET=new-secret,SHARED_WEBHOOK_SECRET=new-webhook-secret"
```

## Testing CORS

### From Browser Console
```javascript
fetch('https://photo2profit-api-758851214311.us-west2.run.app/api/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    priceId: 'price_xxx',
    successUrl: 'https://photo2profitbaddie.web.app/success',
    cancelUrl: 'https://photo2profitbaddie.web.app/cancel'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### From Command Line
```bash
curl -X OPTIONS \
  https://photo2profit-api-758851214311.us-west2.run.app/api/create-checkout-session \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Look for these headers in the response:
- `Access-Control-Allow-Origin: http://localhost:5173`
- `Access-Control-Allow-Credentials: true`

## Troubleshooting

### Port Issues
Cloud Run automatically sets the `PORT` environment variable. The server is configured to use `process.env.PORT || 8080`.

### CORS Errors
If you see CORS errors in your browser console:

1. Check that your frontend origin is in the `allowedOrigins` array
2. Verify the Cloud Run service is deployed with the latest code
3. Check Cloud Run logs:
   ```bash
   gcloud run logs read photo2profit-api --region us-west2
   ```

### View Logs
```bash
# Tail logs
gcloud run logs tail photo2profit-api --region us-west2

# Read recent logs
gcloud run logs read photo2profit-api --region us-west2 --limit 50
```

### Check Service Status
```bash
gcloud run services describe photo2profit-api --region us-west2
```

## Cost Optimization

Cloud Run charges only when your service is processing requests. To optimize costs:

1. **Set request limits:**
   ```bash
   gcloud run services update photo2profit-api \
     --region us-west2 \
     --max-instances 10 \
     --concurrency 80
   ```

2. **Set memory allocation:**
   ```bash
   gcloud run services update photo2profit-api \
     --region us-west2 \
     --memory 512Mi
   ```

## Security Best Practices

1. **Use Secret Manager for sensitive data:**
   ```bash
   echo -n "your-stripe-key" | gcloud secrets create stripe-key --data-file=-
   
   gcloud run services update photo2profit-api \
     --region us-west2 \
     --update-secrets=STRIPE_SECRET_KEY=stripe-key:latest
   ```

2. **Enable VPC for private networking** (if connecting to private resources)

3. **Set up Cloud Armor** for DDoS protection (for production)

4. **Regular updates:** Keep dependencies updated
   ```bash
   cd api
   npm audit
   npm update
   ```

## Rollback

If something goes wrong, rollback to a previous revision:

```bash
# List revisions
gcloud run revisions list --service photo2profit-api --region us-west2

# Rollback to a specific revision
gcloud run services update-traffic photo2profit-api \
  --region us-west2 \
  --to-revisions REVISION-NAME=100
```

## Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Cloud Run Best Practices](https://cloud.google.com/run/docs/best-practices)
