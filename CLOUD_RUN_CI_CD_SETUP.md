# 🚀 Cloud Run CI/CD Auto-Deploy Setup

> **Your GitHub Actions CI/CD pipeline scaffolding is live!**  
> Follow this guide to complete the setup and enable automatic deployments to Google Cloud Run.

---

## 📋 Quick Overview

Every time you push to the `main` branch, GitHub Actions will automatically:

1. ✅ Build your application
2. ✅ Deploy to Google Cloud Run
3. ✅ Trigger SEO refresh
4. ✅ Send Slack notification (optional)

**No manual deployments. No terminal commands. Just push and deploy!**

---

## 🔑 Step 1: Add GitHub Secrets

GitHub Secrets keep your credentials secure and encrypted. You'll need to add these secrets to enable automatic deployments.

### How to Add Secrets

1. Go to your GitHub repository: `https://github.com/baddiehustleai-star/jubilant-happiness`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below:

### Required Secrets

| Secret Name                           | Value                | Description                                 |
| ------------------------------------- | -------------------- | ------------------------------------------- |
| `GCP_PROJECT_ID`                      | `photo2profitbaddie` | Your Google Cloud project ID                |
| `CLOUD_RUN_SERVICE`                   | `photo2profit-api`   | Name of your Cloud Run service              |
| `CLOUD_RUN_REGION`                    | `us-west2`           | Cloud Run deployment region                 |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | _(see Step 2 below)_ | Service account JSON key for authentication |

### Optional Secrets

| Secret Name         | Value                                  | Description                           |
| ------------------- | -------------------------------------- | ------------------------------------- |
| `SLACK_WEBHOOK_URL` | `https://hooks.slack.com/services/...` | For deployment notifications to Slack |

---

## 🧰 Step 2: Create Google Service Account

The service account gives GitHub Actions permission to deploy to your Google Cloud project.

### 2.1 Create the Service Account

