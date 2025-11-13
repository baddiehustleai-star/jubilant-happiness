#!/usr/bin/env node

/* eslint-env node */

/**
 * Photo2Profit Deployment Verification Script
 *
 * This script verifies that the project is ready for deployment by checking:
 * - Environment configuration
 * - Firebase and Cloud Run config
 * - Lint, tests, and build pass
 * - Dependencies are installed
 * - API health routes are live
 */

import { existsSync, readFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let hasErrors = false;
let hasWarnings = false;

/**
 * Print a section header
 */
function printHeader(text) {
  console.log(`\n${colors.bright}${colors.blue}■ ${text}${colors.reset}`);
  console.log('─'.repeat(60));
}

/**
 * Print a success message
 */
function printSuccess(text) {
  console.log(`${colors.green}✓${colors.reset} ${text}`);
}

/**
 * Print an error message
 */
function printError(text) {
  console.log(`${colors.red}✗${colors.reset} ${text}`);
  hasErrors = true;
}

/**
 * Print a warning message
 */
function printWarning(text) {
  console.log(`${colors.yellow}⚠${colors.reset} ${text}`);
  hasWarnings = true;
}

/**
 * Print an info message
 */
function printInfo(text) {
  console.log(`${colors.cyan}ℹ${colors.reset} ${text}`);
}

/**
 * Check if a file exists
 */
function checkFile(filePath, description) {
  const fullPath = join(rootDir, filePath);
  if (existsSync(fullPath)) {
    printSuccess(`${description}: ${filePath}`);
    return true;
  } else {
    printError(`${description} not found: ${filePath}`);
    return false;
  }
}

/**
 * Check environment configuration
 */
function checkEnvironment() {
  printHeader('1. Environment Configuration');

  const envExampleExists = checkFile('.env.example', '.env.example file');

  const envPath = join(rootDir, '.env');
  if (existsSync(envPath)) {
    printSuccess('.env file exists');

    // Read and check for key variables
    const envContent = readFileSync(envPath, 'utf-8');
    const requiredVars = ['FIREBASE_API_KEY', 'FIREBASE_PROJECT_ID', 'STRIPE_SECRET_KEY'];

    const optionalVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'STRIPE_PRICE_ID'];

    let allRequired = true;
    for (const varName of requiredVars) {
      const hasVar =
        envContent.includes(`${varName}=`) &&
        !envContent.match(new RegExp(`${varName}=\\s*$`, 'm'));
      if (hasVar) {
        printSuccess(`  ${varName} is configured`);
      } else {
        printWarning(`  ${varName} is not configured (required for production)`);
        allRequired = false;
      }
    }

    for (const varName of optionalVars) {
      const hasVar =
        envContent.includes(`${varName}=`) &&
        !envContent.match(new RegExp(`${varName}=\\s*$`, 'm'));
      if (hasVar) {
        printSuccess(`  ${varName} is configured`);
      } else {
        printInfo(`  ${varName} is not configured (optional)`);
      }
    }

    if (!allRequired) {
      printWarning('Some required environment variables are missing');
    }
  } else {
    printWarning('.env file does not exist (create from .env.example)');
    if (envExampleExists) {
      printInfo('Run: cp .env.example .env');
    }
  }
}

/**
 * Check Firebase and Cloud Run configuration
 */
function checkDeploymentConfig() {
  printHeader('2. Firebase & Cloud Run Configuration');

  // Check for Firebase config (optional, deployment works via GitHub Actions)
  const firebasePath = join(rootDir, 'firebase.json');
  if (existsSync(firebasePath)) {
    printSuccess('Firebase config: firebase.json');
  } else {
    printWarning('firebase.json not found (optional - deployment works via GitHub Actions)');
    printInfo('Run `firebase init` to create if needed for local deployment');
  }

  // Check for GitHub workflows
  checkFile('.github/workflows/deploy.yml', 'Cloud Run deployment workflow');
  checkFile('.github/workflows/frontend-deploy.yml', 'Frontend deployment workflow');
  checkFile('.github/workflows/ci.yml', 'CI workflow');

  // Check API directory
  if (existsSync(join(rootDir, 'api'))) {
    printSuccess('API directory exists');
  } else {
    printError('API directory not found');
  }
}

/**
 * Check dependencies
 */
