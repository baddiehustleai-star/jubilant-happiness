# CORS Testing Guide for Photo2Profit

This guide provides comprehensive instructions for testing CORS (Cross-Origin Resource Sharing) configuration between your Firebase frontend and Cloud Run backend.

## Overview

**Frontend:** https://photo2profitbaddie.web.app (Firebase Hosting)  
**Backend API:** https://photo2profit-api-758851214311.us-west2.run.app (Google Cloud Run)

The backend must have proper CORS configuration to accept requests from the frontend. This guide shows you how to verify that configuration.

## 🧠 Option 1: Browser Console Test

This is the most reliable way to test CORS from the actual frontend environment.

### Steps:

1. Open your **Firebase frontend** in a browser: https://photo2profitbaddie.web.app
2. Press **F12** (or **Cmd+Option+I** on Mac) to open **DevTools**
3. Click on the **Console** tab
4. Paste the following code and press **Enter**:

```javascript
fetch('https://photo2profit-api-758851214311.us-west2.run.app/api', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
  .then((res) => res.text())
  .then((data) => console.log('✅ Success:', data))
  .catch((err) => console.error('❌ Error:', err));
```

### What to expect:

#### ✅ If CORS is working correctly:

```
✅ Success: {"message":"Photo2Profit API is alive!","timestamp":"2025-11-10T06:00:00.000Z","version":"1.0.0"}
```

- No red error messages in the console
- The response data is displayed
- Network tab shows status `200 OK`

#### ❌ If CORS is NOT configured:

```
❌ Error: TypeError: Failed to fetch
```

Plus a red CORS error banner like:

```
Access to fetch at 'https://photo2profit-api-758851214311.us-west2.run.app/api'
from origin 'https://photo2profitbaddie.web.app' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

This means your Firebase domain isn't in the backend's `allowedOrigins` list.

---

## ⚙️ Option 2: curl Test (Command Line)

Test CORS headers from your terminal or Cloud Shell without needing a browser.

### Basic GET request test:

```bash
curl -I -X GET \
  -H "Origin: https://photo2profitbaddie.web.app" \
  https://photo2profit-api-758851214311.us-west2.run.app/api
```

### What to look for in the response:

#### ✅ Success - Headers should include:

```
HTTP/2 200
access-control-allow-origin: https://photo2profitbaddie.web.app
access-control-allow-credentials: true
access-control-allow-methods: GET,POST,PUT,DELETE,OPTIONS
access-control-allow-headers: Content-Type,Authorization
```

The key header is:

```
access-control-allow-origin: https://photo2profitbaddie.web.app
```

This confirms the backend accepts requests from your frontend.

#### ❌ Failure - Missing CORS headers:

If you don't see the `access-control-allow-origin` header, or it has a different domain, CORS is not configured correctly.

### Test OPTIONS preflight request:

For requests with custom headers (like POST with JSON), browsers send an OPTIONS request first:

```bash
curl -I -X OPTIONS \
  -H "Origin: https://photo2profitbaddie.web.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://photo2profit-api-758851214311.us-west2.run.app/api
```

Should return:

```
HTTP/2 204
access-control-allow-origin: https://photo2profitbaddie.web.app
access-control-allow-methods: GET,POST,PUT,DELETE,OPTIONS
access-control-allow-headers: Content-Type,Authorization
```

---

## 🖥️ Option 3: Interactive Testing Page

Open the included test page for a visual interface:

1. Open `cors-test.html` in your browser
2. Click the test buttons
3. View detailed results and diagnostics

You can also serve it locally:

```bash
npx serve .
# Open http://localhost:3000/cors-test.html
```

Or include it in your Firebase deployment for easy access in production.

---

## 🔍 Using the CORS Test Utilities

The repository includes JavaScript utilities for programmatic CORS testing.

### Import in your frontend code:

```javascript
import { testCorsConnection, testApiHealth, runAllCorsTests } from './lib/corsTest';

// Test basic connection
const result = await testCorsConnection();
console.log(result);

// Test health endpoint
const health = await testApiHealth();
console.log(health);

// Run all tests
const allResults = await runAllCorsTests();
console.log(allResults);
```

### Or use directly in browser console:

The utilities are available globally as `window.corsTest`:

```javascript
// Test basic GET request
corsTest.test();

// Test POST request
corsTest.testPost();

// Test health endpoint
corsTest.testHealth();

// Run all tests
corsTest.runAll();
```

---

## 🚨 Troubleshooting

### Problem: CORS Error in Browser

**Error:** `Access to fetch blocked by CORS policy`

**Solutions:**

1. Verify your frontend domain is in `backend/server.js` `allowedOrigins` array
2. Redeploy the backend after updating origins
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Check the exact origin in Network tab → Request Headers → Origin

### Problem: 404 Not Found

**Solutions:**

1. Verify the API endpoint URL includes `/api`
2. Check the Cloud Run service is deployed and running
3. Verify the service URL matches your configuration

### Problem: 500 Internal Server Error

**Solutions:**

1. Check Cloud Run logs: `gcloud run services logs read photo2profit-api --region us-west2`
2. Verify environment variables are set correctly
3. Check for errors in the server startup

### Problem: Request Timeout / Cold Start

Cloud Run services "sleep" when not used and take 5-15 seconds to wake up.

**Solutions:**

1. Wait and retry after a few seconds
2. For production, set minimum instances: `--min-instances=1`
3. First request may be slow; subsequent requests are fast

---

## 🎯 Expected Results Summary

Once both tests pass, your stack is properly configured:

✅ Firebase frontend can send authenticated requests to your API  
✅ Cloud Run backend responds without CORS errors  
✅ The whole system can now scale and integrate with Stripe, Firestore, etc.  
✅ You can proceed to implement payment webhooks and other features

---

## 📝 Next Steps

After confirming CORS is working:

1. **Implement authentication:** Add Firebase Auth tokens to API requests
2. **Add Stripe webhooks:** Configure webhook endpoints for payment processing
3. **Set up monitoring:** Enable Cloud Run logging and monitoring
4. **Optimize performance:** Configure Cloud Run scaling and caching
5. **Add security:** Implement rate limiting and request validation

---

## 📚 Additional Resources

- [Cloud Run CORS Documentation](https://cloud.google.com/run/docs/configuring/cors)
- [MDN Web Docs: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Backend Deployment Guide](backend/README.md)
- [Express.js CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)

---

## 🆘 Getting Help

If CORS testing fails after following all steps:

1. Check the backend logs for errors
2. Verify your Firebase Hosting domain matches exactly
3. Try testing with `http://localhost:5173` first for local development
4. Review the backend `server.js` configuration
5. Open an issue with the error details and console logs
