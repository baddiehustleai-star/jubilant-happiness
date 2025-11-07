# 💎 Photo2Profit — Icon & Branding Asset Guide

> Manifested by **Hustle & Heal™**  
> Unified icon set for web + Android + iOS + PWA.

---

## 📁 Folder Structure

```
/public/
└── icons/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png
    ├── icon-256.png
    ├── icon-384.png
    ├── icon-512.png
    ├── apple-icon-120.png
    ├── apple-icon-152.png
    ├── apple-icon-167.png
    ├── apple-icon-180.png
    ├── maskable-icon-192.png
    ├── maskable-icon-512.png
    ├── splash-640x1136.png
    ├── splash-750x1334.png
    ├── splash-1125x2436.png
    ├── splash-1242x2688.png
    ├── splash-2048x2732.png
    └── store-icon-1024.png
```

---

## ✨ Sizing & Purpose

| File | Size | Purpose |
|------|------|----------|
| icon-16.png / icon-32.png | 16×16 / 32×32 | Favicon for browsers |
| icon-48 → 256.png | Various | Android + PWA icons |
| icon-384 / 512.png | 384×384 / 512×512 | High-res PWA + maskable |
| apple-icon-120 → 180.png | Various | iPhone / iPad home-screen icons |
| maskable-icon-192 / 512.png | 192×192 / 512×512 | Adaptive Android maskable icons |
| splash-*.png | Various | iOS launch screens (various devices) |
| store-icon-1024.png | 1024×1024 | App Store & Play Store submission (no transparency) |

---

## 🪩 Branding Guidelines

### Color Palette
```css
/* Rose-Gold Gradient */
Primary: #B76E79 (rose-gold)
Secondary: #E9CBA7 (champagne gold)
Background: #F8E0E7 (soft blush)
Accent: #FADADD → #E6A8C2 (gradient)
```

### Design Rules
- ✅ **Background:** Soft blush / rose-gold gradient (`#FADADD → #E6A8C2`)
- ✅ **Foreground:** Diamond camera + dollar sign symbol
- ✅ **Corner Radius:** 20% for 512×512 icons (keep edges round)
- ✅ **Typography:** Cinzel Decorative (diamond font) for any text
- ❌ **No text** on the main store icon — keep clean & luxe
- ✅ **Format:** PNG, 72 dpi, sRGB color profile

### Icon Elements
1. 💎 **Diamond/Gem motif** (represents luxury)
2. 📸 **Camera symbol** (photo upload)
3. 💰 **Dollar sign** (profit focus)
4. 🌹 **Rose-gold gradient** (brand identity)

---

## 🧠 manifest.json Reference

Update `/public/manifest.json`:

```json
{
  "name": "Photo2Profit",
  "short_name": "Photo2Profit",
  "description": "AI-powered resale automation platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F8E0E7",
  "theme_color": "#B76E79",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/icons/icon-128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/maskable-icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/maskable-icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

---

## 📍 Platform-Specific Usage

| Platform | File(s) | Notes |
|----------|---------|-------|
| **Vercel / Web PWA** | icon-192.png, icon-512.png, manifest.json | Standard PWA icons |
| **Android / Play Store** | store-icon-1024.png | High-res icon for Play Console |
| **iOS / App Store** | store-icon-1024.png, apple-icon-180.png | No transparency for store icon |
| **Xcode Assets.xcassets** | apple-icon-*.png | All apple-icon sizes |
| **Firebase Hosting** | Same `/public/icons/` folder | Auto-served via Firebase |
| **Favicon** | icon-16.png, icon-32.png | Browser tab icons |
| **Android Adaptive** | maskable-icon-192.png, maskable-icon-512.png | Supports Android 12+ themes |

---

## 🛠️ Quick Generation Script

### Using ImageMagick (from master 1024×1024 icon)

```bash
cd public/icons

