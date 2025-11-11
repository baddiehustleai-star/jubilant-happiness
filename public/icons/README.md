# 💎 Photo2Profit App Icons Guide

> Manifested by **Hustle & Heal™**  
> Icon specifications for PWA, Android, and iOS deployment.

---

## 📱 Required Icon Sizes

### PWA (Web App Manifest)

Place these in `/public/icons/` and reference in `manifest.json`:

| Filename           | Size (px) | Purpose                |
| ------------------ | --------- | ---------------------- |
| `icon-72x72.png`   | 72 × 72   | Android legacy devices |
| `icon-96x96.png`   | 96 × 96   | Android small          |
| `icon-128x128.png` | 128 × 128 | Android medium         |
| `icon-144x144.png` | 144 × 144 | Android large          |
| `icon-152x152.png` | 152 × 152 | iOS small              |
| `icon-192x192.png` | 192 × 192 | Android standard       |
| `icon-384x384.png` | 384 × 384 | Android high-res       |
| `icon-512x512.png` | 512 × 512 | PWA splash screens     |

### Google Play Store

Required for Play Console submission:

| Asset           | Size (px)  | Notes                  |
| --------------- | ---------- | ---------------------- |
| App Icon        | 512 × 512  | PNG, 32-bit with alpha |
| Feature Graphic | 1024 × 500 | JPEG or PNG (no alpha) |
| High-res Icon   | 512 × 512  | Same as app icon       |

### Apple App Store

Required for App Store Connect submission:

| Asset              | Size (px)   | Notes                    |
| ------------------ | ----------- | ------------------------ |
| App Icon           | 1024 × 1024 | PNG, **no transparency** |
| iPhone Screenshots | Various     | 6.7", 6.5", 5.5" sizes   |
| iPad Screenshots   | Various     | 12.9" and 11" sizes      |

---

## 🎨 Design Guidelines

### Brand Colors (Photo2Profit)

```css
Rose Gold Primary: #B76E79
Champagne Gold: #E9CBA7
Soft Blush: #F8E0E7
```

### Icon Design Rules

1. ✅ **Transparent background** for PWA/Android (use PNG with alpha)
2. ❌ **No transparency** for iOS App Store icon (Apple requirement)
3. 💎 Use diamond/gem motif with rose-gold gradient
4. 📸 Include camera or photo element (brand identity)
5. 💰 Subtle dollar sign or profit indicator

### Export Settings

- **Format:** PNG-24 with transparency (except iOS 1024×1024)
- **Color Space:** sRGB
- **Compression:** High quality (minimal artifacts)
- **Naming:** Use exact filenames listed above

---

## 🛠️ Quick Generation

### Using Figma/Canva

1. Design master icon at 1024×1024
2. Export all required sizes
3. Remove alpha channel for iOS version
4. Place in `/public/icons/`

### Using ImageMagick (CLI)

```bash
# Generate all PWA sizes from master icon
convert icon-master.png -resize 72x72 icon-72x72.png
convert icon-master.png -resize 96x96 icon-96x96.png
convert icon-master.png -resize 128x128 icon-128x128.png
convert icon-master.png -resize 144x144 icon-144x144.png
convert icon-master.png -resize 152x152 icon-152x152.png
convert icon-master.png -resize 192x192 icon-192x192.png
convert icon-master.png -resize 384x384 icon-384x384.png
convert icon-master.png -resize 512x512 icon-512x512.png

# Create iOS version without transparency
convert icon-master.png -background white -alpha remove -alpha off -resize 1024x1024 ios-icon-1024.png
```

---

## 📋 Manifest Integration

Update your `/public/manifest.json`:

```json
{
  "name": "Photo2Profit",
  "short_name": "Photo2Profit",
  "icons": [
    { "src": "/icons/icon-72x72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-96x96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/icons/icon-128x128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144x144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-152x152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-384x384.png", "sizes": "384x384", "type": "image/png" },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#B76E79",
  "background_color": "#F8E0E7"
}
```

---

## 🚀 Deployment Checklist

- [ ] Design master icon (1024×1024)
- [ ] Export all PWA sizes (72px → 512px)
- [ ] Create iOS version without transparency (1024×1024)
- [ ] Create Android feature graphic (1024×500)
- [ ] Update `manifest.json` with icon paths
- [ ] Test PWA install on Android/iOS
- [ ] Upload icons to Play Console
- [ ] Upload icon to App Store Connect
- [ ] Verify icons display correctly in both stores

---

## 💡 Testing Icons

### Test PWA Install

1. Deploy to Vercel
2. Open on mobile browser
3. Tap "Add to Home Screen"
4. Verify icon appears correctly

### Test in Capacitor

```bash
# Android
npx cap run android

# iOS (macOS only)
npx cap run ios
```

---

> ✨ _Your icon is your first impression. Make it diamond-worthy._  
> — **Photo2Profit™ by Baddie Hustle & Heal** 💎
