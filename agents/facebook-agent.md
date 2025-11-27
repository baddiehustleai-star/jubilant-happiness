# Facebook Cross-Posting Agent Specification

## AGENT PURPOSE

Build complete Facebook cross-posting functionality for Photo2Profit that actually works. No hallucinations, no placeholders.

## PROJECT CONTEXT

- **App**: Photo2Profit - Background removal + social media cross-posting
- **Tech Stack**: React + Vite frontend, Vercel serverless functions, Remove.bg API
- **Domain**: https://www.photo2profit.online
- **Brand Theme**: Rose-gold colors, luxury aesthetic
- **Current State**: Background removal works, cross-posting is completely missing

## REQUIRED OUTPUTS

### 1. Facebook API Endpoint (`/api/post/facebook.js`)

**MUST IMPLEMENT:**

- Accept processed image blob + caption
- Use Facebook Graph API v18.0+
- Post to Facebook Page (not personal profile)
- Handle Facebook API errors gracefully
- Return success/failure with detailed messages

**API STRUCTURE:**

```javascript
POST /api/post/facebook
Body: { imageUrl: string, caption: string, pageId?: string }
Response: { success: boolean, postId?: string, error?: string }
```

**ENVIRONMENT VARIABLES REQUIRED:**

- `FACEBOOK_PAGE_ACCESS_TOKEN` (already added)
- `FACEBOOK_PAGE_ID` (agent must document this requirement)

### 2. OAuth Authentication (`/api/social/facebook-auth.js`)

**MUST IMPLEMENT:**

- Facebook OAuth flow for page tokens
- Token refresh mechanism
- Secure token storage (environment variables)
- User-friendly auth URL generation

### 3. Frontend Integration Updates

**Files to MODIFY (not replace):**

- `/src/pages/UploadDemo.jsx` - Update share functionality
- Add actual Facebook posting instead of placeholder message

**EXACT CHANGES NEEDED:**

- Replace fake `handleShare()` function with real Facebook API call
- Add loading states during posting
- Show success/failure messages with platform branding
- Maintain existing Photo2Profit UI/UX

### 4. Error Handling & Validation

**MUST IMPLEMENT:**

- Image size/format validation for Facebook requirements
- Network timeout handling (30s max)
- Rate limiting awareness
- User-friendly error messages

## STRICT RULES

### ❌ DO NOT:

- Touch existing background removal code
- Modify Vercel configuration
- Change environment variables that already exist
- Break existing UI layout or branding
- Add unnecessary dependencies
- Create placeholder/demo code

### ✅ DO:

- Test API endpoints with curl examples
- Include proper error logging
- Use existing color scheme (rose, gold, blush)
- Follow existing code patterns
- Document required Facebook App setup
- Provide clear deployment instructions

## CODE QUALITY REQUIREMENTS

### Facebook API Integration:

```javascript
// EXAMPLE PATTERN TO FOLLOW
const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/photos`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: imageUrl,
    caption: caption,
  }),
});
```

### Frontend Error Handling:

```javascript
// EXAMPLE PATTERN TO FOLLOW
try {
  const result = await fetch('/api/post/facebook', {
    /* ... */
  });
  if (result.success) {
    setMessage('✅ Posted to Facebook successfully!');
  } else {
    setMessage(`❌ Facebook posting failed: ${result.error}`);
  }
} catch (error) {
  setMessage('❌ Network error. Please try again.');
}
```

## TESTING REQUIREMENTS

### API Testing Commands:

```bash
# Test Facebook endpoint
curl -X POST https://www.photo2profit.online/api/post/facebook \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://example.com/test.png","caption":"Test post"}'

# Test auth endpoint
curl https://www.photo2profit.online/api/social/facebook-auth
```

### Manual Testing Steps:

1. Upload image through Photo2Profit interface
2. Click share button
3. Verify Facebook post appears on target page
4. Test error cases (invalid tokens, network failures)

## DEPLOYMENT CHECKLIST

### Required Environment Variables:

- `FACEBOOK_PAGE_ACCESS_TOKEN` - Long-lived page access token
- `FACEBOOK_PAGE_ID` - Target Facebook page ID
- `FACEBOOK_APP_ID` - Facebook app identifier
- `FACEBOOK_APP_SECRET` - Facebook app secret

### Facebook App Configuration:

- Enable Pages API permission
- Add domain to app settings
- Configure webhook URLs if needed
- Generate long-lived page tokens

### Vercel Deployment:

- Deploy functions to production
- Test API endpoints work live
- Verify environment variables are set
- Check CORS headers for browser access

## SUCCESS CRITERIA

**AGENT SUCCEEDS WHEN:**

1. User uploads photo to Photo2Profit
2. Background is automatically removed (existing feature)
3. User clicks "Share to Facebook" button
4. Photo posts to Facebook page with Photo2Profit branding
5. User sees confirmation message
6. No errors in production logs

**AGENT FAILS WHEN:**

- Endpoints return 404/500 errors
- Facebook API returns authentication errors
- Frontend shows placeholder messages
- Posted images lack Photo2Profit branding
- User can't complete the full workflow

## FINAL NOTE

This is production code for a real business. Every line must work. Every error must be handled. Every API call must succeed or fail gracefully. No shortcuts.
