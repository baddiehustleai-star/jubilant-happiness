#!/usr/bin/env bash
set -euo pipefail

echo "💎 Photo2Profit Cloud Shell Setup"

PROJECT_ID=${PROJECT_ID:-}
if [[ -z "${PROJECT_ID}" ]]; then
  echo "⚠️  PROJECT_ID not set. Export it first: export PROJECT_ID=your-project-id" >&2
  exit 1
fi

echo "🔧 Using project: $PROJECT_ID"
gcloud config set project "$PROJECT_ID" >/dev/null

echo "✅ Enabling services (idempotent)..."
gcloud services enable secretmanager.googleapis.com aiplatform.googleapis.com firestore.googleapis.com run.googleapis.com >/dev/null || true

echo "✅ Creating Firestore DB if missing..."
gcloud alpha firestore databases create --location=us-central --type=firestore-native 2>/dev/null || true

create_secret () {
  local name=$1
  local value=$2
  if ! gcloud secrets describe "$name" >/dev/null 2>&1; then
    echo -n "$value" | gcloud secrets create "$name" --data-file=- --replication-policy="automatic" >/dev/null
    echo "   • Created secret $name"
  else
    echo "   • Secret $name already exists (skipping)"
  fi
}

echo "🔐 Seeding placeholder secrets (safe to replace later)..."
create_secret stripe-secret-key sk_test_placeholder
create_secret stripe-webhook-secret whsec_placeholder
create_secret ebay-client-id ebay_client_id_placeholder
create_secret ebay-client-secret ebay_client_secret_placeholder
create_secret ebay-access-token ebay_access_token_placeholder
create_secret facebook-catalog-id fb_catalog_id_placeholder
create_secret facebook-access-token fb_access_token_placeholder

echo "📦 Installing root dependencies..."
npm install

echo "📦 Installing API dependencies..."
pushd api >/dev/null
npm install
popd >/dev/null

if [[ ! -f .env ]]; then
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
  echo "🧪 Created .env with demo values"
else
  echo "🧪 .env already exists (skipping)"
fi

echo "🚀 Starting API (background, port 8080)..."
node api/server.js &
API_PID=$!
sleep 2

echo "🌐 API health check:"
curl -s http://localhost:8080/health || true

echo "⚡ Starting Vite dev server (frontend)..."
npm run dev

echo "API PID: $API_PID (terminate manually if needed)"
