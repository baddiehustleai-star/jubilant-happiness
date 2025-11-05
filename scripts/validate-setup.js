#!/usr/bin/env node
/* eslint-env node */

/**
 * Setup Validation Script
 * Validates that all required environment variables and configurations are in place
 */

import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, colors.green);
}

function error(message) {
  log(`✗ ${message}`, colors.red);
}

function warning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function info(message) {
  log(`ℹ ${message}`, colors.blue);
}

function header(message) {
  log(`\n${colors.bright}${message}${colors.reset}`);
}

// Load environment variables
const envPath = join(projectRoot, '.env');
const envExists = existsSync(envPath);

if (envExists) {
  dotenv.config({ path: envPath });
}

let hasErrors = false;
let hasWarnings = false;

header('🔍 Validating Photo2Profit Setup');

// Check 1: .env file exists
header('\n1. Checking Environment File');
if (envExists) {
  success('.env file exists');
} else {
  error('.env file not found');
  info('  Run: cp .env.example .env');
  hasErrors = true;
}

// Check 2: Firebase Configuration
header('\n2. Checking Firebase Configuration');
const firebaseVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
];

let firebaseConfigured = true;
for (const varName of firebaseVars) {
  if (process.env[varName]) {
    success(`${varName} is set`);
  } else {
    warning(`${varName} is not set (optional for basic testing)`);
    firebaseConfigured = false;
    hasWarnings = true;
  }
}

if (firebaseConfigured) {
  success('Firebase is fully configured');
} else {
  info('  Firebase configuration is optional but recommended for production');
  info('  See SETUP_GUIDE.md for Firebase setup instructions');
}

// Check 3: Stripe Configuration
header('\n3. Checking Stripe Configuration');

// Check Stripe Secret Key
if (process.env.STRIPE_SECRET_KEY) {
  if (process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    success('STRIPE_SECRET_KEY is set and properly formatted');
  } else {
    error('STRIPE_SECRET_KEY does not start with "sk_"');
    info('  Make sure you copied the correct secret key from Stripe');
    hasErrors = true;
  }
} else {
  error('STRIPE_SECRET_KEY is not set');
  info('  This is required for payment processing');
  info('  See SETUP_GUIDE.md for Stripe setup instructions');
  hasErrors = true;
}

// Check Stripe Price ID
if (process.env.VITE_STRIPE_PRICE_ID) {
  if (process.env.VITE_STRIPE_PRICE_ID.startsWith('price_')) {
    success('VITE_STRIPE_PRICE_ID is set and properly formatted');
  } else {
    error('VITE_STRIPE_PRICE_ID does not start with "price_"');
    info('  Make sure you copied the correct price ID from Stripe');
    hasErrors = true;
  }
} else {
  error('VITE_STRIPE_PRICE_ID is not set');
  info('  This is required for the checkout process');
  info('  See SETUP_GUIDE.md for creating a Stripe Price ID');
  hasErrors = true;
}

// Check 4: Optional APIs
header('\n4. Checking Optional API Configurations');

const optionalVars = [
  { name: 'REMOVEBG_API_KEY', description: 'Remove.bg for background removal' },
  { name: 'EBAY_APP_ID', description: 'eBay API for cross-posting' },
  { name: 'SENDGRID_API_KEY', description: 'SendGrid for email notifications' },
];

for (const { name, description } of optionalVars) {
  if (process.env[name]) {
    success(`${name} is set - ${description}`);
  } else {
    info(`${name} is not set (optional) - ${description}`);
  }
}

// Check 5: Git Hooks
header('\n5. Checking Git Hooks');
const huskyDir = join(projectRoot, '.husky');
const preCommitHook = join(huskyDir, 'pre-commit');

if (existsSync(huskyDir)) {
  success('.husky directory exists');

  if (existsSync(preCommitHook)) {
    success('pre-commit hook is installed');
  } else {
    warning('pre-commit hook not found');
    info('  Run: npm run prepare');
    hasWarnings = true;
  }
} else {
  error('.husky directory not found');
  info('  Run: npm run prepare');
  hasErrors = true;
}

// Check 6: Node Modules
header('\n6. Checking Dependencies');
const nodeModules = join(projectRoot, 'node_modules');

if (existsSync(nodeModules)) {
  success('node_modules directory exists');

  // Check for critical dependencies
  const criticalDeps = ['react', 'vite', 'stripe', 'firebase', 'husky', 'lint-staged'];
  let allDepsInstalled = true;

  for (const dep of criticalDeps) {
    const depPath = join(nodeModules, dep);
    if (existsSync(depPath)) {
      success(`${dep} is installed`);
    } else {
      error(`${dep} is not installed`);
      allDepsInstalled = false;
    }
  }

  if (!allDepsInstalled) {
    info('  Run: npm install');
    hasErrors = true;
  }
} else {
  error('node_modules directory not found');
  info('  Run: npm install');
  hasErrors = true;
}

// Summary
header('\n📊 Summary');
if (!hasErrors && !hasWarnings) {
  success('All checks passed! Your setup is complete. ✨');
  log('\nYou can now run:', colors.bright);
  log('  npm run dev     - Start development server');
  log('  npm run build   - Build for production');
  log('  npm run test    - Run tests');
} else if (!hasErrors && hasWarnings) {
  warning('Setup is mostly complete with some optional items missing.');
  log('\nYou can start development, but some features may not work:');
  log('  npm run dev     - Start development server');
  info('\nCheck warnings above and see SETUP_GUIDE.md for more details.');
} else {
  error('Setup has errors that need to be fixed.');
  info('\nPlease address the errors above before starting development.');
  info('See SETUP_GUIDE.md for detailed setup instructions.');
  process.exit(1);
}

log('\n' + '='.repeat(60) + '\n');
