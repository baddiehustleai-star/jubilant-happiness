# 🚀 Deployment Status Check Guide

This guide explains how to check the deployment status of `photo2profit.online` and verify that your latest changes have been deployed successfully.

## Quick Status Check

### Method 1: Local Pre-Deployment Check (Recommended)

Before pushing your changes, verify your project is ready for deployment:

```bash
# Run the local deployment verification script
npm run verify:deploy
```

This script will check:

- ✅ Dependencies are installed
- ✅ Linting passes
- ✅ Code formatting is correct
- ✅ All tests pass
- ✅ Project builds successfully
- ✅ Environment configuration files exist
- ✅ GitHub workflow files are present
- ✅ Deployment configuration is valid
- ✅ Required secrets are documented
- ✅ Git status (warns about uncommitted changes)

**Benefits:**

- Catches issues before pushing to GitHub
- Saves CI/CD minutes
- Faster feedback loop
- Reduces failed deployments

### Method 2: Automated Workflow (Post-Deployment)

After pushing changes, trigger the automated deployment status check workflow:

1. **Via GitHub UI:**
   - Navigate to [Actions → Deployment Status Check](../../actions/workflows/deployment-status.yml)
   - Click "Run workflow"
   - Optionally specify a custom domain (defaults to `photo2profit.online`)
   - Click "Run workflow" button

2. **Via Issue Comment:**
   - Create or comment on any issue
   - Mention `@github-actions deployment status`
   - The bot will reply with a comprehensive status report

### Method 3: Manual Verification

Check each component individually:

#### 1. GitHub Actions Status

Verify all workflows are passing:

- ✅ [CI Workflow](../../actions/workflows/ci.yml) - Build, lint, test
- ✅ [Backend Deploy](../../actions/workflows/deploy.yml) - Cloud Run deployment
- ✅ [Frontend Deploy](../../actions/workflows/frontend-deploy.yml) - Firebase Hosting

#### 2. Live Services Health

**Backend API (Cloud Run):**

```bash
# Check API health
curl https://YOUR-CLOUD-RUN-URL/api/health

# Expected response: {"status": "ok"}
```

**Frontend (Firebase Hosting):**

```bash
# Check if site is accessible
curl -I https://photo2profit.online

# Expected: HTTP 200 OK
```

#### 3. Environment Variables

Verify in your deployment platforms:

**Cloud Run (Backend):**

```bash
gcloud run services describe photo2profit-api \
  --region us-west2 \
  --format='yaml(spec.template.spec.containers[0].env)'
```

**Vercel/Firebase (Frontend):**

- Check your platform dashboard for environment variables
- Ensure all required variables are set:
  - `VITE_API_BASE_URL`
  - `VITE_STRIPE_PRICE_ID`
  - Firebase config variables

#### 4. Deployment Logs

**Cloud Run:**

```bash
gcloud logging read "resource.type=cloud_run_revision \
  AND resource.labels.service_name=photo2profit-api" \
  --limit 50 --format json
```

**Firebase Hosting:**

- Check deployment history: `firebase hosting:channel:list`
- View logs in Firebase Console

## Local Pre-Deployment Verification

### Using the Verification Script

Run the local verification script before pushing changes:

```bash
npm run verify:deploy
```

This comprehensive check ensures your project is ready for deployment by verifying:

**📦 Dependencies**

- `node_modules` directory exists
- `package.json` is valid and parseable

**🔍 Code Quality**

- ESLint passes with no errors
- Prettier formatting is correct
- All tests pass
- Project builds without errors

**🔐 Configuration**

- `.env.example` exists and contains required variables
- GitHub workflow files are present and valid
- Deployment configuration files exist (firebase.json, api/)
- Health check endpoints are configured

**📋 Documentation**

- Required GitHub secrets are documented in README
- Deployment guides reference necessary credentials

**🌳 Git Status**

- Shows any uncommitted changes
- Warns if working directory is not clean

### Script Output

The script provides clear, color-coded output:

- ✅ **Green**: Check passed
- ⚠️ **Yellow**: Warning (non-blocking)
- ❌ **Red**: Check failed (must fix before deployment)
- ℹ️ **Blue**: Informational message

### Exit Codes

- `0`: All critical checks passed, ready for deployment
- `1`: One or more critical checks failed, fix issues before deploying

### Example Output

```
============================================================
🚀 Photo2Profit Deployment Readiness Check
============================================================

Running pre-deployment verification...

📦 Checking Dependencies
------------------------
✅ node_modules directory exists
✅ package.json is valid

🔍 Running Linter
-----------------
✅ Linting passed

💅 Checking Code Formatting
---------------------------
✅ Code formatting is correct

🧪 Running Tests
----------------
✅ All tests passed

🏗️  Building Project
---------------------
✅ Build completed successfully

[... more checks ...]

📊 Summary
----------

Total checks: 17
Passed: 16
Warnings: 1
Failed: 0

✅ All critical checks passed! Ready for deployment.

Next steps:
  1. Commit and push your changes
  2. Monitor GitHub Actions workflows
  3. Check deployment status with: @github-actions deployment status
```

### When to Use

**Always run before:**

- Pushing to main branch
- Creating a pull request
- Triggering manual deployments
- After making significant changes