# Standard PWA icons
convert master-icon.png -resize 16x16 icon-16.png
convert master-icon.png -resize 32x32 icon-32.png
convert master-icon.png -resize 48x48 icon-48.png
convert master-icon.png -resize 72x72 icon-72.png
convert master-icon.png -resize 96x96 icon-96.png
convert master-icon.png -resize 128x128 icon-128.png
convert master-icon.png -resize 144x144 icon-144.png
convert master-icon.png -resize 152x152 icon-152.png
convert master-icon.png -resize 192x192 icon-192.png
convert master-icon.png -resize 256x256 icon-256.png
convert master-icon.png -resize 384x384 icon-384.png
convert master-icon.png -resize 512x512 icon-512.png

# Apple Touch icons
convert master-icon.png -resize 120x120 apple-icon-120.png
convert master-icon.png -resize 152x152 apple-icon-152.png
convert master-icon.png -resize 167x167 apple-icon-167.png
convert master-icon.png -resize 180x180 apple-icon-180.png

# Maskable icons (with safe zone padding)
convert master-icon.png -resize 192x192 -gravity center -extent 192x192 maskable-icon-192.png
convert master-icon.png -resize 512x512 -gravity center -extent 512x512 maskable-icon-512.png

# Store icon (no transparency for iOS)
convert master-icon.png -background white -alpha remove -alpha off -resize 1024x1024 store-icon-1024.png
```

### Using Figma/Canva
1. Design master icon at **1024×1024** with transparent background
2. Export all required sizes (use table above)
3. For store-icon-1024.png: flatten background to white
4. Save as PNG-24 with maximum quality

---

## 📱 iOS Splash Screens

Generate splash screens for various iPhone/iPad sizes:

```bash
# iPhone SE (1st gen) / 5s
convert splash-template.png -resize 640x1136 splash-640x1136.png

# iPhone 6/7/8
convert splash-template.png -resize 750x1334 splash-750x1334.png

# iPhone X/11 Pro
convert splash-template.png -resize 1125x2436 splash-1125x2436.png

# iPhone 11 Pro Max / 12 Pro Max
convert splash-template.png -resize 1242x2688 splash-1242x2688.png

# iPad Pro 12.9"
convert splash-template.png -resize 2048x2732 splash-2048x2732.png
```

---

## ✅ Deployment Checklist

- [ ] Design master icon (1024×1024) with rose-gold gradient
- [ ] Generate all PWA sizes (16px → 512px)
- [ ] Create Apple Touch icons (120px → 180px)
- [ ] Generate maskable icons with safe zone padding
- [ ] Create store icon without transparency (1024×1024)
- [ ] Generate iOS splash screens (5 sizes)
- [ ] Update manifest.json with all icon paths
- [ ] Update index.html with favicon and Apple Touch icon links
- [ ] Test PWA install on Android device
- [ ] Test "Add to Home Screen" on iOS device
- [ ] Upload store-icon-1024.png to Play Console
- [ ] Upload store-icon-1024.png to App Store Connect
- [ ] Verify icons display correctly in both stores

---

## 🎨 Design Tools

### Recommended Tools
- **Figma** - Free, browser-based, great for icon design
- **Canva** - Simple templates for icon creation
- **Adobe Illustrator** - Professional vector design
- **Affinity Designer** - One-time purchase alternative
- **ImageMagick** - CLI for batch resizing/conversion

### Quick Templates
- Use Photo2Profit brand colors (#B76E79, #E9CBA7)
- Start with diamond/gem shape
- Add camera icon overlay
- Apply rose-gold gradient
- Export at highest quality

---

## 🚀 Testing

### Test PWA Install
```bash
# 1. Deploy to Vercel
vercel --prod

# 2. Open on mobile browser (Chrome/Safari)
# 3. Tap "Add to Home Screen"
# 4. Verify icon appears correctly on home screen
```

### Test in Capacitor
```bash
# Android
npx cap sync android
npx cap run android

# iOS (macOS only)
npx cap sync ios
npx cap open ios
```

---

## 📞 Support

For custom icon design or branding help:
📧 **support@photo2profit.app**

---

> ✨ *Luxury is efficiency. Profit is automation.*  
> — **Photo2Profit™ by Baddie Hustle & Heal** 💎
