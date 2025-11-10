# Quick Start: Testing CORS

## 1. Browser Console Test (Recommended)

Open https://photo2profitbaddie.web.app and paste in console (F12):

```js
fetch('https://photo2profit-api-758851214311.us-west2.run.app/api', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
  .then(res => res.text())
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.error('❌ Error:', err));
```

**Success:** `✅ Success: {"message":"Photo2Profit API is alive!",...}`  
**Failure:** `❌ Error: TypeError: Failed to fetch` + CORS error

---

## 2. curl Test

```bash
curl -I -X GET \
  -H "Origin: https://photo2profitbaddie.web.app" \
  https://photo2profit-api-758851214311.us-west2.run.app/api
```

**Look for:** `Access-Control-Allow-Origin: https://photo2profitbaddie.web.app`

---

## 3. Local Backend Testing

```bash
# In backend directory
npm install
npm start

# In another terminal
curl http://localhost:8080/api
curl -I -H "Origin: https://photo2profitbaddie.web.app" http://localhost:8080/api
```

---

## Files Added

- `backend/` - Express.js API with CORS
- `cors-test.html` - Interactive testing page
- `src/lib/corsTest.js` - Testing utilities
- `CORS_TESTING.md` - Full guide
- `backend/README.md` - Deployment guide

---

## Deploy Backend

```bash
cd backend
gcloud run deploy photo2profit-api \
  --source . \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated \
  --project photo2profit
```

---

## Next Steps

1. Deploy backend to Cloud Run
2. Test CORS from browser
3. Implement Stripe webhooks
4. Add authentication
