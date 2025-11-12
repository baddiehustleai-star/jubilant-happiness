# Cloud Run Backend Deployment Guide

This guide covers deploying the Photo2Profit backend API to Google Cloud Run.

## Prerequisites

1. Google Cloud account with billing enabled
2. gcloud CLI installed and authenticated
3. Project ID: `photo2profit` (or your project ID)

## Deployment Steps

### 1. Build and Deploy to Cloud Run

```bash
# Navigate to the backend directory
cd backend

# Set your project ID
export PROJECT_ID="photo2profit"
export REGION="us-west2"
export SERVICE_NAME="photo2profit-api"

# Build and deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --project=$PROJECT_ID
```

### 2. Get the Service URL

After deployment, Cloud Run will provide a URL like:

```
https://photo2profit-api-758851214311.us-west2.run.app
```

### 3. Test the Deployment

```bash
# Test the health endpoint
curl https://photo2profit-api-758851214311.us-west2.run.app/api

# Expected response:
# {"message":"Photo2Profit API is alive!","timestamp":"...","version":"1.0.0"}
```

## CORS Configuration

The backend is configured to accept requests from:

- `https://photo2profitbaddie.web.app` (Firebase production)
- `https://photo2profitbaddie.firebaseapp.com` (Firebase alternative)
- `http://localhost:5173` (Local Vite dev server)
- `http://localhost:3000` (Alternative local dev port)

To add more origins, edit `backend/server.js` and update the `allowedOrigins` array.

## Testing CORS

### Option 1: Browser Console Test

1. Open your Firebase frontend: https://photo2profitbaddie.web.app
2. Press F12 to open DevTools → Console
3. Paste and run:

```javascript
fetch('https://photo2profit-api-758851214311.us-west2.run.app/api', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
  .then((res) => res.text())
  .then((data) => console.log('✅ Success:', data))
  .catch((err) => console.error('❌ Error:', err));
```

**Expected result:** `✅ Success: {"message":"Photo2Profit API is alive!",...}`

### Option 2: curl Test

Test CORS headers from command line:

```bash
curl -I -X GET \
  -H "Origin: https://photo2profitbaddie.web.app" \
  https://photo2profit-api-758851214311.us-west2.run.app/api
```

**Expected headers:**

```
HTTP/2 200
access-control-allow-origin: https://photo2profitbaddie.web.app
access-control-allow-credentials: true
```

### Option 3: OPTIONS Preflight Test

Test CORS preflight request:

```bash
curl -I -X OPTIONS \
  -H "Origin: https://photo2profitbaddie.web.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://photo2profit-api-758851214311.us-west2.run.app/api
```

## Troubleshooting

### CORS Error in Browser

If you see: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solutions:**

1. Verify your frontend origin is in the `allowedOrigins` array
2. Redeploy the backend after updating origins
3. Check browser DevTools Network tab for the exact origin being sent

### 404 Error

If the API returns 404:

- Verify the endpoint path includes `/api`
- Check the Cloud Run service URL is correct

### Authentication Issues

To restrict access to authenticated users only:

```bash
gcloud run deploy $SERVICE_NAME --no-allow-unauthenticated
```

Then configure Firebase Authentication tokens in your frontend requests.

## Environment Variables

Set environment variables in Cloud Run:

```bash
gcloud run services update $SERVICE_NAME \
  --region=$REGION \
  --set-env-vars="NODE_ENV=production,API_VERSION=1.0.0"
```

## Monitoring

View logs:

```bash
gcloud run services logs read $SERVICE_NAME --region=$REGION
```

## Continuous Deployment

To set up CI/CD:

1. Add a GitHub Actions workflow (see `.github/workflows/deploy-backend.yml`)
2. Configure service account credentials
3. Auto-deploy on push to main branch

## Cost Optimization

Cloud Run charges per request and CPU time:

- First 2 million requests per month are free
- Optimize by setting minimum instances to 0 for testing
- Use `--min-instances=1` for production to reduce cold starts
