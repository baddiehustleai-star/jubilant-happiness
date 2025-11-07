# 💎 Photo2Profit — Google Play Release Checklist

> Manifested by **Hustle & Heal™**  
> Turn your AI resale platform into a real Android app.  
> This guide walks you from build → upload → publish.

---

## 📱 1️⃣ App Identity
| Field | Example | Notes |
|--------|----------|-------|
| **App Name** | Photo2Profit | Must match display name |
| **Package ID** | com.baddiehustle.photo2profit | Created when you run `npx cap init` |
| **Category** | Business / Shopping | Choose what fits your niche |
| **Default Language** | English (US) |  |
| **Target Audience** | 13+ or 18+ | Must be accurate for Google policy |
| **App Type** | App | not Game |

---

## 🏗️ 2️⃣ Build Your Android App (.aab)

Run these in your project root:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Photo2Profit" com.baddiehustle.photo2profit
npm run build
npx cap add android
npx cap open android
```

Then in **Android Studio**:

* **Build › Build Bundle(s)/APK › Build Bundle(s)**
* The file appears here:

  ```
  android/app/build/outputs/bundle/release/app-release.aab
  ```

---

## 🧠 3️⃣ Link Firebase & Google Cloud

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your Photo2Profit project (758851214311)
3. Go to **Project Settings → Add App → Android**
4. Enter your package ID: `com.baddiehustle.photo2profit`
5. Download the `google-services.json`
6. Move it into:

   ```
   android/app/google-services.json
   ```
7. Rebuild your app to connect AI + backend.

---

## 🖼️ 4️⃣ Store Listing Assets

Upload these to **Google Play Console › Main Store Listing**

| Asset | Size (px) | Notes |
|-------|-----------|-------|
| App Icon | 512 × 512 | Transparent background preferred |
| Feature Graphic | 1024 × 500 | Banner shown in top of Play Store page |
| Phone Screenshots | 1080 × 1920 or larger | At least 2 required |
| Tablet Screenshots | 7" and/or 10" | Optional |
| Short Description | "Turn photos into profit with AI-powered resale automation." | Max 80 characters |
| Full Description | See your landing page copy. | Max 4,000 characters |
| Privacy Policy URL | Link to your policy page (Vercel or Notion) | Required |

---

## 🚀 5️⃣ Create and Upload Your Release

1. Go to [Google Play Console](https://play.google.com/console)
2. **Create App › Fill basic info**
3. **Release › Production › Create new release**
4. Upload your `.aab` file
5. Click **Next → Review → Start rollout to Production**

---

## 🧾 6️⃣ Post-Launch Checklist

* ✅ Verify app connects to Firebase (Auth + Firestore)
* ✅ Test AI photo listing & pricing features
* ✅ Confirm $1 Stripe trial works from mobile browser view
* ✅ Add PWA tags for instant web sync
* ✅ Announce your launch across social platforms

---

## 💡 7️⃣ Optional: Future Enhancements

| Feature | Tool |
|---------|------|
| iOS version | `npx cap add ios` → upload to Xcode |
| Push Notifications | Firebase Cloud Messaging |
| Offline Mode | Service Worker + Caching |
| Analytics | Google Analytics / Vercel Insights |

---

> ✨ *Luxury is efficiency. Profit is automation.*  
> — **Photo2Profit™ by Baddie Hustle & Heal**