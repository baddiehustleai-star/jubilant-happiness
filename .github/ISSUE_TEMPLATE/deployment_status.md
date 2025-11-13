---
name: 🚀 Deployment Status Check
about: Request a comprehensive deployment status check for photo2profit.online
title: '[DEPLOY-STATUS] Deployment Status Check Request'
labels: deployment, status-check
assignees: ''
---

## 🚀 Deployment Status Check Request

**Domain to Check:** photo2profit.online

**What I need verified:**

- [ ] Latest commit successfully deployed to production
- [ ] All environment variables (Stripe, OAuth, etc.) properly loaded
- [ ] Deployment logs are clean
- [ ] Live domain resolving with latest changes
- [ ] GitHub Actions runs succeeded
- [ ] Build was deployed
- [ ] Live site reflecting latest push
- [ ] Secrets/configs are synced

**Additional context:**

<!-- Add any specific concerns or context here -->

---

**To trigger the automated status check:**
Comment `@github-actions deployment status` on this issue, or manually trigger the [Deployment Status Check workflow](../../actions/workflows/deployment-status.yml).

---

## Manual Verification Checklist

If you need to manually verify:

### GitHub Actions

- [ ] [CI Workflow](../../actions/workflows/ci.yml) - Last run status
- [ ] [Backend Deploy](../../actions/workflows/deploy.yml) - Cloud Run deployment
- [ ] [Frontend Deploy](../../actions/workflows/frontend-deploy.yml) - Firebase Hosting

### Live Services

- [ ] **Cloud Run API:** Check health endpoint
- [ ] **Firebase Hosting:** Verify latest build deployed
- [ ] **Domain:** https://photo2profit.online accessible

### Environment Variables

- [ ] Stripe keys configured
- [ ] OAuth credentials set
- [ ] Firebase config present
- [ ] API keys valid

### Deployment Logs

- [ ] No errors in Cloud Run logs
- [ ] No errors in Firebase deploy logs
- [ ] No failed GitHub Actions

---

**Need Help?**

- 📧 [support@photo2profit.app](mailto:support@photo2profit.app)
- 📚 [Deployment Documentation](../../blob/main/README-DEPLOY.md)
