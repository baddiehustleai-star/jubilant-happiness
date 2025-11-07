#!/bin/bash

echo "🔍 Photo2Profit Pre-Deployment Checklist"
echo "========================================"

# Check if all required files exist
echo ""
echo "📁 Checking file structure..."

files=(
    "api/server.js"
    "api/package.json" 
    "api/Dockerfile"
    "api/deploy.sh"
    "vercel.json"
    "dist/manifest.webmanifest"
    "dist/pwa-192x192.png"
    "dist/pwa-512x512.png"
    "src/firebase.js"
    ".env"
)

all_good=true

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
        all_good=false
    fi
done

echo ""
echo "🔧 Checking dependencies..."

# Check if critical dependencies are installed
if npm list react &>/dev/null; then
    echo "✅ React installed"
else
    echo "❌ React not found"
    all_good=false
fi

if npm list firebase &>/dev/null; then
    echo "✅ Firebase installed"
else
    echo "❌ Firebase not found"
    all_good=false
fi

if npm list vite-plugin-pwa &>/dev/null; then
    echo "✅ PWA plugin installed"
else
    echo "❌ PWA plugin not found"
    all_good=false
fi

echo ""
echo "🏗️ Checking build..."

if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Build files exist"
else
    echo "❌ Build files missing - run 'npm run build'"
    all_good=false
fi

echo ""
echo "🔑 Checking environment variables..."

if [ -f ".env" ]; then
    if grep -q "VITE_FIREBASE_PROJECT_ID" .env; then
        echo "✅ Firebase config present"
    else
        echo "⚠️ Firebase config incomplete in .env"
    fi
else
    echo "❌ .env file missing"
    all_good=false
fi

echo ""
echo "========================================"

if [ "$all_good" = true ]; then
    echo "🎉 ALL CHECKS PASSED!"
    echo ""
    echo "🚀 Ready to deploy:"
    echo "1. cd api && ./deploy.sh"
    echo "2. vercel --prod"
    echo "3. Test PWA on mobile"
else
    echo "⚠️ SOME ISSUES FOUND"
    echo "Please fix the missing items above before deploying."
fi

echo ""
echo "📚 Full deployment guide: PRODUCTION_DEPLOYMENT.md"