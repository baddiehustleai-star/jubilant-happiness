#!/bin/bash

# Firebase Project Setup Script - photo2profit-prod
# This script automates the Firebase project initialization after console setup

set -e

PROJECT_NAME="photo2profit-prod"
WEB_APP_NAME="photo2profit-web"
REGION="us-central1"

echo "🔥 Firebase Project Setup for $PROJECT_NAME"
echo "============================================"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if user is logged in
echo "📋 Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please log in to Firebase..."
    firebase login
fi

# Select the project
echo "📂 Selecting Firebase project: $PROJECT_NAME"
firebase use $PROJECT_NAME

# Initialize Firebase features
echo "🚀 Initializing Firebase features..."
firebase init --project $PROJECT_NAME

echo "✅ Firebase project initialization complete!"
echo ""
echo "📝 Next steps:"
echo "1. Configure your security rules in firestore.rules and storage.rules"
echo "2. Update firebase.json with your specific configuration"
echo "3. Deploy rules: firebase deploy --only firestore:rules,storage:rules"
echo "4. Deploy hosting: firebase deploy --only hosting"
echo ""
echo "🧪 To test locally with emulators:"
echo "firebase emulators:start"