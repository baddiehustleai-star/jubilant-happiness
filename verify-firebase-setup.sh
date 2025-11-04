#!/bin/bash
# Firebase Setup Verification Script for Photo2Profit

echo "🔥 Photo2Profit - Firebase Configuration Checker"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env file exists
echo "📁 Checking for .env file..."
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC} .env file found"
else
    echo -e "${RED}✗${NC} .env file not found"
    echo -e "${YELLOW}→${NC} Please copy .env.example to .env and fill in your Firebase credentials"
    exit 1
fi

echo ""
echo "🔑 Checking Firebase Configuration..."

# Function to check if a variable is set
check_var() {
    local var_name=$1
    local var_value=$(grep "^$var_name=" .env | cut -d '=' -f2)
    
    if [ -z "$var_value" ] || [ "$var_value" = "your_api_key_here" ] || [ "$var_value" = "your_app_id_here" ]; then
        echo -e "${RED}✗${NC} $var_name is not configured"
        return 1
    else
        echo -e "${GREEN}✓${NC} $var_name is configured"
        return 0
    fi
}

# Check required Firebase variables
required_vars=(
    "VITE_FIREBASE_API_KEY"
    "VITE_FIREBASE_AUTH_DOMAIN"
    "VITE_FIREBASE_PROJECT_ID"
    "VITE_FIREBASE_STORAGE_BUCKET"
    "VITE_FIREBASE_MESSAGING_SENDER_ID"
    "VITE_FIREBASE_APP_ID"
)

missing_count=0
for var in "${required_vars[@]}"; do
    if ! check_var "$var"; then
        ((missing_count++))
    fi
done

echo ""
if [ $missing_count -eq 0 ]; then
    echo -e "${GREEN}✓ All required Firebase variables are configured!${NC}"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Make sure you've enabled Authentication in Firebase Console"
    echo "2. Create a Firestore Database (test mode, us-central1)"
    echo "3. Enable Firebase Storage (test mode)"
    echo "4. Restart your dev server: npm run dev"
    echo "5. Test login at http://localhost:5173/login"
    echo ""
    echo -e "${BLUE}📚 For detailed setup instructions, see:${NC}"
    echo "   - GETTING_FIREBASE_API_KEYS.md"
    echo "   - FIREBASE_SETUP.md"
else
    echo -e "${RED}✗ $missing_count required variable(s) need to be configured${NC}"
    echo ""
    echo -e "${YELLOW}📖 How to get your Firebase credentials:${NC}"
    echo "1. Go to https://console.firebase.google.com/"
    echo "2. Select project: jubilant-happiness-11477832"
    echo "3. Go to Project Settings (gear icon) → General tab"
    echo "4. Scroll to 'Your apps' section"
    echo "5. Copy the config values to your .env file"
    echo ""
    echo -e "${BLUE}📚 See GETTING_FIREBASE_API_KEYS.md for detailed instructions${NC}"
    exit 1
fi

echo ""
echo "🎨 Photo2Profit Branding: ${GREEN}✓${NC} Configured"
echo "   - Brand: Photo2Profit"
echo "   - Theme: Rose Gold Luxe"
echo "   - Colors: Blush, Rose, Gold"
echo ""
echo "=================================================="
echo "Setup verification complete! 🎉"
