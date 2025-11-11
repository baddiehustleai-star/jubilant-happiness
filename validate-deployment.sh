#!/bin/bash

# Validation script for deployment files
# This tests that all deployment scripts are properly configured

echo "🔍 Validating Photo2Profit Deployment Configuration"
echo "===================================================="
echo ""

ERRORS=0

# Check if all required files exist
echo "1️⃣  Checking required files..."
REQUIRED_FILES=(
    "FINAL_DEPLOY.md"
    "QUICK_DEPLOY.md"
    "DEPLOYMENT_SUMMARY.md"
    "api/final-deploy.sh"
    "api/deploy.sh"
    "test-seo-refresh.sh"
    "setup-cloud-run-env.sh"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file exists"
    else
        echo "   ❌ $file missing"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""

# Check if scripts are executable
echo "2️⃣  Checking script permissions..."
EXECUTABLE_FILES=(
    "api/final-deploy.sh"
    "api/deploy.sh"
    "test-seo-refresh.sh"
    "setup-cloud-run-env.sh"
)

for script in "${EXECUTABLE_FILES[@]}"; do
    if [ -x "$script" ]; then
        echo "   ✅ $script is executable"
    else
        echo "   ❌ $script is not executable"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""

# Validate bash script syntax
echo "3️⃣  Validating bash script syntax..."
for script in "${EXECUTABLE_FILES[@]}"; do
    if bash -n "$script" 2>/dev/null; then
        echo "   ✅ $script syntax valid"
    else
        echo "   ❌ $script has syntax errors"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""

# Check for correct region in scripts
echo "4️⃣  Checking region configuration..."
REGION_SCRIPTS=(
    "api/final-deploy.sh"
    "api/deploy.sh"
    "test-seo-refresh.sh"
)

for script in "${REGION_SCRIPTS[@]}"; do
    if grep -q "us-west2" "$script"; then
        echo "   ✅ $script uses us-west2 region"
    else
        echo "   ⚠️  $script might not use us-west2 region"
    fi
done

echo ""

# Check documentation references
echo "5️⃣  Checking documentation cross-references..."
if grep -q "QUICK_DEPLOY.md" README.md; then
    echo "   ✅ README.md references QUICK_DEPLOY.md"
else
    echo "   ❌ README.md missing QUICK_DEPLOY.md reference"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "FINAL_DEPLOY.md" README.md; then
    echo "   ✅ README.md references FINAL_DEPLOY.md"
else
    echo "   ❌ README.md missing FINAL_DEPLOY.md reference"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check for required environment variables in documentation
echo "6️⃣  Checking environment variable documentation..."
REQUIRED_ENV_VARS=(
    "JWT_SECRET"
    "SHARED_WEBHOOK_SECRET"
    "SMTP_USER"
    "SMTP_PASS"
    "NOTIFY_EMAIL"
)

for var in "${REQUIRED_ENV_VARS[@]}"; do
    if grep -q "$var" FINAL_DEPLOY.md; then
        echo "   ✅ FINAL_DEPLOY.md documents $var"
    else
        echo "   ❌ FINAL_DEPLOY.md missing $var"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""

# Summary
echo "=============================================="
if [ $ERRORS -eq 0 ]; then
    echo "✅ All validation checks passed!"
    echo ""
    echo "🚀 Ready to deploy!"
    echo ""
    echo "Next steps:"
    echo "  1. cd api && ./final-deploy.sh"
    echo "  2. ./test-seo-refresh.sh"
    echo "  3. git tag -a v1.0.1 -m 'Production deployment'"
    exit 0
else
    echo "❌ Found $ERRORS error(s)"
    echo ""
    echo "Please fix the errors above before deploying."
    exit 1
fi
