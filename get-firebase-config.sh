#!/bin/bash

echo "🔥 Photo2Profit Firebase Configuration Helper"
echo "============================================="
echo ""
echo "📍 Your Firebase Project: 758851214311"
echo "🌐 Console URL: https://console.firebase.google.com/project/758851214311/settings/general"
echo ""

echo "🔧 Getting Firebase configuration..."

# Check if Firebase CLI is installed
if command -v firebase &> /dev/null; then
    echo "✅ Firebase CLI found"
    
    # Login check
    if firebase projects:list &> /dev/null; then
        echo "✅ Already logged in to Firebase"
        
        # Get project info
        echo ""
        echo "📋 Project Information:"
        firebase use 758851214311
        firebase apps:list --project=758851214311
        
        echo ""
        echo "🔑 To get your web app config:"
        echo "firebase apps:sdkconfig web --project=758851214311"
        
    else
        echo "⚠️  Need to login to Firebase"
        echo "Run: firebase login"
    fi
    
else
    echo "⚠️  Firebase CLI not installed"
    echo ""
    echo "🚀 Quick Install:"
    echo "npm install -g firebase-tools"
    echo "firebase login"
    echo "firebase use 758851214311"
    echo ""
fi

echo ""
echo "📝 Manual Method:"
echo "1. Visit: https://console.firebase.google.com/project/758851214311/settings/general"
echo "2. Scroll to 'Your apps' section"
echo "3. Click on your web app (🌐 icon)"
echo "4. Copy the config object"
echo ""
echo "🔧 Update these values in your .env file:"
echo "VITE_FIREBASE_API_KEY=AIzaSy..."
echo "VITE_FIREBASE_APP_ID=1:758851214311:web:..."
echo ""
echo "💎 Then restart your dev server: npm run dev"