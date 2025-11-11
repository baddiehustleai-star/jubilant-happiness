#!/bin/bash

# Photo2Profit Cloud Run Deployment Script
# This deploys your API to Google Cloud Run under project 758851214311

PROJECT_ID="758851214311"
SERVICE_NAME="photo2profit-api"
REGION="us-west2"  # Updated to match production requirements

echo "🚀 Deploying Photo2Profit API to Cloud Run..."
echo "📦 Project: $PROJECT_ID"
echo "🌍 Region: $REGION"

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

# Build and deploy to Cloud Run
echo "🏗️ Building and deploying to Cloud Run..."
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
echo "🌐 Service URL: $SERVICE_URL"
echo "🔍 Health check: $SERVICE_URL/health"
echo ""
echo "📋 Next steps:"
echo "1. Add this URL to your Vercel environment variables:"
echo "   VITE_API_BASE_URL=$SERVICE_URL"
echo "2. Test the health endpoint:"
echo "   curl $SERVICE_URL/health"
echo "3. Test product analysis:"
echo "   curl -X POST $SERVICE_URL/api/analyze-product -d '{\"prompt\":\"Coach handbag\",\"category\":\"Fashion\"}' -H 'Content-Type: application/json'"

exit 0