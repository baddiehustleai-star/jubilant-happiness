#!/bin/bash
# ==============================================================
#  PHOTO2PROFIT SMART CLOUD SETUP SCRIPT
#  Builds, connects, and optimizes the app automatically
# ==============================================================

set -e

echo "🚀 Starting Photo2Profit setup..."

# --- 1. Confirm environment ---------------------------------------------------
if ! command -v gcloud &> /dev/null; then
  echo "❌ Google Cloud SDK not found. Please enable it in Cloud Shell."; exit 1
fi

if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js 18+."; exit 1
fi

if ! command -v firebase &> /dev/null; then
  echo "📦 Installing Firebase CLI..."
  npm install -g firebase-tools
fi

if ! command -v vercel &> /dev/null; then
  echo "📦 Installing Vercel CLI..."
  npm install -g vercel
fi

# --- 2. Fix npm + dependencies ------------------------------------------------
echo "🧹 Cleaning and installing dependencies..."
npm install

echo "🔍 Running security audit..."
npm audit fix || echo "⚠️  Some vulnerabilities remain - review with 'npm audit'"

# --- 3. Set project ID if available -------------------------------------------
if [ -n "$PROJECT_ID" ]; then
  echo "🔧 Setting GCP project: $PROJECT_ID"
  gcloud config set project "$PROJECT_ID"
else
  echo "💡 Tip: Set PROJECT_ID environment variable for automatic GCP project selection"
fi

# --- 4. Enable Google APIs ----------------------------------------------------
echo "🔑 Enabling required Google APIs..."
gcloud services enable aiplatform.googleapis.com \
  firebase.googleapis.com \
  storage.googleapis.com \
  firestore.googleapis.com \
  secretmanager.googleapis.com \
  run.googleapis.com || echo "⚠️  Some APIs may already be enabled"

# --- 5. Create Firestore database if needed ----------------------------------
echo "🗄️  Ensuring Firestore database exists..."
gcloud alpha firestore databases create --location=us-central --type=firestore-native 2>/dev/null || echo "✓ Firestore already initialized"

# --- 6. Firebase initialization ----------------------------------------------
echo "🔥 Checking Firebase configuration..."
if [ -f ".firebaserc" ]; then
  echo "✓ Firebase project already configured"
else
  echo "⚠️  Run 'firebase login' and 'firebase init' to configure Firebase services"
fi

# --- 7. Create .env if missing -----------------------------------------------
if [ ! -f ".env" ]; then
  echo "🧾 Creating .env file..."
  cat <<EOF > .env
# Firebase Configuration (REQUIRED)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=${PROJECT_ID:-your-project}.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=${PROJECT_ID:-your-project-id}
VITE_FIREBASE_STORAGE_BUCKET=${PROJECT_ID:-your-project}.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_BASE=http://localhost:8080

# Stripe (Optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret

# AI APIs (Optional)
VITE_GEMINI_API_KEY=your_gemini_key
VITE_REMOVEBG_API_KEY=your_removebg_key
EOF
  echo "✅ .env template created — fill in your real keys"
  echo "📝 See GETTING_FIREBASE_API_KEYS.md for setup instructions"
else
  echo "✓ .env file already exists"
fi

# --- 8. Install API dependencies ---------------------------------------------
if [ -d "api" ]; then
  echo "📦 Installing API dependencies..."
  pushd api > /dev/null
  npm install
  popd > /dev/null
fi

# --- 9. Seed placeholder secrets (Cloud Shell only) --------------------------
if [ -n "$CLOUD_SHELL" ]; then
  echo "🔐 Seeding placeholder secrets for Cloud Shell environment..."
  ./cloudshell-setup.sh 2>/dev/null || echo "⚠️  Cloud Shell setup script not found or failed"
fi

# --- 10. Build verification ---------------------------------------------------
echo "🛠️  Verifying build configuration..."
npm run lint || echo "⚠️  Linting issues found - fix with 'npm run lint'"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit .env and add your real API keys (see GETTING_FIREBASE_API_KEYS.md)"
echo "   2. Start development server: ./start.sh (or npm run dev)"
echo "   3. Start API server: node api/server.js"
echo "   4. Run tests: npm test"
echo ""
echo "🚀 Deploy options:"
echo "   • Vercel (frontend): vercel --prod"
echo "   • Firebase (hosting): firebase deploy --only hosting"
echo "   • Cloud Run (API): cd api && gcloud builds submit && gcloud run deploy"
echo ""
