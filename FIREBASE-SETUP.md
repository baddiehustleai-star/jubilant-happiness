# Firebase Hosting Setup Guide

This guide walks you through setting up Firebase Hosting for the Photo2Profit frontend at `photo2profit.app`.

## Prerequisites

- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created (project ID: `photo2profitbaddie`)
- Domain `photo2profit.app` registered and ready for DNS configuration

## 1. Initial Firebase Setup

### Login to Firebase

```bash
firebase login
```

### Initialize Firebase (Already Done)

The repository already includes `firebase.json` and `.firebaserc` configured for the project. If you need to reinitialize:

```bash
firebase init hosting
```

Select:
- Use existing project: `photo2profitbaddie`
- Public directory: `dist`
- Configure as single-page app: `Yes`
- Don't overwrite existing files

## 2. Local Testing

Build and test the site locally before deploying:

```bash
# Build the production site
npm run build

# Test locally with Firebase
firebase serve --only hosting
```

Visit `http://localhost:5000` to preview your site.

## 3. Deploy to Firebase Hosting

### Manual Deployment

```bash
# Build the site
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Automated Deployment (Recommended)

The repository includes GitHub Actions workflows that automatically deploy on push to `main`:

- `.github/workflows/frontend-deploy.yml` - Deploys frontend to Firebase Hosting

#### Required GitHub Secrets

Set these in **Settings → Secrets and variables → Actions**:

| Secret Name | Description | How to Get It |
|-------------|-------------|---------------|
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON | Firebase Console → Project Settings → Service Accounts → Generate new private key |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | Google Cloud service account | Google Cloud Console → IAM & Admin → Service Accounts → Create key |

## 4. Custom Domain Setup

### Add Custom Domain in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `photo2profitbaddie`
3. Navigate to **Hosting** → **Add custom domain**
4. Enter your domain: `photo2profit.app`
5. Follow the verification steps

### DNS Configuration

Add these DNS records in your domain registrar:

#### For Root Domain (photo2profit.app)

**Option A: A Records** (Recommended)
```
Type: A
Name: @
Value: 151.101.1.195
TTL: 3600

Type: A
Name: @
Value: 151.101.65.195
TTL: 3600
```

**Option B: CNAME to www**
```
Type: CNAME
Name: @
Value: photo2profit.app.web.app
TTL: 3600
```

#### For www Subdomain

```
Type: CNAME
Name: www
Value: photo2profit.app.web.app
TTL: 3600
```

### Verify Domain Ownership

Firebase will provide a TXT record for verification:

```
Type: TXT
Name: @
Value: [verification code provided by Firebase]
TTL: 3600
```

Add this record and wait for verification (can take up to 24 hours).

## 5. SSL Certificate

Firebase automatically provisions and manages SSL certificates for your custom domain:

- ✅ Free SSL certificate from Let's Encrypt
- ✅ Automatic renewal
- ✅ HTTPS enforced by default

Wait 10-15 minutes after domain verification for the SSL certificate to be provisioned.

## 6. Backend API Subdomain

The backend API runs on Cloud Run at `api.photo2profit.app`. Configure DNS for the API subdomain:

### API Subdomain DNS (api.photo2profit.app)

```
Type: CNAME
Name: api
Value: ghs.googlehosted.com
TTL: 3600
```

Then in Google Cloud Console:
1. Go to **Cloud Run** → Select your service
2. Navigate to **Custom domains** tab
3. Click **Add Mapping**
4. Enter `api.photo2profit.app`
5. Follow verification steps

## 7. Environment Variables

### Frontend Environment Variables

Create `.env.production` for production builds:

```env
VITE_API_BASE_URL=https://api.photo2profit.app
NODE_ENV=production
```

The `frontend-deploy.yml` workflow automatically creates this file during deployment.

### Backend Environment Variables

Set in Cloud Run service:

```bash
gcloud run services update photo2profit-api \
  --region us-west2 \
  --set-env-vars "NODE_ENV=production,STRIPE_SECRET_KEY=sk_live_xxx"
