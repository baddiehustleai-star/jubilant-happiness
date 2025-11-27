#!/bin/bash
# Quick Vercel Environment Variables Setup Script
# Run this after you have your API keys ready

echo "🔧 Setting up Photo2Profit environment variables in Vercel..."
echo "Make sure you have your API keys ready!"
echo ""

# Firebase Configuration
echo "📱 Setting up Firebase configuration..."
echo "Enter your Firebase API Key:"
read -p "VITE_FIREBASE_API_KEY: " firebase_api_key
vercel env add VITE_FIREBASE_API_KEY "$firebase_api_key" production

echo "Enter your Firebase Auth Domain (e.g., your-project.firebaseapp.com):"
read -p "VITE_FIREBASE_AUTH_DOMAIN: " firebase_auth_domain
vercel env add VITE_FIREBASE_AUTH_DOMAIN "$firebase_auth_domain" production

echo "Enter your Firebase Project ID:"
read -p "VITE_FIREBASE_PROJECT_ID: " firebase_project_id
vercel env add VITE_FIREBASE_PROJECT_ID "$firebase_project_id" production

echo "Enter your Firebase Storage Bucket:"
read -p "VITE_FIREBASE_STORAGE_BUCKET: " firebase_storage_bucket
vercel env add VITE_FIREBASE_STORAGE_BUCKET "$firebase_storage_bucket" production

echo "Enter your Firebase Messaging Sender ID:"
read -p "VITE_FIREBASE_MESSAGING_SENDER_ID: " firebase_messaging_id
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID "$firebase_messaging_id" production

echo "Enter your Firebase App ID:"
read -p "VITE_FIREBASE_APP_ID: " firebase_app_id
vercel env add VITE_FIREBASE_APP_ID "$firebase_app_id" production

# Stripe Configuration
echo ""
echo "💳 Setting up Stripe configuration..."
echo "Enter your Stripe Publishable Key:"
read -p "VITE_STRIPE_PUBLISHABLE_KEY: " stripe_publishable_key
vercel env add VITE_STRIPE_PUBLISHABLE_KEY "$stripe_publishable_key" production

echo "Enter your Stripe Secret Key:"
read -s -p "STRIPE_SECRET_KEY: " stripe_secret_key
echo ""
vercel env add STRIPE_SECRET_KEY "$stripe_secret_key" production

# Remove.bg API
echo ""
echo "✂️ Setting up Remove.bg API..."
echo "Enter your Remove.bg API Key:"
read -s -p "REMOVEBG_API_KEY: " removebg_api_key
echo ""
vercel env add REMOVEBG_API_KEY "$removebg_api_key" production

# Optional: eBay API
echo ""
echo "🛒 eBay API (optional - press Enter to skip):"
read -p "EBAY_CLIENT_ID (optional): " ebay_client_id
if [ ! -z "$ebay_client_id" ]; then
    vercel env add EBAY_CLIENT_ID "$ebay_client_id" production
    
    read -s -p "EBAY_CLIENT_SECRET: " ebay_client_secret
    echo ""
    vercel env add EBAY_CLIENT_SECRET "$ebay_client_secret" production
fi

echo ""
echo "✅ Environment variables setup complete!"
echo "🚀 Deploying updated configuration..."

# Redeploy with new environment variables
vercel --prod

echo ""
echo "🎉 Production deployment complete!"
echo "🔗 Your app: https://jubilant-happiness-8fc7bo13t-baddiehustle.vercel.app"
echo ""
echo "📋 Next steps:"
echo "1. Test authentication at your live URL"
echo "2. Test payment processing"
echo "3. Verify API integrations work"
echo "4. Set up monitoring and analytics"