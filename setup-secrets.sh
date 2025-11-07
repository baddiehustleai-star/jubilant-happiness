#!/bin/bash

# 🔐 Photo2Profit Secret Manager Setup Script
# Copy and paste these commands directly into Google Cloud Shell

echo "🚀 Setting up Photo2Profit Secret Manager for project 758851214311..."

# Set the project
gcloud config set project 758851214311

# Enable Secret Manager API
echo "📋 Enabling Secret Manager API..."
gcloud services enable secretmanager.googleapis.com

echo ""
echo "💰 STRIPE SECRETS"
echo "================"
echo "📝 Get these from: https://dashboard.stripe.com/apikeys"
echo ""

# Stripe secrets (replace with your actual keys)
echo "Enter your Stripe SECRET key (starts with sk_live_ or sk_test_):"
read -s STRIPE_SECRET_KEY
echo -n "$STRIPE_SECRET_KEY" | gcloud secrets create stripe-secret-key --data-file=-
echo "✅ Stripe secret key stored"

echo "Enter your Stripe PRICE ID for subscription (starts with price_):"
read STRIPE_PRICE_ID
echo -n "$STRIPE_PRICE_ID" | gcloud secrets create stripe-price-id --data-file=-
echo "✅ Stripe price ID stored"

echo "Enter your Stripe WEBHOOK secret (starts with whsec_):"
read -s STRIPE_WEBHOOK_SECRET
echo -n "$STRIPE_WEBHOOK_SECRET" | gcloud secrets create stripe-webhook-secret --data-file=-
echo "✅ Stripe webhook secret stored"

echo ""
echo "🛒 EBAY SECRETS"
echo "==============="
echo "📝 Get these from: https://developer.ebay.com/my/keys"
echo ""

echo "Enter your eBay CLIENT ID:"
read EBAY_CLIENT_ID
echo -n "$EBAY_CLIENT_ID" | gcloud secrets create ebay-client-id --data-file=-
echo "✅ eBay client ID stored"

echo "Enter your eBay CLIENT SECRET:"
read -s EBAY_CLIENT_SECRET
echo -n "$EBAY_CLIENT_SECRET" | gcloud secrets create ebay-client-secret --data-file=-
echo "✅ eBay client secret stored"

echo "Enter your eBay ACCESS TOKEN:"
read -s EBAY_ACCESS_TOKEN
echo -n "$EBAY_ACCESS_TOKEN" | gcloud secrets create ebay-access-token --data-file=-
echo "✅ eBay access token stored"

echo ""
echo "📘 FACEBOOK SECRETS"
echo "==================="
echo "📝 Get these from: https://business.facebook.com/settings/system-users"
echo ""

echo "Enter your Facebook CATALOG ID:"
read FB_CATALOG_ID
echo -n "$FB_CATALOG_ID" | gcloud secrets create facebook-catalog-id --data-file=-
echo "✅ Facebook catalog ID stored"

echo "Enter your Facebook ACCESS TOKEN:"
read -s FB_ACCESS_TOKEN
echo -n "$FB_ACCESS_TOKEN" | gcloud secrets create facebook-access-token --data-file=-
echo "✅ Facebook access token stored"

echo ""
echo "🤖 AI SECRETS"
echo "============="
echo "📝 Get these from: https://console.cloud.google.com/apis/credentials"
echo ""

echo "Enter your Gemini API KEY (optional, for 2.5 model):"
read -s GEMINI_API_KEY
if [ ! -z "$GEMINI_API_KEY" ]; then
    echo -n "$GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
    echo "✅ Gemini API key stored"
else
    echo "⚠️  Gemini API key skipped (using default Vertex AI)"
fi

echo ""
echo "🔑 GRANT ACCESS TO CLOUD RUN SERVICE"
echo "====================================="

# Get Cloud Run service account
SERVICE_ACCOUNT=$(gcloud run services describe photo2profit-api --region=us-central1 --format="value(spec.template.spec.serviceAccountName)" 2>/dev/null || echo "")

if [ -z "$SERVICE_ACCOUNT" ]; then
    echo "⚠️  Cloud Run service not found. You'll need to grant access manually after deployment."
    echo "   Use: gcloud secrets add-iam-policy-binding SECRET_NAME --member='serviceAccount:SERVICE_ACCOUNT' --role='roles/secretmanager.secretAccessor'"
else
    echo "🔐 Granting secret access to service account: $SERVICE_ACCOUNT"
    
    # Grant access to all secrets
    for SECRET in stripe-secret-key stripe-price-id stripe-webhook-secret ebay-client-id ebay-client-secret ebay-access-token facebook-catalog-id facebook-access-token gemini-api-key; do
        if gcloud secrets describe $SECRET --quiet 2>/dev/null; then
            gcloud secrets add-iam-policy-binding $SECRET \
                --member="serviceAccount:$SERVICE_ACCOUNT" \
                --role="roles/secretmanager.secretAccessor" --quiet
            echo "✅ $SECRET access granted"
        fi
    done
fi

echo ""
echo "📊 VERIFY SECRETS CREATED"
echo "========================="
gcloud secrets list --filter="name:stripe* OR name:ebay* OR name:facebook* OR name:gemini*"

echo ""
echo "🎉 SECRET MANAGER SETUP COMPLETE!"
echo ""
echo "💡 Next Steps:"
echo "1. Deploy your Cloud Run service: cd api && ./deploy.sh"
echo "2. Test Stripe checkout: curl -X POST https://your-api-url/api/create-checkout-session"
echo "3. Test cross-posting: curl -X POST https://your-api-url/api/cross-post"
echo ""
echo "🔒 All sensitive API keys are now securely stored in Google Secret Manager!"