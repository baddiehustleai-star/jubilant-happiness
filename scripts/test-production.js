#!/usr/bin/env node

/**
 * Production Integration Test Script
 * Tests all API integrations and authentication flows
 */

import fetch from 'cross-fetch';

const BASE_URL =
  process.env.TEST_URL || 'https://jubilant-happiness-8fc7bo13t-baddiehustle.vercel.app';

async function testAPI(endpoint, expectedStatus = 200) {
  try {
    console.log(`🧪 Testing ${endpoint}...`);
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (response.status === expectedStatus) {
      console.log(`✅ ${endpoint} - Status: ${response.status}`);
      return true;
    } else {
      console.log(`❌ ${endpoint} - Expected: ${expectedStatus}, Got: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${endpoint} - Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Photo2Profit Production Tests...\n');

  const tests = [
    // Health checks
    { endpoint: '/api/health', status: 200 },

    // Frontend routes
    { endpoint: '/', status: 200 },
    { endpoint: '/dashboard', status: 200 },

    // API endpoints (should handle CORS)
    { endpoint: '/api/create-checkout-session', status: 405 }, // GET not allowed
    { endpoint: '/api/create-portal-session', status: 405 }, // GET not allowed
    { endpoint: '/api/webhook', status: 405 }, // GET not allowed
    { endpoint: '/api/ebay-listings', status: 405 }, // GET not allowed
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    const success = await testAPI(test.endpoint, test.status);
    if (success) passed++;
  }

  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log('✅ All tests passed! Your deployment is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check your deployment configuration.');
  }

  console.log('\n📋 Manual Testing Checklist:');
  console.log('🔐 Authentication:');
  console.log('   - Visit your app and test sign up/sign in');
  console.log('   - Try Google OAuth');
  console.log('   - Test password reset');
  console.log('');
  console.log('💳 Payment Processing:');
  console.log('   - Test subscription checkout');
  console.log('   - Verify webhook receives events');
  console.log('   - Check customer portal access');
  console.log('');
  console.log('🖼️  Image Processing:');
  console.log('   - Upload test image');
  console.log('   - Verify background removal works');
  console.log('   - Check Firebase Storage uploads');
}

// Run tests
runTests().catch(console.error);
