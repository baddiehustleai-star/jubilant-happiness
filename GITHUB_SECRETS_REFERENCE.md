# 🔐 GitHub Secrets Quick Reference

Quick reference for setting up GitHub Secrets for the CI/CD pipeline.

## Required Secrets

Add these secrets in: **Settings** → **Secrets and variables** → **Actions**

### 1. GCP_PROJECT_ID
```
Value: 758851214311
```
Your Google Cloud Project ID.

### 2. CLOUD_RUN_SERVICE
```
Value: photo2profit-api
```
Name of your Cloud Run service.

### 3. CLOUD_RUN_REGION
```
Value: us-central1
```
Google Cloud region for deployment.

### 4. GOOGLE_APPLICATION_CREDENTIALS_JSON
```json
{
  "type": "service_account",
  "project_id": "758851214311",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "github-actions-deployer@758851214311.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```
**Complete JSON contents** from your service account key file.

⚠️ **Important**: Copy the entire JSON file contents, including all curly braces and quotes.

## Optional Secrets

### 5. SLACK_WEBHOOK_URL (Optional)
```
Value: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```
Slack incoming webhook URL for deployment notifications.

## How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** (top right)
3. Click **Secrets and variables** in left sidebar
4. Click **Actions**
5. Click **New repository secret**
6. Enter the secret name (exactly as shown above)
7. Paste the value
8. Click **Add secret**
9. Repeat for all required secrets

## Verification

After adding all secrets, you can verify they're set correctly:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. You should see these secrets listed:
   - ✅ GCP_PROJECT_ID
   - ✅ CLOUD_RUN_SERVICE
   - ✅ CLOUD_RUN_REGION
   - ✅ GOOGLE_APPLICATION_CREDENTIALS_JSON
   - ⚠️ SLACK_WEBHOOK_URL (optional)

Note: You cannot view secret values after they're added. You can only update or delete them.

## Testing

To test that secrets are configured correctly:

```bash
# Make a small change
echo "# Test" >> README.md
git add README.md
git commit -m "test: verify CI/CD setup"
git push origin main
```

Then check the **Actions** tab in GitHub to see the workflow run.

## Common Issues

### Secret not found
- **Error**: `The secret 'GCP_PROJECT_ID' was not found`
- **Fix**: Double-check the secret name matches exactly (case-sensitive)

### Invalid JSON credentials
- **Error**: `Failed to parse credentials`
- **Fix**: Ensure you copied the entire JSON file, including opening and closing braces

### Permission denied
- **Error**: `Permission denied on resource project`
- **Fix**: Verify service account has all required roles (see CICD_SETUP_GUIDE.md)

## Need Help?

See the complete setup guide: [CICD_SETUP_GUIDE.md](./CICD_SETUP_GUIDE.md)
