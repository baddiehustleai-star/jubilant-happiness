title: Photo2Profit Cloud Shell Quickstart
description: Launch and explore the Photo2Profit app (frontend + API) directly in Google Cloud Shell.
author: Photo2Profit

# Welcome to Photo2Profit 💎

This interactive Cloud Shell tutorial will help you:
1. Set your Google Cloud project
2. Enable required services
3. Seed placeholder secrets
4. Install dependencies
5. Run the API + frontend

---
## 1. Set Project
Run (replace with your project):
```bash
export PROJECT_ID=YOUR_PROJECT_ID
gcloud config set project "$PROJECT_ID"
```

## 2. Enable Services
```bash
gcloud services enable secretmanager.googleapis.com aiplatform.googleapis.com firestore.googleapis.com run.googleapis.com
```

## 3. Firestore DB (Ignore errors if exists)
```bash
gcloud alpha firestore databases create --location=us-central --type=firestore-native || true
```

## 4. Placeholder Secrets
```bash
for s in stripe-secret-key:sk_test_placeholder \
          stripe-webhook-secret:whsec_placeholder \
          ebay-client-id:ebay_client_id_placeholder \
          ebay-client-secret:ebay_client_secret_placeholder \
          ebay-access-token:ebay_access_token_placeholder \
          facebook-catalog-id:fb_catalog_id_placeholder \
          facebook-access-token:fb_access_token_placeholder; do \
  name="${s%%:*}"; val="${s##*:}"; \
  if ! gcloud secrets describe "$name" >/dev/null 2>&1; then echo -n "$val" | gcloud secrets create "$name" --data-file=- --replication-policy=automatic; else echo "Secret $name exists"; fi; \
done
```

## 5. Install Dependencies
```bash
npm install
pushd api && npm install && popd
```

## 6. Create .env (Demo)
```bash
cat > .env <<EOF
VITE_FIREBASE_API_KEY=demo
VITE_FIREBASE_AUTH_DOMAIN=$PROJECT_ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=$PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=$PROJECT_ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=$PROJECT_ID
VITE_FIREBASE_APP_ID=demo
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
VITE_API_BASE=http://localhost:8080
EOF
```

## 7. Start API (Tab 1)
```bash
node api/server.js
```

## 8. Start Frontend (Tab 2)
```bash
npm run dev
```

Use Web Preview → 5173.

## 9. Health Check
```bash
curl -s http://localhost:8080/health | jq
```

## 10. Sample AI Call
```bash
curl -X POST http://localhost:8080/api/analyze-product \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Vintage camera","category":"electronics","condition":"used"}'
```

## 11. Run Tests
```bash
npm test
```

## Next Steps
- Replace placeholder secrets with real credentials.
- Deploy API to Cloud Run for a managed endpoint.
- Point frontend to Cloud Run URL using a VITE_API_BASE variable.

Happy building in the cloud! 🌤️