```

Or via Google Cloud Console:
1. Navigate to Cloud Run service
2. Click **Edit & Deploy New Revision**
3. Go to **Variables & Secrets** tab
4. Add environment variables

## 8. Preview Deployments

Firebase Hosting supports preview channels for testing before production:

```bash
# Deploy to preview channel
firebase hosting:channel:deploy preview-feature-name

# Automatically expires after 7 days
```

The preview URL will be:
```
https://photo2profitbaddie--preview-feature-name-abc123.web.app
```

### Preview Deployments for PRs

The repository includes preview deployment workflow in `frontend-deploy.yml`. To enable PR previews:

1. Uncomment the preview deployment section in the workflow
2. PR deployments will create unique preview URLs
3. Comment with preview URL is posted automatically

## 9. Monitoring & Analytics

### Firebase Hosting Metrics

View in Firebase Console → Hosting:
- Request count
- Bandwidth usage
- Response times
- Error rates

### Google Analytics Integration

Add to `index.html` or use Firebase Analytics:

```javascript
// Initialize Firebase Analytics
import { getAnalytics } from "firebase/analytics";
const analytics = getAnalytics(app);
```

## 10. Performance Optimization

Firebase Hosting includes:

✅ **Global CDN** - Content delivered from edge locations worldwide
✅ **Automatic Compression** - Gzip/Brotli compression enabled
✅ **HTTP/2** - Modern protocol support
✅ **Cache Headers** - Configured in `firebase.json`

### Cache Configuration

The `firebase.json` includes optimized cache headers:
- Static assets (JS, CSS, images): 1 year cache
- HTML files: No cache (always fresh)

## 11. Rollback & Version Management

### View Deployment History

```bash
firebase hosting:channel:list
```

### Rollback to Previous Version

```bash
# List releases
firebase hosting:releases:list

# Rollback to specific release
firebase hosting:rollback [RELEASE_ID]
```

Or use Firebase Console → Hosting → Release history → Rollback

## 12. Troubleshooting

### Domain Not Resolving

- **Check DNS propagation**: Use `nslookup photo2profit.app` or https://dnschecker.org
- **Wait for TTL**: DNS changes can take up to 48 hours
- **Verify records**: Ensure A/CNAME records are correct

### SSL Certificate Not Provisioned

- **Wait 15 minutes**: Initial provisioning takes time
- **Check domain verification**: Ensure TXT record is correct
- **Review Firebase Console**: Check for error messages

### 404 Errors

- **Check rewrites**: Ensure `firebase.json` has SPA rewrite rule
- **Verify build**: Check that `dist` directory contains `index.html`
- **Clear cache**: Hard refresh browser (Ctrl+F5)

### Build Failures

- **Check logs**: GitHub Actions → Failed workflow → View logs
- **Verify secrets**: Ensure all required secrets are set
- **Test locally**: Run `npm run build` locally first

## 13. Security Best Practices

- ✅ Never commit service account keys to repository
- ✅ Use GitHub Secrets for all credentials
- ✅ Rotate service account keys regularly
- ✅ Enable Firebase App Check for API protection
- ✅ Set up Firebase Security Rules for data access

## 14. Cost Considerations

Firebase Hosting includes:
- **Spark Plan (Free)**: 10 GB storage, 360 MB/day transfer
- **Blaze Plan (Pay-as-you-go)**: $0.026/GB storage, $0.15/GB transfer

For production sites, Blaze Plan is recommended for:
- Custom domain support
- Increased quotas
- No daily limits

## 15. Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Custom Domain Setup](https://firebase.google.com/docs/hosting/custom-domain)
- [GitHub Actions Deployment](https://github.com/FirebaseExtended/action-hosting-deploy)
- [Cloud Run Custom Domains](https://cloud.google.com/run/docs/mapping-custom-domains)

## 16. Support

For issues or questions:
- 📧 Email: support@photo2profit.app
- 📖 Docs: [README.md](./README.md)
- 🐛 Issues: [GitHub Issues](https://github.com/baddiehustleai-star/jubilant-happiness/issues)

---

**Pro Tip**: Bookmark the Firebase Hosting dashboard for quick access to metrics and deployment status! 🔖
