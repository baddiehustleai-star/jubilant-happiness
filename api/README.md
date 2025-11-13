# Photo2Profit API

Express server with CORS support for the Photo2Profit application.

## Features

- ✅ CORS configuration with allowed origins
- ✅ Stripe checkout session creation
- ✅ Health check endpoint
- ✅ Ready for Cloud Run deployment

## Local Development

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
export STRIPE_SECRET_KEY=your_stripe_key_here
export JWT_SECRET=dev-jwt-secret
export SHARED_WEBHOOK_SECRET=dev-shared-secret
npm start
```

The server will start on port 8080 (or the PORT environment variable).

### Test CORS

```bash
# Test health check
curl http://localhost:8080/

# Test CORS headers
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     http://localhost:8080/api/create-checkout-session -v
```

## Deploy to Cloud Run

### Prerequisites

- Google Cloud SDK installed
- Authenticated with `gcloud auth login`
- Project configured with `gcloud config set project YOUR_PROJECT_ID`

### Deploy

```bash
gcloud run deploy photo2profit-api \
  --source . \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "JWT_SECRET=dev-jwt-secret,SHARED_WEBHOOK_SECRET=dev-shared-secret,STRIPE_SECRET_KEY=your_stripe_key_here"
```

Replace `your_stripe_key_here` with your actual Stripe secret key.

## CORS Configuration

The server is configured to allow requests from:

- `http://localhost:5173` - Local development
- `https://photo2profitbaddie.web.app` - Firebase hosting site
- `https://photo2profit-api-758851214311.us-west2.run.app` - Backend itself

To add more origins, edit the `allowedOrigins` array in `server.js`.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 8080) | No |
| `STRIPE_SECRET_KEY` | Stripe API secret key | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `SHARED_WEBHOOK_SECRET` | Shared webhook secret | Yes |

## API Endpoints

### `GET /`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Photo2Profit API is running"
}
```

### `POST /api/create-checkout-session`
Create a Stripe checkout session.

**Request body:**
```json
{
  "priceId": "price_xxx",
  "successUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/cancel"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_xxx",
  "url": "https://checkout.stripe.com/xxx"
}
```