**Benefits:**

- **Catch issues early** - Fix problems before CI/CD runs
- **Save time** - Faster feedback than waiting for GitHub Actions
- **Save costs** - Reduce unnecessary CI/CD minutes
- **Confidence** - Know your changes will deploy successfully

## What Gets Checked

The automated deployment status check verifies:

### ✅ GitHub Actions

- Latest commit CI status
- Backend deployment status
- Frontend deployment status
- Links to workflow runs

### ✅ Live Services

- Cloud Run API URL and health
- Latest Cloud Run revision
- Domain DNS resolution
- HTTP accessibility
- Response status codes

### ✅ Configuration

- Required GitHub secrets
- Environment variables
- OAuth credentials
- Stripe keys
- Firebase configuration

### ✅ Latest Deployment

- Commit SHA and metadata
- Deployment timestamps
- Author information
- Commit message

## Status Report Example

The automated check generates a comprehensive report:

```markdown
🚀 Deployment Status Report

📊 Latest Commit

- SHA: abc1234
- Author: Jane Developer
- Date: 2025-11-13 07:00:00 UTC
- Message: Add new feature

✅ GitHub Actions Status

- CI Workflow: ✅ Passed
- Backend Deployment: ✅ Deployed
- Frontend Deployment: ✅ Deployed

🌐 Live Services Status

- Cloud Run API: ✅ Healthy (HTTP 200)
- Production Domain: ✅ Resolving
- HTTP Status: 200
- Accessible: ✅ Yes

🔐 Environment Variables & Secrets

- Configuration Status: ✅ All Required Secrets Configured

📋 Summary
✅ All systems operational! Latest commit has been successfully deployed and is live.
```

## Troubleshooting

### Issue: Deployment Not Triggered

If your deployment workflow didn't run:

1. **Check path filters:**
   - Backend deploys only trigger on changes to `api/**`
   - Frontend deploys only trigger on changes to `src/**`, `public/**`, etc.

2. **Manually trigger:**
   - Go to the respective workflow in Actions
   - Click "Run workflow"
   - Select your branch

### Issue: Deployment Failed

If a deployment workflow failed:

1. **Check workflow logs:**
   - Click on the failed workflow run
   - Review the error logs
   - Look for specific error messages

2. **Common failures:**
   - Missing secrets (check repository settings)
   - Build errors (verify locally first)
   - Network timeouts (retry the deployment)
   - Permission issues (check service account permissions)

### Issue: Site Not Reflecting Changes

If the live site doesn't show your changes:

1. **Hard refresh:** Ctrl+F5 (Windows/Linux) or Cmd+Shift+R (Mac)
2. **Check cache:** CDN or browser cache may be serving old content
3. **Verify deployment:** Ensure the deployment workflow completed successfully
4. **Check commit:** Verify you're looking at the correct commit SHA

### Issue: Health Check Failing

If the health endpoint returns errors:

1. **Check Cloud Run logs:**

   ```bash
   gcloud logging read "resource.type=cloud_run_revision" --limit 50
   ```

2. **Verify environment variables:** Ensure all required variables are set

3. **Check service status:**
   ```bash
   gcloud run services describe photo2profit-api --region us-west2
   ```

## Manual Deployment Triggers

If you need to manually trigger a deployment:

### Backend (Cloud Run)

```bash
# Via gcloud CLI
gcloud run deploy photo2profit-api \
  --source . \
  --region us-west2 \
  --platform managed

# Or trigger via GitHub Actions
# Go to: Actions → Auto Deploy to Cloud Run → Run workflow
```

### Frontend (Firebase)

```bash
# Via Firebase CLI
npm run build
firebase deploy --only hosting

# Or trigger via GitHub Actions
# Go to: Actions → Auto Deploy Frontend → Run workflow
```

## Setting Up Alerts

Configure notifications for deployment status:

1. **GitHub Actions:**
   - Repository Settings → Notifications
   - Enable email notifications for workflow failures

2. **Slack Webhooks:**
   - Add `SLACK_WEBHOOK_URL` to repository secrets
   - Workflows will automatically post updates

3. **Status Checks:**
   - Branch protection rules → Require status checks
   - Ensure deployments pass before merging

## Best Practices

1. **Always check status before releasing:** Run the status check workflow before announcing new features

2. **Monitor after deployment:** Watch for errors in the first few minutes after deployment

3. **Test in staging first:** If available, deploy to staging environment first

4. **Review logs regularly:** Check deployment logs weekly for warnings

5. **Keep secrets updated:** Rotate API keys and tokens regularly

6. **Document changes:** Update deployment docs when adding new services

## Additional Resources

- [Main README](../../README.md)
- [Deployment Guide](../../README-DEPLOY.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [CI/CD Workflows](../../.github/workflows/)

## Getting Help

If you encounter issues:

1. **Create an issue:** Use the [Deployment Status Check template](../../issues/new?template=deployment_status.md)
2. **Email support:** support@photo2profit.app
3. **Check logs:** Review GitHub Actions and Cloud Run logs
4. **Community:** Ask in discussions or team chat

---

**Pro Tip:** Bookmark the [Deployment Status Check workflow](../../actions/workflows/deployment-status.yml) for quick access! 🔖
