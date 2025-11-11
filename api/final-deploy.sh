#!/bin/bash

# Photo2Profit Final Cloud Run Deployment Script
# Deploys the API with SEO refresh and email notification features

set -e  # Exit on error

PROJECT_ID="photo2profit-758851214311"
SERVICE_NAME="photo2profit-api"
REGION="us-west2"

echo "🚀 Photo2Profit Final Deployment"
echo "=================================="
echo "📦 Project: $PROJECT_ID"
echo "🌍 Region: $REGION"
echo "🔧 Service: $SERVICE_NAME"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "🔧 Setting project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔌 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable aiplatform.googleapis.com

echo ""
echo "📋 Pre-deployment checklist:"
echo "  ✓ Cloud APIs enabled"
echo "  ⚠️  Make sure environment variables are configured in Cloud Run"
echo "     (JWT_SECRET, SHARED_WEBHOOK_SECRET, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL)"
echo ""
read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Build and deploy to Cloud Run
echo ""
echo "🏗️  Building and deploying to Cloud Run..."
echo "   This will take 2-3 minutes..."
echo ""

gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production,PROJECT_ID=$PROJECT_ID" \
  --quiet

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

echo ""
echo "✅ Deployment complete!"
echo "=================================="
echo ""
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "📋 Next steps:"
echo ""
echo "1️⃣  Test the health endpoint:"
echo "   curl $SERVICE_URL/health"
echo ""
echo "2️⃣  Test the SEO refresh endpoint:"
echo "   curl -X POST -H 'x-cron-secret: photo2profit-cron-secret' $SERVICE_URL/api/seo/refresh"
echo ""
echo "3️⃣  Check your email for the SEO report"
echo ""
echo "4️⃣  Verify product pages load:"
echo "   Visit your frontend and check product listings"
echo ""
echo "5️⃣  Tag the release:"
echo "   git tag -a v1.0.1 -m 'Production deployment'"
echo "   git push origin v1.0.1"
echo ""
echo "📚 Full checklist: ../FINAL_DEPLOY.md"
echo ""

exit 0
