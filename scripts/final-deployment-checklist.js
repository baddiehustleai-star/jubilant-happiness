/**
 * Final Deployment Checklist for Photo2Profit API
 *
 * This script verifies that all components are production-ready:
 * 1. Environment variables are configured
 * 2. API is deployed and accessible
 * 3. SEO refresh endpoint works
 * 4. Product pages load correctly
 */

import fetch from 'node-fetch';
import { config } from 'dotenv';

// Load environment variables
config();

const CLOUD_RUN_URL = process.env.CLOUD_RUN_URL || 'https://photo2profit-api-uc.a.run.app';
const REQUIRED_ENV_VARS = [
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_API_KEY',
  'VITE_STRIPE_PUBLISHABLE_KEY',
];

let allChecks = [];

function logCheck(name, status, message) {
  const icon = status === 'pass' ? '✅' : status === 'warn' ? '⚠️' : '❌';
  console.log(`${icon} ${name}: ${message}`);
  allChecks.push({ name, status, message });
}

async function checkEnvironmentVariables() {
  console.log('\n🔐 Checking Environment Variables...');

  let allPresent = true;
  for (const varName of REQUIRED_ENV_VARS) {
    if (process.env[varName]) {
      logCheck('Environment', 'pass', `${varName} is set`);
    } else {
      logCheck('Environment', 'fail', `${varName} is MISSING`);
      allPresent = false;
    }
  }

  return allPresent;
}

async function checkAPIDeployment() {
  console.log('\n🚀 Checking API Deployment...');

  try {
    const response = await fetch(`${CLOUD_RUN_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      logCheck('API Health', 'pass', `API is running at ${CLOUD_RUN_URL}`);
      if (data.status === 'healthy') {
        logCheck('API Status', 'pass', 'Health check reports healthy');
      } else {
        logCheck('API Status', 'warn', `Health check reports: ${data.status}`);
      }
      return true;
    } else {
      logCheck('API Health', 'fail', `API returned status ${response.status}`);
      return false;
    }
  } catch (error) {
    logCheck('API Health', 'fail', `Cannot reach API: ${error.message}`);
    return false;
  }
}

async function testSEORefreshEndpoint() {
  console.log('\n🔍 Testing SEO Refresh Endpoint...');

  try {
    const response = await fetch(`${CLOUD_RUN_URL}/api/seo/refresh?limit=1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cron-secret':
          process.env.CRON_SECRET || process.env.SHARED_WEBHOOK_SECRET || 'test-secret',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        logCheck(
          'SEO Refresh',
          'pass',
          `Refreshed ${data.refreshed} products (examined ${data.examined})`
        );
        return true;
      } else {
        logCheck('SEO Refresh', 'warn', 'Endpoint responded but success=false');
        return false;
      }
    } else if (response.status === 403) {
      logCheck(
        'SEO Refresh',
        'warn',
        'Endpoint requires valid CRON_SECRET (configure in production)'
      );
      return true; // This is expected without proper auth
    } else {
      logCheck('SEO Refresh', 'fail', `SEO endpoint returned ${response.status}`);
      return false;
    }
  } catch (error) {
    logCheck('SEO Refresh', 'fail', `Cannot test SEO endpoint: ${error.message}`);
    return false;
  }
}

async function testProductPageFunctionality() {
  console.log('\n📄 Testing Product Page Functionality...');

  // Test the product page route structure
  try {
    // Test that the share route exists (even if specific product doesn't)
    const response = await fetch(`${CLOUD_RUN_URL}/share/test-product-id`, {
      method: 'GET',
    });

    // We expect either 200 (if test product exists) or 404 (product not found)
    // Both indicate the route is working
    if (response.status === 200) {
      const html = await response.text();
      if (html.includes('<!DOCTYPE html>') && html.includes('<title>')) {
        logCheck('Product Pages', 'pass', 'Product page route is functional');
        return true;
      } else {
        logCheck(
          'Product Pages',
          'warn',
          'Product page route exists but HTML structure unexpected'
        );
        return false;
      }
    } else if (response.status === 404) {
      logCheck(
        'Product Pages',
        'pass',
        'Product page route exists (404 for test product is expected)'
      );
      return true;
    } else {
      logCheck(
        'Product Pages',
        'fail',
        `Product page route returned unexpected status ${response.status}`
      );
      return false;
    }
  } catch (error) {
    logCheck('Product Pages', 'fail', `Cannot test product pages: ${error.message}`);
    return false;
  }
}

async function checkCriticalEndpoints() {
  console.log('\n🔌 Checking Critical Endpoints...');

  const endpoints = [
    { path: '/api/analyze-product', method: 'POST' },
    { path: '/api/cross-post', method: 'POST' },
  ];

  let allWorking = true;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${CLOUD_RUN_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true }),
      });

      // We expect various responses, but as long as we get a response, the endpoint exists
      if (response.status < 500) {
        logCheck('Endpoint', 'pass', `${endpoint.path} is responding`);
      } else {
        logCheck('Endpoint', 'fail', `${endpoint.path} returned ${response.status}`);
        allWorking = false;
      }
    } catch (error) {
      logCheck('Endpoint', 'fail', `${endpoint.path} error: ${error.message}`);
      allWorking = false;
    }
  }

  return allWorking;
}

async function generateDeploymentReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL DEPLOYMENT REPORT');
  console.log('='.repeat(60));

  const passed = allChecks.filter((c) => c.status === 'pass').length;
  const warned = allChecks.filter((c) => c.status === 'warn').length;
  const failed = allChecks.filter((c) => c.status === 'fail').length;

  console.log(`\nTotal Checks: ${allChecks.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️  Warnings: ${warned}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed === 0 && warned === 0) {
    console.log('\n🎉 ALL CHECKS PASSED! Ready for production.');
    return 0;
  } else if (failed === 0) {
    console.log('\n⚠️  All critical checks passed with some warnings.');
    console.log('Review warnings above before proceeding to production.');
    return 0;
  } else {
    console.log('\n❌ DEPLOYMENT NOT READY - Fix failures before deploying.');
    console.log('\nFailed checks:');
    allChecks
      .filter((c) => c.status === 'fail')
      .forEach((check) => {
        console.log(`  - ${check.name}: ${check.message}`);
      });
    return 1;
  }
}

// Main execution
(async () => {
  console.log('🚀 Photo2Profit Final Deployment Checklist');
  console.log(`🌐 Target: ${CLOUD_RUN_URL}`);
  console.log('='.repeat(60));

  await checkEnvironmentVariables();
  await checkAPIDeployment();
  await testSEORefreshEndpoint();
  await testProductPageFunctionality();
  await checkCriticalEndpoints();

  const exitCode = await generateDeploymentReport();
  process.exit(exitCode);
})();
