# Auto-Publishing Quick Reference

## 🚀 Quick Start (30 seconds)

```bash
# 1. Enable auto-publishing
echo 'AUTO_PUBLISH_ENABLED=true' >> api/.env
echo 'AUTO_PUBLISH_THRESHOLD=5' >> api/.env

# 2. Add marketplace credentials
echo 'EBAY_OAUTH_TOKEN=your-token' >> api/.env
echo 'FACEBOOK_ACCESS_TOKEN=your-token' >> api/.env
echo 'FB_CATALOG_ID=your-catalog-id' >> api/.env

# 3. Test it
./test-autopublish.sh
```

## 📡 API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/admin/publish-config` | GET | JWT | Check settings & status |
| `/admin/publish-my-products` | POST | JWT | Publish your products |
| `/admin/publish-all-pending` | POST | API Key | Publish all (cron) |

## 🎯 Usage Examples

### Check Status
```bash
curl http://localhost:8080/admin/publish-config \
  -H "Authorization: Bearer $TOKEN"
```

### Manual Publish
```bash
curl -X POST http://localhost:8080/admin/publish-my-products \
  -H "Authorization: Bearer $TOKEN"
```

### Cron Job
```bash
curl -X POST http://localhost:8080/admin/publish-all-pending \
  -H "X-API-Key: $ADMIN_API_KEY"
```

## ⚙️ Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `AUTO_PUBLISH_ENABLED` | `false` | Enable auto-publishing |
| `AUTO_PUBLISH_THRESHOLD` | `5` | Products before auto-publish |
| `AUTO_PUBLISH_CHANNELS` | `ebay,facebook` | Target marketplaces |
| `ADMIN_API_KEY` | - | Secure key for cron |
| `EBAY_OAUTH_TOKEN` | - | eBay API credentials |
| `FACEBOOK_ACCESS_TOKEN` | - | Facebook API token |
| `FB_CATALOG_ID` | - | Facebook catalog ID |

## 🔄 How It Works

```
Upload Product → Save with published=false → Check Count
                                                   ↓
                                           Count >= Threshold?
                                                   ↓
                                                  YES
                                                   ↓
                                    Publish to eBay & Facebook
                                                   ↓
                                      Update published=true
```

## 📋 Product Schema

```javascript
{
  id: "abc123",
  image: "...",
  description: "...",
  published: false,              // ← Publishing status
  channels: ["ebay", "facebook"], // ← Where to publish
  publishedAt: null,              // ← Timestamp
  publishResults: {               // ← Results per channel
    ebay: { success: true, ebayId: "..." },
    facebook: { success: true, facebookId: "..." }
  }
}
```

## 🌐 Cloud Scheduler

```bash
# Publish every hour
gcloud scheduler jobs create http publish-products \
  --schedule="0 * * * *" \
  --uri="https://your-api.run.app/admin/publish-all-pending" \
  --http-method=POST \
  --headers="X-API-Key=$ADMIN_API_KEY"
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Not auto-publishing | Set `AUTO_PUBLISH_ENABLED=true` |
| eBay errors | Check `EBAY_OAUTH_TOKEN` valid |
| Facebook errors | Verify `FB_CATALOG_ID` correct |
| Rate limits | Increase threshold or use scheduler |

## 📚 Full Documentation

- **Complete Guide**: `AUTO_PUBLISH_GUIDE.md`
- **Implementation**: `AUTO_PUBLISH_IMPLEMENTATION.md`
- **Test Script**: `./test-autopublish.sh`

## 💡 Pro Tips

1. **Test manually first**: Publish 1 product manually before enabling auto
2. **Monitor logs**: Watch for `✅ Auto-publish triggered`
3. **Start small**: Use threshold=2 for testing, increase for production
4. **Backup plan**: Manual publish always available at `/admin/publish-my-products`

---

**Need help?** Run `./test-autopublish.sh` for diagnostics
