#!/bin/bash
# Test script for Photo2Profit AI endpoints

API_BASE="${API_BASE:-http://localhost:8080}"
TEST_IMAGE="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/300px-Cat03.jpg"

echo "🧪 Testing Photo2Profit AI Endpoints"
echo "API Base: $API_BASE"
echo ""

# Test 1: Health check
echo "1️⃣ Health Check..."
curl -s "$API_BASE/health" | jq -r '.status' && echo "✅ API is healthy" || echo "❌ API not responding"
echo ""

# Test 2: Analyze endpoint
echo "2️⃣ Testing /analyze..."
curl -s -X POST "$API_BASE/analyze" \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\"}" | jq '.description' && echo "✅ Analysis complete" || echo "⚠️ Analysis failed (check GEMINI_API_KEY)"
echo ""

# Test 3: Price lookup
echo "3️⃣ Testing /price-lookup..."
curl -s -X POST "$API_BASE/price-lookup" \
  -H "Content-Type: application/json" \
  -d '{"query":"vintage camera"}' | jq '.avgPrice' && echo "✅ Price lookup complete" || echo "⚠️ Price lookup failed (check SERPAPI_KEY)"
echo ""

# Test 4: Background removal (may fail without API key)
echo "4️⃣ Testing /background..."
RESULT=$(curl -s -X POST "$API_BASE/background" \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\"}")
if echo "$RESULT" | jq -e '.imageBase64' > /dev/null 2>&1; then
  echo "✅ Background removal complete"
else
  echo "⚠️ Background removal failed (check REMOVE_BG_KEY or use mock mode)"
fi
echo ""

# Test 5: Magic endpoint (full pipeline)
echo "5️⃣ Testing /magic (full AI pipeline)..."
MAGIC_RESULT=$(curl -s -X POST "$API_BASE/magic" \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\"}")
if echo "$MAGIC_RESULT" | jq -e '.image' > /dev/null 2>&1; then
  echo "✅ Magic endpoint complete!"
  echo "$MAGIC_RESULT" | jq '{description, avgPrice: .prices.average}'
else
  echo "⚠️ Magic endpoint requires all API keys configured"
  echo "$MAGIC_RESULT" | jq '.error'
fi
echo ""

echo "🎉 Test complete!"
echo ""
echo "📝 Note: Some endpoints require API keys in api/.env:"
echo "   - GEMINI_API_KEY (for /analyze and /magic)"
echo "   - REMOVE_BG_KEY (for /background and /magic)"
echo "   - SERPAPI_KEY (for /price-lookup and /magic)"
