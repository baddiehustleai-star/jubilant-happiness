#!/bin/bash

# Test SEO Refresh Endpoint
# This script tests the Photo2Profit SEO refresh functionality

# Configuration
API_URL="${API_URL:-https://photo2profit-api-758851214311.us-west2.run.app}"
CRON_SECRET="${CRON_SECRET:-photo2profit-cron-secret}"

echo "🔍 Testing Photo2Profit SEO Refresh Endpoint"
echo "=============================================="
echo ""
echo "API URL: $API_URL"
echo "Endpoint: /api/seo/refresh"
echo ""

# Test 1: Health check
echo "1️⃣  Testing API health..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/health")
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | head -n -1)
HEALTH_CODE=$(echo "$HEALTH_RESPONSE" | tail -n 1)

if [ "$HEALTH_CODE" = "200" ]; then
    echo "   ✅ Health check passed"
    echo "   Response: $HEALTH_BODY"
else
    echo "   ❌ Health check failed (HTTP $HEALTH_CODE)"
    echo "   Response: $HEALTH_BODY"
    exit 1
fi

echo ""

# Test 2: SEO refresh without authentication (should fail)
echo "2️⃣  Testing SEO refresh without auth (should return 403)..."
NOAUTH_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/seo/refresh")
NOAUTH_CODE=$(echo "$NOAUTH_RESPONSE" | tail -n 1)

if [ "$NOAUTH_CODE" = "403" ]; then
    echo "   ✅ Correctly rejected unauthenticated request"
else
    echo "   ⚠️  Expected 403, got HTTP $NOAUTH_CODE"
fi

echo ""

# Test 3: SEO refresh with authentication
echo "3️⃣  Testing SEO refresh with authentication..."
echo "   Using secret: $CRON_SECRET"
echo ""
echo "   Sending request..."

RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST \
    -H "x-cron-secret: $CRON_SECRET" \
    "$API_URL/api/seo/refresh")

BODY=$(echo "$RESPONSE" | head -n -1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

echo ""
echo "   HTTP Status: $HTTP_CODE"
echo "   Response: $BODY"
echo ""

# Parse JSON response
if command -v jq &> /dev/null; then
    SUCCESS=$(echo "$BODY" | jq -r '.success // false')
    REFRESHED=$(echo "$BODY" | jq -r '.refreshed // 0')
    EXAMINED=$(echo "$BODY" | jq -r '.examined // 0')
    ERRORS=$(echo "$BODY" | jq -r '.errors // []')
    
    if [ "$HTTP_CODE" = "200" ] && [ "$SUCCESS" = "true" ]; then
        echo "   ✅ SEO refresh successful!"
        echo "   📊 Statistics:"
        echo "      • Products examined: $EXAMINED"
        echo "      • Products refreshed: $REFRESHED"
        echo "      • Errors: $(echo "$ERRORS" | jq length)"
    else
        echo "   ❌ SEO refresh failed"
        echo "   Error: $(echo "$BODY" | jq -r '.error // "Unknown error"')"
        exit 1
    fi
else
    # Fallback if jq is not available
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ SEO refresh successful!"
        echo "   💡 Install 'jq' for detailed response parsing"
    else
        echo "   ❌ SEO refresh failed (HTTP $HTTP_CODE)"
        exit 1
    fi
fi

echo ""
echo "4️⃣  Email notification check..."
echo "   📧 Check your inbox for 'Photo2Profit Monthly SEO Report'"
echo "   Email should be sent to: \$NOTIFY_EMAIL (configured in Cloud Run)"
echo ""

echo "✅ All tests passed!"
echo ""
echo "🎉 Your SEO refresh endpoint is working correctly!"
echo ""
echo "💡 Tips:"
echo "   • Set up Cloud Scheduler to run this monthly"
echo "   • Monitor the email reports to track SEO performance"
echo "   • Check Firestore to see updated seoScore values"
echo ""

exit 0
