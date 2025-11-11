#!/bin/bash

# Test script for automated publishing feature

echo "🧪 Testing Auto-Publishing Configuration..."
echo ""

# Check if server is running
if ! curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "❌ Server not running. Start it with: cd api && npm start"
    exit 1
fi

echo "✅ Server is running"
echo ""

# Check environment variables
echo "📋 Checking environment configuration..."
echo ""

check_env() {
    if [ -z "${!1}" ]; then
        echo "  ⚠️  $1 not set"
        return 1
    else
        echo "  ✅ $1 configured"
        return 0
    fi
}

# Required for auto-publishing
cd api
if [ -f .env ]; then
    source .env
    
    echo "Core Publishing Settings:"
    check_env AUTO_PUBLISH_ENABLED
    check_env AUTO_PUBLISH_THRESHOLD
    check_env AUTO_PUBLISH_CHANNELS
    
    echo ""
    echo "Marketplace Credentials:"
    check_env EBAY_OAUTH_TOKEN
    check_env FACEBOOK_ACCESS_TOKEN
    check_env FB_CATALOG_ID
    
    echo ""
    echo "Admin Access:"
    check_env ADMIN_API_KEY
else
    echo "  ⚠️  No .env file found in api/"
fi

echo ""
echo "📊 Summary:"
echo ""

if [ "$AUTO_PUBLISH_ENABLED" = "true" ]; then
    echo "  Status: ✅ Auto-publishing ENABLED"
    echo "  Threshold: ${AUTO_PUBLISH_THRESHOLD:-5} products"
    echo "  Channels: ${AUTO_PUBLISH_CHANNELS:-ebay,facebook}"
else
    echo "  Status: ⚠️  Auto-publishing DISABLED"
    echo "  Enable with: AUTO_PUBLISH_ENABLED=true"
fi

echo ""
echo "🔑 Next Steps:"
echo ""

if [ -z "$EBAY_OAUTH_TOKEN" ]; then
    echo "  1. Get eBay OAuth token from https://developer.ebay.com"
    echo "     Set EBAY_OAUTH_TOKEN in api/.env"
fi

if [ -z "$FACEBOOK_ACCESS_TOKEN" ] || [ -z "$FB_CATALOG_ID" ]; then
    echo "  2. Get Facebook credentials from https://developers.facebook.com"
    echo "     Set FACEBOOK_ACCESS_TOKEN and FB_CATALOG_ID in api/.env"
fi

if [ -z "$ADMIN_API_KEY" ]; then
    echo "  3. Generate admin API key:"
    echo "     echo \"ADMIN_API_KEY=\$(openssl rand -base64 32)\" >> api/.env"
fi

echo ""
echo "  4. Test publishing (requires valid JWT):"
echo "     curl -X POST http://localhost:8080/admin/publish-config \\"
echo "       -H \"Authorization: Bearer YOUR_JWT\""
echo ""

echo "📚 Documentation: AUTO_PUBLISH_GUIDE.md"
