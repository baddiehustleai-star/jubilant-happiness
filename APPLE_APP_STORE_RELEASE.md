# 🍎 Photo2Profit — Apple App Store Release Checklist

> Manifested by **Hustle & Heal™**  
> Launch your AI resale empire on iOS.  
> This guide covers Xcode → App Store Connect → Approval.

---

## 📱 1️⃣ App Identity
| Field | Example | Notes |
|--------|----------|-------|
| **App Name** | Photo2Profit | Must be unique on App Store |
| **Bundle ID** | com.baddiehustle.photo2profit | Must match Developer account |
| **Category** | Business / Shopping | Primary category |
| **Secondary Category** | Finance (optional) | For revenue-focused apps |
| **Default Language** | English (US) |  |
| **Content Rating** | 12+ or 17+ | Must be accurate for Apple policy |

---

## 🏗️ 2️⃣ Build Your iOS App (.ipa)

**Prerequisites:**
- macOS computer (required for iOS builds)
- Apple Developer Account ($99/year)
- Xcode installed (from App Store)

Run these in your project root:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Photo2Profit" com.baddiehustle.photo2profit
npm run build
npx cap add ios
npx cap open ios
```

Then in **Xcode**:

1. Select your team/developer account
2. **Product › Archive**
3. Once archived, click **Distribute App**
4. Choose **App Store Connect**
5. Upload to TestFlight for testing

---

## 🧠 3️⃣ Link Firebase & Google Cloud

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your Photo2Profit project (758851214311)
3. Go to **Project Settings → Add App → iOS**
4. Enter your Bundle ID: `com.baddiehustle.photo2profit`
5. Download `GoogleService-Info.plist`
6. Drag it into Xcode project (Runner folder)
7. Rebuild your app to connect AI + backend

---

## 🖼️ 4️⃣ App Store Listing Assets

Upload these to **App Store Connect › App Information**

| Asset | Size (px) | Notes |
|-------|-----------|-------|
| App Icon | 1024 × 1024 | No transparency, no rounded corners |
| iPhone Screenshots | 6.7" (1290 × 2796) | iPhone 15 Pro Max size |
| iPhone Screenshots | 6.5" (1284 × 2778) | iPhone 14 Plus size |
| iPad Screenshots | 12.9" (2048 × 2732) | Optional but recommended |
| App Preview Video | 15-30 seconds | Optional marketing video |
| Promotional Text | "AI-powered photo resale automation" | Max 170 characters |
| Description | See your landing page copy | Max 4,000 characters |
| Keywords | "resale,AI,profit,ebay,facebook" | Max 100 characters total |
| Privacy Policy URL | Link to your policy page | Required |
| Support URL | Your website or help page | Required |

---

## 🚀 5️⃣ Submit Your Release

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. **My Apps › + › New App**
3. Fill in app information
4. **TestFlight** tab → Upload your build from Xcode
5. Test thoroughly on real devices
6. **App Store** tab → Select build for submission
7. Click **Submit for Review**

**Typical review time:** 24-48 hours

---

## 🧾 6️⃣ App Store Review Checklist

Apple's review is strict. Ensure:

* ✅ App functions without crashing
* ✅ All features accessible (no placeholder screens)
* ✅ Sign-in works (provide test account if required)
* ✅ In-app purchases use Apple's IAP (not Stripe directly)
* ✅ Privacy policy explains data collection
* ✅ App doesn't violate Apple's guidelines

**Tip:** For subscriptions, you may need to implement **Apple IAP** alongside Stripe for web users.

---

## 💡 7️⃣ Post-Launch Optimization

| Feature | Implementation |
|---------|---------------|
| Push Notifications | Apple Push Notification service (APNs) |
| Universal Links | Deep linking from web to app |
| Widgets | iOS 14+ Home Screen widgets |
| App Clips | Lightweight app previews |
| Siri Shortcuts | Voice commands for quick actions |

---

## 🔄 8️⃣ Maintaining Both Platforms

Use **Capacitor** to share code between iOS and Android:

```bash
# Update both platforms after changes
npm run build
npx cap sync
npx cap open ios      # Test iOS
npx cap open android  # Test Android
```

**Pro tip:** Use GitHub Actions to automate builds for both platforms.

---

## 💎 Pricing Strategy

| Platform | Implementation | Commission |
|----------|---------------|------------|
| **iOS App** | Apple In-App Purchase | Apple takes 30% (15% after year 1) |
| **Android App** | Google Play Billing | Google takes 30% (15% after year 1) |
| **Web (Vercel)** | Stripe direct | Stripe takes 2.9% + $0.30 |

**Recommendation:** Drive users to web signup for better margins, use apps for engagement.

---

> ✨ *Your Photo2Profit empire spans all platforms.*  
> — **Hustle & Heal™ Team** 💎🍎

**Next:** [Google Play Release Guide](./GOOGLE_PLAY_RELEASE.md)