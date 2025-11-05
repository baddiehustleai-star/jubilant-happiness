#!/bin/bash

# 🔥 Firebase Services Setup Script
# Run this after getting your Firebase credentials

echo "🔥 Firebase Services Setup for Photo2Profit"
echo "Project: photo2profit-758851214311"
echo ""
echo "📋 Complete these steps in Firebase Console:"
echo ""

echo "1️⃣  AUTHENTICATION"
echo "   → Go to: Authentication > Sign-in method"
echo "   → Enable: Email/Password"
echo "   → Enable: Google (recommended)"
echo "   → Add authorized domains: localhost, your-domain.com"
echo ""

echo "2️⃣  FIRESTORE DATABASE"
echo "   → Go to: Firestore Database"
echo "   → Click: Create database"
echo "   → Mode: Start in test mode (for now)"
echo "   → Location: us-central1 (recommended)"
echo ""

echo "3️⃣  STORAGE"
echo "   → Go to: Storage"
echo "   → Click: Get started"
echo "   → Mode: Start in test mode (for now)"
echo "   → Location: us-central1 (same as Firestore)"
echo ""

echo "4️⃣  SECURITY RULES (Important for production!)"
echo "   → Update Firestore rules (see firestore.rules)"
echo "   → Update Storage rules (see storage.rules)"
echo ""

echo "✅ After completing these steps:"
echo "   1. Update your .env file with real credentials"
echo "   2. Restart your dev server: npm run dev"
echo "   3. Test signup/login at: http://localhost:5173/login"
echo ""

echo "🆘 Need help? Check: FIREBASE_SETUP.md"