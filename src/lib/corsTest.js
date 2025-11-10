/* eslint-env browser */

/**
 * CORS Testing Utilities for Photo2Profit
 * 
 * These utilities help test CORS configuration between the Firebase frontend
 * and Cloud Run backend API.
 */

const API_URL = 'https://photo2profit-api-758851214311.us-west2.run.app';

/**
 * Test basic CORS connectivity to the API
 * @returns {Promise<Object>} API response data
 */
export async function testCorsConnection() {
  try {
    console.log('🧪 Testing CORS connection to:', API_URL);
    
    const response = await fetch(`${API_URL}/api`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ CORS Success!', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ CORS Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Test CORS with a POST request (requires preflight)
 * @param {Object} payload - Data to send in POST request
 * @returns {Promise<Object>} API response data
 */
export async function testCorsPost(payload = { test: 'data' }) {
  try {
    console.log('🧪 Testing CORS POST request to:', API_URL);
    
    const response = await fetch(`${API_URL}/api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('✅ POST Success!', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ POST Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Test API health endpoint
 * @returns {Promise<Object>} Health check data
 */
export async function testApiHealth() {
  try {
    console.log('🏥 Testing API health endpoint');
    
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Health check passed!', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Run all CORS tests
 * @returns {Promise<Object>} Test results
 */
export async function runAllCorsTests() {
  console.log('🚀 Running all CORS tests...\n');
  
  const results = {
    basicConnection: await testCorsConnection(),
    healthCheck: await testApiHealth(),
    postRequest: await testCorsPost(),
  };

  console.log('\n📊 Test Results Summary:');
  console.log('Basic Connection:', results.basicConnection.success ? '✅' : '❌');
  console.log('Health Check:', results.healthCheck.success ? '✅' : '❌');
  console.log('POST Request:', results.postRequest.success ? '✅' : '❌');

  const allPassed = Object.values(results).every(r => r.success);
  console.log(allPassed ? '\n🎉 All tests passed!' : '\n⚠️  Some tests failed');

  return results;
}

// Browser console helper
if (typeof window !== 'undefined') {
  window.corsTest = {
    test: testCorsConnection,
    testPost: testCorsPost,
    testHealth: testApiHealth,
    runAll: runAllCorsTests,
  };
  
  console.log('💡 CORS testing utilities loaded!');
  console.log('Usage:');
  console.log('  corsTest.test()      - Test basic GET request');
  console.log('  corsTest.testPost()  - Test POST request');
  console.log('  corsTest.testHealth() - Test health endpoint');
  console.log('  corsTest.runAll()    - Run all tests');
}
