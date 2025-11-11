## 🚀 Open in Google Cloud Shell Tutorial

Welcome to Photo2Profit in **Google Cloud Shell**. This guided tutorial helps you spin up both the frontend (Vite React app) and the backend API (Express + Vertex AI + Stripe + Firebase Admin) directly from a browser with zero local installs.

### ✅ Prerequisites

Cloud Shell already includes: Node.js (≥18), npm, gcloud SDK, Git. You only need a Google Cloud project with billing enabled for Vertex AI + Secret Manager usage.

### 1. Clone / Open Automatically

If you clicked the "Open in Cloud Shell" badge, the repo is already cloned. Otherwise:

```bash
git clone https://github.com/baddiehustleai-star/jubilant-happiness.git
cd jubilant-happiness
```

### 2. Set Your Project

Replace PROJECT_ID below if different. (The API code references `758851214311` as an example project numeric ID.)

```bash
export PROJECT_ID=YOUR_PROJECT_ID
gcloud config set project "$PROJECT_ID"
```

Optional: auth (if session not already active):

```bash
gcloud auth login --quiet
gcloud auth application-default login --quiet
```

### 3. Enable Required Services

```bash
gcloud services enable secretmanager.googleapis.com \
  aiplatform.googleapis.com \
  firestore.googleapis.com \
  cloudfunctions.googleapis.com \
  run.googleapis.com
```

### 4. Create Firestore (if not yet initialized)

```bash
gcloud alpha firestore databases create --location=us-central --type=firestore-native || true
```

### 5. Seed Required Secrets (Stub / Demo)

If you don't have real keys yet, add placeholder values so the API boots without errors. You can update them later.

```bash
echo -n "sk_test_placeholder" | gcloud secrets create stripe-secret-key --data-file=- --replication-policy="automatic" || true
echo -n "whsec_placeholder" | gcloud secrets create stripe-webhook-secret --data-file=- --replication-policy="automatic" || true
echo -n "ebay_client_id_placeholder" | gcloud secrets create ebay-client-id --data-file=- --replication-policy="automatic" || true
echo -n "ebay_client_secret_placeholder" | gcloud secrets create ebay-client-secret --data-file=- --replication-policy="automatic" || true
echo -n "ebay_token_placeholder" | gcloud secrets create ebay-access-token --data-file=- --replication-policy="automatic" || true
echo -n "fb_catalog_id_placeholder" | gcloud secrets create facebook-catalog-id --data-file=- --replication-policy="automatic" || true
echo -n "fb_access_token_placeholder" | gcloud secrets create facebook-access-token --data-file=- --replication-policy="automatic" || true
```

### 6. Install Dependencies (Frontend + API)

```bash
npm install
pushd api && npm install && popd
```

### 7. Run Backend API

Start the Express server (port 8080 by default):

```bash
node api/server.js
```

Leave this running in one Cloud Shell tab. (You can open a new tab/split with the + icon.)

### 8. Run Frontend (Vite)

In a second tab:

```bash
npm run dev
```

Vite defaults to port 5173. Use the **Web Preview** button (upper right in Cloud Shell) → enter port 5173 to open the app.

### 9. Verify API Health

From any tab:

```bash
curl -s http://localhost:8080/health | jq
```

Expect a JSON payload with `status: healthy`.

### 10. Test Stripe / Cross-Posting (Demo Mode)

Without real secrets you'll see warnings but non-critical paths still respond. Endpoints to explore:

```bash
curl -X POST http://localhost:8080/api/analyze-product \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Vintage camera","category":"electronics","condition":"used"}'
```

### 11. (Optional) Deploy API to Cloud Run

Create a minimal Docker image using the provided `api/Dockerfile` (or add one if needed) and deploy:

```bash
pushd api
gcloud builds submit --tag gcr.io/$PROJECT_ID/photo2profit-api
gcloud run deploy photo2profit-api \
  --image gcr.io/$PROJECT_ID/photo2profit-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
popd
```

Then update frontend calls to use the deployed URL (e.g. set `VITE_API_BASE=https://<cloud-run-url>` and modify fetches accordingly).

### 12. Environment Variables (Frontend)

Create `.env` for local Vite use:

```bash
cat > .env <<'EOF'
VITE_FIREBASE_API_KEY=demo
VITE_FIREBASE_AUTH_DOMAIN=demo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=$PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=$PROJECT_ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=$PROJECT_ID
VITE_FIREBASE_APP_ID=demo
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
VITE_API_BASE=http://localhost:8080
EOF
```

### 13. Run Smoke Tests

```bash
npm test
```

### 14. Clean Up (Optional)

```bash
gcloud secrets delete stripe-secret-key --quiet || true
```

### Troubleshooting

| Issue                       | Fix                                                                      |
| --------------------------- | ------------------------------------------------------------------------ |
| Vertex AI permission error  | Ensure billing enabled + `roles/aiplatform.user` for your account        |
| Secret not found            | Verify secret name matches `server.js` expectations                      |
| Web Preview blank           | Use correct port (5173) and disable popup blockers                       |
| Firestore permission denied | Run `gcloud auth application-default login` or configure service account |

### Next Steps

1. Replace placeholder secrets with real values.
2. Add production fetch base URL for Stripe endpoints if served separately.
3. Integrate OAuth for direct eBay / Facebook posting.

Enjoy building in the cloud! 💎
