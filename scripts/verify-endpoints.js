/**
 * Quick verification script for Photo2Profit Cloud Run service.
 * Tests all key endpoints and logs status + response summaries.
 */

import fetch from "node-fetch";

const BASE_URL = process.env.CLOUD_RUN_URL || "https://photo2profit-api-uc.a.run.app";

const endpoints = [
  { path: "/", method: "GET" },
  { path: "/health", method: "GET" },
  {
    path: "/api/analyze-product",
    method: "POST",
    body: {
      listingId: "test123",
      title: "Rose Gold Handbag",
      description: "Like new, barely used.",
      price: 45,
      images: ["https://example.com/test.jpg"],
    },
  },
  {
    path: "/api/cross-post",
    method: "POST",
    body: {
      listingId: "test456",
      title: "Diamond Font Wallet",
      description: "Luxury rose-gold shimmer finish.",
      price: 55,
      images: ["https://example.com/wallet.jpg"],
      platforms: ["ebay", "facebook"],
      userId: "test_user"
    },
  },
  {
    path: "/api/create-checkout-session", 
    method: "POST",
    body: {
      priceId: "price_test_example",
      userId: "test_user_123",
      plan: "premium"
    }
  },
  {
    path: "/api/process-listing",
    method: "POST",
    body: {
      listingId: "test_process_789",
      listingData: {
        title: "Baddie Mode Accessories",
        description: "Photo2Payday luxury collection",
        price: 75,
        autoCrossPost: true,
        platforms: ["ebay"]
      }
    }
  }
];

async function testEndpoint(ep) {
  const url = `${BASE_URL}${ep.path}`;
  const opts = {
    method: ep.method,
    headers: { "Content-Type": "application/json" },
  };
  if (ep.body) opts.body = JSON.stringify(ep.body);

  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    console.log(`\n🔹 ${ep.method} ${ep.path} → ${res.status}`);
    console.log(text.slice(0, 200)); // print first 200 chars
    return res.ok ? "✅ OK" : `⚠️ ${res.status}`;
  } catch (err) {
    console.error(`❌ ${ep.path} failed:`, err.message);
    return "❌ Failed";
  }
}

(async () => {
  console.log(`🚀 Verifying Cloud Run service at: ${BASE_URL}`);
  const results = {};
  for (const ep of endpoints) {
    results[ep.path] = await testEndpoint(ep);
  }

  console.log("\n📋 Summary:");
  Object.entries(results).forEach(([path, result]) =>
    console.log(`${result}  ${path}`)
  );
})();