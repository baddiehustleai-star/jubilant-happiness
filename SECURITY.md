# Security Guidelines

## 🔐 Credential Management

### NEVER Commit Sensitive Credentials

**The following files must NEVER be committed to the repository:**

- Service account JSON files (Google Cloud, Firebase, etc.)
- API keys and secrets
- Private keys (`.pem`, `.key` files)
- `.env` files with actual values (only `.env.example` should be committed)
- Database connection strings with credentials
- OAuth tokens and refresh tokens

### Protected File Patterns

The `.gitignore` file is configured to exclude:
```
*service-account*.json
*serviceAccount*.json
*credentials*.json
google-credentials*.json
gcp-credentials*.json
.env
.env.*
```

### Using GitHub Secrets

For CI/CD workflows, always use GitHub Secrets:

1. **Navigate to**: Repository Settings > Secrets and variables > Actions
2. **Add secrets** instead of committing them to code
3. **Reference in workflows** using: `${{ secrets.SECRET_NAME }}`

### Current GitHub Secrets Configuration

The deploy workflow (`.github/workflows/deploy.yml`) uses:

- `GOOGLE_APPLICATION_CREDENTIALS_JSON` - Google Cloud service account (required for Cloud Run)
- `CRON_SECRET` - Optional secret for authenticated endpoints
- `SLACK_WEBHOOK_URL` - Optional Slack notifications

### Service Account Setup for Google Cloud

**Example service account JSON structure** (NEVER commit this to the repository):
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/...",
  "universe_domain": "googleapis.com"
}
```

**To use it securely:**
1. Download the JSON file from Google Cloud Console
2. Store it locally in a secure location (NOT in the repository)
3. Add the entire JSON content as a GitHub Secret named `GOOGLE_APPLICATION_CREDENTIALS_JSON`
4. Delete or secure the local copy

### Environment Variables for Local Development

For local development, create a `.env` file (which is gitignored):
```bash
cp .env.example .env
# Edit .env with your local credentials
```

### Reporting Security Issues

If you discover a security vulnerability, please email:
📧 **security@photo2profit.app**

Do NOT create a public GitHub issue for security vulnerabilities.

## Additional Resources

- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Google Cloud Service Account Best Practices](https://cloud.google.com/iam/docs/best-practices-service-accounts)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