1. Open [Google Cloud Console - Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. **Select your project:** `photo2profitbaddie`
3. Click **+ CREATE SERVICE ACCOUNT**
4. Fill in the details:
   - **Service account name:** `github-deploy-bot` (or `github-actions-deployer`)
   - **Service account ID:** (auto-generated)
   - **Description:** "Service account for GitHub Actions CI/CD deployments"
5. Click **CREATE AND CONTINUE**

### 2.2 Grant Required Roles

Add these roles to give the service account deployment permissions:

- ✅ **Cloud Run Admin** - Deploy and manage Cloud Run services
- ✅ **Service Account User** - Act as service account
- ✅ **Storage Admin** _(optional)_ - Access Cloud Storage for builds

To add roles:

1. In the "Grant this service account access to project" section
2. Click the **Select a role** dropdown
3. Search for and select each role above
4. Click **CONTINUE**
5. Skip the "Grant users access" section (optional)
6. Click **DONE**

### 2.3 Create and Download JSON Key

1. Find your newly created service account in the list
2. Click on the service account name
3. Go to the **KEYS** tab
4. Click **ADD KEY** → **Create new key**
5. Choose **JSON** format
6. Click **CREATE**
7. The JSON key file will download automatically

⚠️ **Important:** Keep this file secure! It contains credentials to access your Google Cloud project.

### 2.4 Add JSON Key to GitHub Secrets

1. Open the downloaded JSON file in a text editor
2. Copy the **entire contents** of the file
3. Go back to GitHub: **Settings** → **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
6. Value: Paste the entire JSON content
7. Click **Add secret**

---

## 🚀 Step 3: Test Your Setup

Once all secrets are configured, test the automatic deployment:

### 3.1 Push to Main Branch

```bash
git add .
git commit -m "Set up CI/CD auto-deploy for Cloud Run"
git push origin main
```

### 3.2 Watch the Deployment

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You should see a workflow run titled "Deploy to Cloud Run"
4. Click on it to watch the live deployment logs

### 3.3 Expected Workflow Steps

You should see these steps complete successfully:

```
✅ Checkout repository
✅ Set up Node
✅ Install dependencies
✅ Verify build
✅ Authenticate to Google Cloud
✅ Deploy to Cloud Run
✅ Trigger SEO Refresh (optional)
✅ Notify Slack on Success (if configured)
✅ Summary
```

### 3.4 Verify Deployment

Once the workflow completes, your application should be live! Check:

```bash
# Test the deployed service
curl https://photo2profit-api-photo2profitbaddie.us-west2.run.app/health
```

Expected response:

```json
{ "status": "ok", "timestamp": "2024-..." }
```

---

## 🎯 What Happens Next

### Automatic Deployments

Every time you:

- Push to the `main` branch
- Merge a pull request into `main`

GitHub Actions will automatically:

1. Build your application
2. Deploy to Cloud Run
3. Run post-deployment tasks

### No Manual Work Required!

You never need to run these commands manually:

- ❌ `gcloud auth login`
- ❌ `gcloud run deploy`
- ❌ Terminal deployment scripts

Just push your code and let CI/CD handle everything!

---

## 🛡️ Optional: Add Safety Checks

Want to ensure tests pass before deploying? You have two options:

**Quick Option:** Add a test step to the deployment workflow  
**Production Option:** Use branch protection to require CI to pass before merging

📚 **See [CLOUD_RUN_SAFETY_CHECKS.md](./CLOUD_RUN_SAFETY_CHECKS.md)** for detailed instructions on both approaches.

### Quick Implementation

To add a test gate to the deployment workflow, edit `.github/workflows/deploy-cloudrun.yml` and add this step before "Deploy to Cloud Run":

```yaml
- name: Run Tests
  run: npm test
```

This will block deployment if any tests fail.

---

## 🔧 Troubleshooting

### Authentication Failed

**Error:** "ERROR: (gcloud.auth.activate-service-account) Invalid key format"

**Solution:**

- Verify the JSON key is valid and complete
- Make sure you copied the entire JSON content (from `{` to `}`)
- Check that the secret name is exactly `GOOGLE_APPLICATION_CREDENTIALS_JSON`

### Service Not Found

**Error:** "Service 'photo2profit-api' not found"

**Solution:**

- Verify the Cloud Run service exists in your project
- Check that `CLOUD_RUN_SERVICE` matches your actual service name
- Ensure `CLOUD_RUN_REGION` is correct (e.g., `us-west2`)

### Build Failed

**Error:** Build step fails during `npm run build`

**Solution:**

- Test the build locally: `npm run build`
- Check that all dependencies are in `package.json` (not just devDependencies)
- Verify environment variables are not missing

### Slack Notifications Not Working

**Solution:**

- Verify `SLACK_WEBHOOK_URL` is set correctly
- Test the webhook: `curl -X POST -H 'Content-Type: application/json' -d '{"text":"test"}' YOUR_WEBHOOK_URL`
- Check that the webhook is active in your Slack workspace

### Permission Denied

**Error:** "Permission 'run.services.create' denied"

**Solution:**

- Verify service account has **Cloud Run Admin** role
- Check that **Service Account User** role is also granted
- Wait a few minutes for IAM changes to propagate

---

## 🔒 Security Best Practices

✅ **Never commit secrets to the repository**  
✅ **Use GitHub Secrets for all sensitive credentials**  
✅ **Rotate service account keys every 90 days**  
✅ **Use least-privilege IAM roles**  
✅ **Monitor deployment logs for suspicious activity**  
✅ **Keep `.env` files in `.gitignore`** (already configured)

---

## 📚 Additional Resources

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/best-practices-service-accounts)

---

## ✅ Setup Checklist

Use this checklist to track your progress:

- [ ] Added `GCP_PROJECT_ID` secret
- [ ] Added `CLOUD_RUN_SERVICE` secret
- [ ] Added `CLOUD_RUN_REGION` secret
- [ ] Created Google Cloud service account
- [ ] Granted Cloud Run Admin role
- [ ] Granted Service Account User role
- [ ] Created and downloaded JSON key
- [ ] Added `GOOGLE_APPLICATION_CREDENTIALS_JSON` secret
- [ ] (Optional) Added `SLACK_WEBHOOK_URL` secret
- [ ] Pushed to main branch to test
- [ ] Verified deployment in Actions tab
- [ ] Confirmed application is live

---

> 💎 **Your Cloud Run CI/CD pipeline is now fully automated!**  
> Push to `main` and watch your code deploy automatically.

**Questions?** Check the troubleshooting section above or review:

- `.github/workflows/DEPLOY_SETUP.md`
- `.github/workflows/deploy-cloudrun.yml`