async function checkDependencies() {
  printHeader('3. Dependencies');

  const packageJsonPath = join(rootDir, 'package.json');
  const nodeModulesPath = join(rootDir, 'node_modules');

  if (!existsSync(packageJsonPath)) {
    printError('package.json not found');
    return;
  }

  printSuccess('package.json exists');

  if (existsSync(nodeModulesPath)) {
    printSuccess('node_modules directory exists');

    // Check if package-lock.json is in sync
    const packageLockPath = join(rootDir, 'package-lock.json');
    if (existsSync(packageLockPath)) {
      printSuccess('package-lock.json exists');
    } else {
      printWarning('package-lock.json not found - run `npm install`');
    }
  } else {
    printError('node_modules not found - run `npm install`');
  }
}

/**
 * Run linting
 */
async function runLint() {
  printHeader('4. Linting');

  try {
    await execAsync('npm run lint', { cwd: rootDir });
    printSuccess('Linting passed');
  } catch (error) {
    printError('Linting failed');
    if (error.stdout) {
      console.log(error.stdout);
    }
    if (error.stderr) {
      console.log(error.stderr);
    }
  }
}

/**
 * Run tests
 */
async function runTests() {
  printHeader('5. Tests');

  try {
    const { stdout } = await execAsync('npm run test', { cwd: rootDir });
    printSuccess('All tests passed');
    if (stdout) {
      // Print a summary line
      const match = stdout.match(/Tests?\s+(\d+)\s+passed/i);
      if (match) {
        printInfo(`  ${match[0]}`);
      }
    }
  } catch (error) {
    printError('Tests failed');
    if (error.stdout) {
      console.log(error.stdout);
    }
    if (error.stderr) {
      console.log(error.stderr);
    }
  }
}

/**
 * Run build
 */
async function runBuild() {
  printHeader('6. Build');

  try {
    await execAsync('npm run build', { cwd: rootDir });
    printSuccess('Build successful');

    // Check if dist directory was created
    const distPath = join(rootDir, 'dist');
    if (existsSync(distPath)) {
      printSuccess('dist/ directory created');
    } else {
      printWarning('dist/ directory not found after build');
    }
  } catch (error) {
    printError('Build failed');
    if (error.stdout) {
      console.log(error.stdout);
    }
    if (error.stderr) {
      console.log(error.stderr);
    }
  }
}

/**
 * Check API health routes
 */
function checkAPIRoutes() {
  printHeader('7. API Health Routes');

  const apiHealthPath = 'api/health.js';
  if (checkFile(apiHealthPath, 'Health endpoint')) {
    // Verify it exports a handler
    try {
      const healthContent = readFileSync(join(rootDir, apiHealthPath), 'utf-8');
      if (healthContent.includes('export default')) {
        printSuccess('Health endpoint exports handler function');
      } else {
        printWarning('Health endpoint may not export handler correctly');
      }
    } catch (error) {
      printError(`Failed to read health endpoint: ${error.message}`);
    }
  }

  const seoRefreshPath = 'api/seo/refresh.js';
  if (existsSync(join(rootDir, seoRefreshPath))) {
    printSuccess(`SEO refresh endpoint exists: ${seoRefreshPath}`);
  } else {
    printInfo('SEO refresh endpoint not found (optional)');
  }
}

/**
 * Print final summary
 */
function printSummary() {
  console.log('\n' + '═'.repeat(60));

  if (hasErrors) {
    console.log(`${colors.red}${colors.bright}✗ VERIFICATION FAILED${colors.reset}`);
    console.log('Please fix the errors above before deploying.');
    process.exit(1);
  } else if (hasWarnings) {
    console.log(
      `${colors.yellow}${colors.bright}⚠ VERIFICATION PASSED WITH WARNINGS${colors.reset}`
    );
    console.log(
      'Review the warnings above. Deployment may proceed but some features may not work.'
    );
  } else {
    console.log(`${colors.green}${colors.bright}✓ VERIFICATION PASSED${colors.reset}`);
    console.log('All checks passed! Ready for deployment.');
  }

  console.log('\n' + colors.cyan + 'Next steps:' + colors.reset);
  console.log('  1. Verify domain & hosting (DNS, HTTPS)');
  console.log('  2. Check secrets & auth (OAuth, Stripe keys)');
  console.log('  3. Deploy: firebase deploy --only hosting');
  console.log('  4. Run post-deploy checks');
  console.log('  5. Monitor and announce');
  console.log('═'.repeat(60) + '\n');
}

/**
 * Main verification function
 */
async function main() {
  console.log(colors.bright + colors.cyan);
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║       Photo2Profit Deployment Verification v1.0.0         ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  try {
    checkEnvironment();
    checkDeploymentConfig();
    await checkDependencies();
    await runLint();
    await runTests();
    await runBuild();
    checkAPIRoutes();
    printSummary();
  } catch (error) {
    console.error(`\n${colors.red}Fatal error:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Run the verification
main();
