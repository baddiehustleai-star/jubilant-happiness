# 🚀 GitHub Deploy Service Account Setup for Google Cloud Run

This guide walks you through creating a dedicated service account in Google Cloud Platform (GCP) that GitHub Actions will use to deploy the Photo2Profit API to Cloud Run.

## Prerequisites

- Access to your Google Cloud Console
- The `photo2profitbaddie` GCP project (or your project name)
- Cloud Shell access or `gcloud` CLI installed locally

---

## 🛠 Step 1: Create the Service Account

Open **Google Cloud Shell** or your terminal with `gcloud` configured, and run:

```bash
gcloud iam service-accounts create github-deploy-bot \
  --display-name="GitHub Cloud Run Deployer" \
  --description="Deploys Photo2Profit API to Cloud Run via GitHub Actions CI/CD pipeline"
```

This creates a new service account named `github-deploy-bot` in your project.

---

## 🧩 Step 2: Grant Required Permissions

The service account needs several IAM roles to deploy and manage Cloud Run services:

### Cloud Run Admin

Allows the service account to create, update, and manage Cloud Run services:

```bash
gcloud projects add-iam-policy-binding photo2profitbaddie \
  --member="serviceAccount:github-deploy-bot@photo2profitbaddie.iam.gserviceaccount.com" \
  --role="roles/run.admin"
```

### Service Account User

Allows the service account to act as other service accounts (required for Cloud Run deployment):

```bash
gcloud projects add-iam-policy-binding photo2profitbaddie \
  --member="serviceAccount:github-deploy-bot@photo2profitbaddie.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

### Storage Admin

Allows the service account to manage Container Registry and Artifact Registry images:

```bash
gcloud projects add-iam-policy-binding photo2profitbaddie \
  --member="serviceAccount:github-deploy-bot@photo2profitbaddie.iam.gserviceaccount.com" \
  --role="roles/storage.admin"
```

---

## 🔑 Step 3: Generate Service Account Key

Create a JSON key file that GitHub Actions will use to authenticate:

```bash
gcloud iam service-accounts keys create ~/github-deploy-key.json \
  --iam-account=github-deploy-bot@photo2profitbaddie.iam.gserviceaccount.com
```

This creates the key file at:
`/home/[YOUR_USERNAME]/github-deploy-key.json`

---

## 🧠 Step 4: Retrieve the Key Contents

Display the key file contents:

```bash
cat ~/github-deploy-key.json
```

**Copy the entire JSON output** (including the opening `{` and closing `}`).

---

## 🔐 Step 5: Add the Key to GitHub Secrets

Now you need to add this key to your GitHub repository as a secret:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Set the following:
   - **Name:** `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - **Value:** Paste the entire JSON key contents from Step 4
5. Click **Add secret**

---

## ✅ Step 6: Verify the Setup (Optional)

Test that the service account can authenticate and access Cloud Run:

```bash
# Authenticate as the service account
gcloud auth activate-service-account \
  --key-file=~/github-deploy-key.json

# List Cloud Run services (should succeed even if list is empty)
gcloud run services list --project=photo2profitbaddie
```

If this works without errors, your service account is properly configured!

---

## 🔒 Security Best Practices

1. **Delete the local key file** after adding it to GitHub secrets:

   ```bash
   rm ~/github-deploy-key.json
   ```

2. **Principle of Least Privilege**: The roles granted above are necessary for Cloud Run deployment. Only add additional roles if specifically required.

3. **Key Rotation**: Periodically rotate service account keys (every 90 days recommended):
   - Create a new key
   - Update the GitHub secret
   - Delete the old key

4. **Audit Access**: Regularly review service account activity in GCP IAM & Admin → Service Accounts

---

## 🎯 Next Steps

Once the service account is set up and the secret is in GitHub:

1. Review the deployment workflow in `.github/workflows/deploy-cloud-run.yml`
2. Ensure your `Dockerfile` is production-ready
3. Push changes to trigger the deployment workflow
4. Monitor the deployment in GitHub Actions and Google Cloud Console

---

## 📋 Additional Configuration

### Environment Variables in Cloud Run

You may need to set environment variables for your Cloud Run service. These can be configured in the deployment workflow or through the Cloud Console:

- `STRIPE_SECRET_KEY`
- `FIREBASE_API_KEY`
- `SENDGRID_API_KEY`
- Other API keys as needed

### Custom Domain Setup

After your first successful deployment, you can:

1. Go to Cloud Console → Cloud Run → [Your Service]
2. Click "Manage Custom Domains"
3. Add your domain and configure DNS

---

## 🆘 Troubleshooting

### "Permission denied" errors

- Verify the service account email matches exactly
- Check that all three IAM roles are applied
- Wait 60 seconds after granting permissions (propagation delay)

### "Invalid credentials" in GitHub Actions

- Ensure the entire JSON key is copied (including `{` and `}`)
- Check for extra spaces or line breaks in the GitHub secret
- Verify the secret name is exactly `GOOGLE_APPLICATION_CREDENTIALS_JSON`

### Cloud Run deployment fails

- Check that Cloud Run API is enabled: `gcloud services enable run.googleapis.com`
- Verify Container Registry or Artifact Registry is enabled
- Ensure the service account has `storage.admin` role

---

## 📞 Support

For additional help:

- 📧 [support@photo2profit.app](mailto:support@photo2profit.app)
- 📚 [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- 💬 [GitHub Actions Documentation](https://docs.github.com/en/actions)
