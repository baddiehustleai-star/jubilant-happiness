#!/bin/bash

# Photo2Profit Environment Variables Setup Script
# This script helps you configure all required environment variables for Cloud Run

set -e

PROJECT_ID="photo2profit-758851214311"
SERVICE_NAME="photo2profit-api"
REGION="us-west2"

echo "🔧 Photo2Profit Environment Variables Setup"
echo "==========================================="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
gcloud config set project $PROJECT_ID

echo "This script will help you configure the required environment variables."
echo "Press Enter to use the default value or type a new value."
echo ""

# JWT_SECRET
read -p "JWT_SECRET [dev-jwt-secret]: " JWT_SECRET
JWT_SECRET=${JWT_SECRET:-dev-jwt-secret}

# SHARED_WEBHOOK_SECRET / CRON_SECRET
read -p "SHARED_WEBHOOK_SECRET (for cron auth) [photo2profit-cron-secret]: " WEBHOOK_SECRET
WEBHOOK_SECRET=${WEBHOOK_SECRET:-photo2profit-cron-secret}

# SMTP_USER
read -p "SMTP_USER (Gmail address for sending emails): " SMTP_USER
if [ -z "$SMTP_USER" ]; then
    echo "⚠️  Warning: SMTP_USER is required for email notifications"
fi

# SMTP_PASS
read -s -p "SMTP_PASS (Gmail App Password - will be hidden): " SMTP_PASS
echo ""
if [ -z "$SMTP_PASS" ]; then
    echo "⚠️  Warning: SMTP_PASS is required for email notifications"
    echo "   Get one at: https://myaccount.google.com/apppasswords"
fi

# NOTIFY_EMAIL
read -p "NOTIFY_EMAIL (where to send reports) [$SMTP_USER]: " NOTIFY_EMAIL
NOTIFY_EMAIL=${NOTIFY_EMAIL:-$SMTP_USER}

echo ""
echo "📋 Configuration Summary:"
echo "------------------------"
echo "JWT_SECRET: $JWT_SECRET"
echo "SHARED_WEBHOOK_SECRET: $WEBHOOK_SECRET"
echo "SMTP_USER: $SMTP_USER"
echo "SMTP_PASS: $(if [ -n "$SMTP_PASS" ]; then echo '***hidden***'; else echo 'NOT SET'; fi)"
echo "NOTIFY_EMAIL: $NOTIFY_EMAIL"
echo ""

read -p "Apply these settings to Cloud Run service '$SERVICE_NAME'? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled. No changes made."
    exit 0
fi

echo ""
echo "🔧 Updating Cloud Run service..."

ENV_VARS="JWT_SECRET=$JWT_SECRET,SHARED_WEBHOOK_SECRET=$WEBHOOK_SECRET,CRON_SECRET=$WEBHOOK_SECRET"

if [ -n "$SMTP_USER" ]; then
    ENV_VARS="$ENV_VARS,SMTP_USER=$SMTP_USER"
fi

if [ -n "$SMTP_PASS" ]; then
    ENV_VARS="$ENV_VARS,SMTP_PASS=$SMTP_PASS"
fi

if [ -n "$NOTIFY_EMAIL" ]; then
    ENV_VARS="$ENV_VARS,NOTIFY_EMAIL=$NOTIFY_EMAIL"
fi

gcloud run services update $SERVICE_NAME \
  --region $REGION \
  --update-env-vars "$ENV_VARS"

echo ""
echo "✅ Environment variables updated successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Redeploy the service to apply changes:"
echo "   cd api && ./final-deploy.sh"
echo ""
echo "2. Test the SEO refresh endpoint:"
echo "   ./test-seo-refresh.sh"
echo ""

exit 0
