# Google Cloud Deployment Workflow

This document explains the generic Google Cloud Platform (GCP) deployment workflow located at `.github/workflows/gcp-deploy.yml`.

## Overview

The `gcp-deploy.yml` workflow provides a flexible template for deploying applications to various Google Cloud services. It includes proper authentication setup and examples for multiple GCP deployment targets.

## Features

- ✅ **Modern Authentication**: Uses `google-github-actions/auth@v2` with JSON credentials
- ✅ **Flexible Configuration**: Supports multiple GCP services (App Engine, Cloud Run, Cloud Functions, GKE)
- ✅ **Manual Trigger**: Can be triggered manually via GitHub Actions UI
- ✅ **Auto Deploy**: Automatically deploys on push to main branch
- ✅ **Secure**: Uses GitHub Secrets for credential management

## Supported Deployment Targets

The workflow includes commented examples for:

1. **App Engine**: Traditional PaaS platform
2. **Cloud Run**: Serverless container platform
3. **Cloud Functions**: Event-driven serverless functions
4. **GKE (Kubernetes)**: Container orchestration
5. **Cloud Storage**: Static website hosting

## Prerequisites

### 1. Create a GCP Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin** → **Service Accounts**
3. Click **Create Service Account**
4. Provide a name (e.g., `github-actions-deployer`)
5. Grant necessary roles based on your deployment target:
   - **App Engine**: `App Engine Admin`, `Service Account User`
   - **Cloud Run**: `Cloud Run Admin`, `Service Account User`
   - **Cloud Functions**: `Cloud Functions Admin`, `Service Account User`
   - **GKE**: `Kubernetes Engine Developer`
   - **Storage**: `Storage Admin`

### 2. Download Service Account Key

1. In the Service Accounts list, click on your newly created service account
2. Go to the **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Download the JSON key file

### 3. Add GitHub Secret

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GCP_SA_KEY`
5. Value: Paste the entire contents of the JSON key file
6. Click **Add secret**

## Configuration

### Environment Variables

Edit the `env` section in `.github/workflows/gcp-deploy.yml`:

```yaml
env:
  PROJECT_ID: your-gcp-project-id # Replace with your GCP project ID
  REGION: us-west2 # Change to your preferred region
```

### Deployment Target

Uncomment and configure the deployment steps for your target service:

#### App Engine

```yaml
- name: Deploy to App Engine
  run: |
    gcloud app deploy --quiet --project=${{ env.PROJECT_ID }}
```

**Requirements**: Create an `app.yaml` file in your repository root

#### Cloud Run

```yaml
- name: Deploy to Cloud Run
  run: |
    gcloud run deploy your-service-name \
      --source . \
      --region ${{ env.REGION }} \
      --platform managed \
      --allow-unauthenticated
```

**Requirements**: Dockerfile or buildpacks-compatible source code

#### Cloud Functions

```yaml
- name: Deploy to Cloud Functions
  run: |
    gcloud functions deploy your-function-name \
      --runtime nodejs20 \
      --trigger-http \
      --allow-unauthenticated \
      --region ${{ env.REGION }}
```

**Requirements**: Function code with proper entry point

## Usage

### Automatic Deployment

The workflow automatically triggers when you push to the `main` branch:

```bash
git add .
git commit -m "Deploy to GCP"
git push origin main
```

### Manual Deployment

1. Go to **Actions** tab in your GitHub repository
2. Click on **Deploy to Google Cloud** workflow
3. Click **Run workflow** button
4. Select the branch to deploy from
5. Click **Run workflow**

## Verification

After deployment, the workflow will:

1. ✅ Authenticate with GCP using the service account
2. ✅ Set up gcloud CLI
3. ✅ Execute the configured deployment steps
4. ✅ Display configuration information

Check the workflow run logs to verify successful deployment.

## Existing Workflows

Note that this repository already has specific deployment workflows:

- **`deploy.yml`**: Backend deployment to Cloud Run
- **`frontend-deploy.yml`**: Frontend deployment to Firebase Hosting

The `gcp-deploy.yml` workflow serves as a flexible template for additional deployments or alternative deployment strategies.

## Troubleshooting

### Authentication Failed

**Error**: `Error: google-github-actions/auth failed with: retry function failed after 3 attempts`

**Solution**:

- Verify `GCP_SA_KEY` secret is set correctly
- Ensure the JSON key file contents are complete and valid
- Check that the service account still exists in GCP

### Permission Denied

**Error**: `ERROR: (gcloud.xxx.deploy) User does not have permission to access project`

**Solution**:

- Verify the service account has the necessary roles
- Go to **IAM & Admin** → **IAM** in GCP Console
- Grant required permissions to the service account

### Project Not Found

**Error**: `ERROR: (gcloud) The project property is set to the empty string, which is invalid`

**Solution**:

- Update the `PROJECT_ID` environment variable in the workflow file
- Ensure the project ID matches your GCP project

### Region Not Supported

**Error**: `ERROR: (gcloud.xxx) INVALID_ARGUMENT: The region 'xxx' does not exist`

**Solution**:

- Update the `REGION` environment variable to a valid GCP region
- Check [GCP regions documentation](https://cloud.google.com/about/locations)

## Security Best Practices

1. **Never commit** service account keys to the repository
2. **Use least privilege**: Grant only necessary permissions to the service account
3. **Rotate keys**: Periodically rotate service account keys
4. **Enable audit logs**: Monitor deployments in GCP audit logs
5. **Use Workload Identity**: Consider using Workload Identity Federation instead of JSON keys for enhanced security

## Alternative: Workload Identity Federation

For enhanced security, you can use Workload Identity Federation instead of JSON keys:

```yaml
- name: Authenticate with GCP
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: 'projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID'
    service_account: 'SERVICE_ACCOUNT_EMAIL'
```

See [Workload Identity Federation documentation](https://github.com/google-github-actions/auth#setting-up-workload-identity-federation) for setup instructions.

## Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [google-github-actions/auth](https://github.com/google-github-actions/auth)
- [google-github-actions/setup-gcloud](https://github.com/google-github-actions/setup-gcloud)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Repository Deployment Guide](../README-DEPLOY.md)

## Support

For issues or questions:

- Create an issue in this repository
- Check existing GitHub Actions logs
- Review GCP deployment logs in Cloud Console
- Email: support@photo2profit.app
