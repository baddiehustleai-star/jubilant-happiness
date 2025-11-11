#!/bin/bash

# Photo2Profit Final Deployment Script
# This script handles the complete deployment process with verification

set -e  # Exit on error

PROJECT_ID="${PROJECT_ID:-758851214311}"
SERVICE_NAME="photo2profit-api"
REGION="${REGION:-us-central1}"
API_DIR="api"

echo "🚀 Photo2Profit Final Deployment Process"
echo "=========================================="
echo "📦 Project: $PROJECT_ID"
echo "🌍 Region: $REGION"
echo "🔧 Service: $SERVICE_NAME"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Check prerequisites
echo "📋 Step 1/5: Checking prerequisites..."
if ! command_exists gcloud; then
    echo "❌ gcloud CLI not found. Please install it:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js not found. Please install it:"
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✅ Prerequisites satisfied"

# 2. Set project configuration
echo ""
echo "🔧 Step 2/5: Configuring Google Cloud project..."
gcloud config set project "$PROJECT_ID" --quiet
echo "✅ Project configured"

# 3. Enable required APIs (idempotent)
echo ""
echo "🔌 Step 3/5: Enabling required Google Cloud APIs..."
gcloud services enable cloudbuild.googleapis.com --quiet 2>/dev/null || true
gcloud services enable run.googleapis.com --quiet 2>/dev/null || true
gcloud services enable artifactregistry.googleapis.com --quiet 2>/dev/null || true
gcloud services enable secretmanager.googleapis.com --quiet 2>/dev/null || true
gcloud services enable aiplatform.googleapis.com --quiet 2>/dev/null || true
echo "✅ APIs enabled"

# 4. Deploy API to Cloud Run
echo ""
echo "🚀 Step 4/5: Deploying API to Cloud Run..."
echo "This may take a few minutes..."

cd "$API_DIR"

gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --timeout 60s \
  --set-env-vars "NODE_ENV=production,PROJECT_ID=$PROJECT_ID" \
  --quiet

cd ..

# Get the deployed service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
  --region="$REGION" \
  --format="value(status.url)")

echo "✅ Deployment complete"
echo "🌐 Service URL: $SERVICE_URL"

# 5. Run verification checklist
echo ""
echo "🔍 Step 5/5: Running deployment verification..."

export CLOUD_RUN_URL="$SERVICE_URL"

# Wait a moment for the service to stabilize
echo "⏳ Waiting 5 seconds for service to stabilize..."
sleep 5

# Run the final deployment checklist
node scripts/final-deployment-checklist.js

CHECKLIST_EXIT_CODE=$?

echo ""
echo "=========================================="
if [ $CHECKLIST_EXIT_CODE -eq 0 ]; then
    echo "✅ DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Update Vercel environment variable:"
    echo "   VITE_API_BASE=$SERVICE_URL"
    echo ""
    echo "2. Test the deployed API:"
    echo "   curl $SERVICE_URL/health"
    echo ""
    echo "3. Monitor logs:"
    echo "   gcloud run logs read $SERVICE_NAME --region=$REGION --limit=50"
    echo ""
    echo "4. View service details:"
    echo "   gcloud run services describe $SERVICE_NAME --region=$REGION"
    exit 0
else
    echo "❌ DEPLOYMENT VERIFICATION FAILED"
    echo ""
    echo "The API was deployed, but verification checks failed."
    echo "Please review the errors above and fix them."
    echo ""
    echo "🔍 To debug, check logs:"
    echo "   gcloud run logs read $SERVICE_NAME --region=$REGION --limit=50"
    exit 1
fi
