#!/usr/bin/env node

/**
 * Photo2Profit Deployment Readiness Verification Script
 *
 * This script performs local checks to verify the project is ready for deployment.
 * Run this before pushing changes to ensure smooth CI/CD pipeline execution.
 *
 * Usage:
 *   node scripts/verify-deployment-ready.js
 *   npm run verify:deploy
 */

/* eslint-env node */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const symbols = {
  success: '✅',
  warning: '⚠️',
  error: '❌',
  info: 'ℹ️',
  check: '🔍',
};

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
let warnings = 0;

/**
 * Print a formatted header
 */
function printHeader(text) {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${text}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

/**
 * Print a section header
 */
function printSection(text) {
  console.log(`\n${colors.bright}${colors.blue}${text}${colors.reset}`);
  console.log(`${colors.blue}${'-'.repeat(text.length)}${colors.reset}`);
}

/**
 * Print a success message
 */
function success(message) {
  console.log(`${symbols.success} ${colors.green}${message}${colors.reset}`);
  passedChecks++;
  totalChecks++;
}

/**
 * Print an error message
 */
function error(message) {
  console.log(`${symbols.error} ${colors.red}${message}${colors.reset}`);
  failedChecks++;
  totalChecks++;
}

/**
 * Print a warning message
 */
function warning(message) {
  console.log(`${symbols.warning} ${colors.yellow}${message}${colors.reset}`);
  warnings++;
  totalChecks++;
}

/**
 * Print an info message
 */
function info(message) {
  console.log(`${symbols.info} ${colors.cyan}${message}${colors.reset}`);
}

/**
 * Execute a command and return its output
 */
function execCommand(command, options = {}) {
  try {
    const output = execSync(command, {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error, output: error.stdout || error.stderr };
  }
}

/**
 * Check if a file exists
 */
function fileExists(filePath) {
  return existsSync(resolve(projectRoot, filePath));
}

/**
 * Read and parse a JSON file
 */
function readJsonFile(filePath) {
  try {
    const content = readFileSync(resolve(projectRoot, filePath), 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Check 1: Verify npm dependencies are installed
 */
function checkDependencies() {
  printSection('📦 Checking Dependencies');

  if (fileExists('node_modules')) {
    success('node_modules directory exists');
  } else {
    error('node_modules not found - run "npm install" first');
    return false;
  }

  const packageJson = readJsonFile('package.json');
  if (packageJson) {
    success('package.json is valid');
  } else {
    error('package.json not found or invalid');
    return false;
  }

  return true;
}

/**
 * Check 2: Run linting
 */
function checkLinting() {
  printSection('🔍 Running Linter');

  const result = execCommand('npm run lint', { silent: true });
  if (result.success) {
    success('Linting passed');
    return true;
  } else {
    error('Linting failed - fix issues before deploying');
    console.log(result.output);
    return false;
  }
}

/**
 * Check 3: Run Prettier formatting check
 */
function checkFormatting() {
  printSection('💅 Checking Code Formatting');

  const result = execCommand('npm run format:check', { silent: true });
  if (result.success) {
    success('Code formatting is correct');
    return true;
  } else {
    warning('Code formatting issues found - run "npm run format" to fix');
    return true; // Non-blocking warning
  }
}

/**
 * Check 4: Run tests
 */
function checkTests() {
  printSection('🧪 Running Tests');

  const result = execCommand('npm test', { silent: true });
  if (result.success) {
    success('All tests passed');
    return true;
  } else {
    error('Tests failed - fix failing tests before deploying');
    console.log(result.output);
    return false;
  }
}

/**
 * Check 5: Build the project
 */
function checkBuild() {
  printSection('🏗️  Building Project');

  const result = execCommand('npm run build', { silent: true });
  if (result.success) {
    success('Build completed successfully');
    return true;
  } else {
    error('Build failed - fix build errors before deploying');
    console.log(result.output);
    return false;
  }
}

/**
 * Check 6: Verify environment configuration files
 */
function checkEnvironmentFiles() {
  printSection('🔐 Checking Environment Configuration');

  let allGood = true;

  if (fileExists('.env.example')) {
    success('.env.example exists');
  } else {
    warning('.env.example not found');
    allGood = false;
  }

  if (fileExists('.env')) {
    info('Local .env file exists (for development)');
  } else {
    info('No local .env file (optional for deployment)');
  }

  // Check .env.example for required variables
  if (fileExists('.env.example')) {
    const envExample = readFileSync(resolve(projectRoot, '.env.example'), 'utf8');
    const requiredVars = ['FIREBASE_API_KEY', 'FIREBASE_PROJECT_ID', 'STRIPE_SECRET_KEY'];

    let missingVars = [];
    for (const varName of requiredVars) {
      if (!envExample.includes(varName)) {
        missingVars.push(varName);
      }
    }

    if (missingVars.length === 0) {
      success('All expected variables documented in .env.example');
    } else {
      warning(`Some variables missing from .env.example: ${missingVars.join(', ')}`);
    }
  }

  return allGood;
}

/**
 * Check 7: Verify GitHub workflow files
 */
function checkWorkflows() {
  printSection('🔄 Checking GitHub Workflows');

  const requiredWorkflows = [
    { file: '.github/workflows/ci.yml', name: 'CI workflow' },
    { file: '.github/workflows/deploy.yml', name: 'Backend deployment workflow' },
    { file: '.github/workflows/frontend-deploy.yml', name: 'Frontend deployment workflow' },
    { file: '.github/workflows/deployment-status.yml', name: 'Deployment status workflow' },
  ];

  let allPresent = true;
  for (const workflow of requiredWorkflows) {
    if (fileExists(workflow.file)) {
      success(`${workflow.name} exists`);
    } else {
      error(`${workflow.name} not found at ${workflow.file}`);
      allPresent = false;
    }
  }

  return allPresent;
}

/**
 * Check 8: Verify deployment configuration files
 */
function checkDeploymentConfig() {
  printSection('🚀 Checking Deployment Configuration');

  let hasFirebase = false;
  let hasCloudRun = false;

  // Check for firebase.json
  if (fileExists('firebase.json')) {
    success('firebase.json exists');
    hasFirebase = true;
  } else {
    info('firebase.json not found (Firebase Hosting may not be configured)');
  }

  // Check for Cloud Run related files
  if (fileExists('api')) {
    success('api/ directory exists (Cloud Run backend)');
    hasCloudRun = true;

    if (fileExists('api/health.js')) {
      success('Health check endpoint exists (api/health.js)');
    } else {
      warning('Health check endpoint not found at api/health.js');
    }
  } else {
    info('api/ directory not found (Cloud Run backend may not be configured)');
  }

  return hasFirebase || hasCloudRun;
}

/**
 * Check 9: Verify required secrets documentation
 */
function checkSecretsDocumentation() {
  printSection('📋 Checking Secrets Documentation');

  const readme = fileExists('README.md')
    ? readFileSync(resolve(projectRoot, 'README.md'), 'utf8')
    : '';
  const deployDoc = fileExists('README-DEPLOY.md')
    ? readFileSync(resolve(projectRoot, 'README-DEPLOY.md'), 'utf8')
    : '';
  const statusDoc = fileExists('DEPLOYMENT-STATUS.md')
    ? readFileSync(resolve(projectRoot, 'DEPLOYMENT-STATUS.md'), 'utf8')
    : '';

  const allDocs = readme + deployDoc + statusDoc;

  const requiredSecrets = ['GOOGLE_APPLICATION_CREDENTIALS_JSON', 'FIREBASE_SERVICE_ACCOUNT'];

  let documented = true;
  for (const secret of requiredSecrets) {
    if (allDocs.includes(secret)) {
      success(`${secret} is documented`);
    } else {
      warning(`${secret} should be documented in README or deployment docs`);
      documented = false;
    }
  }

  return documented;
}

/**
 * Check 10: Verify git status is clean
 */
function checkGitStatus() {
  printSection('🌳 Checking Git Status');

  const result = execCommand('git status --porcelain', { silent: true });
  if (!result.success) {
    warning('Unable to check git status - is this a git repository?');
    return true;
  }

  if (result.output.trim() === '') {
    success('Working directory is clean');
    return true;
  } else {
    info('Uncommitted changes detected:');
    console.log(result.output);
    warning('Consider committing or stashing changes before deployment');
    return true; // Non-blocking
  }
}

/**
 * Print final summary
 */
function printSummary() {
  printSection('📊 Summary');

  console.log(`\nTotal checks: ${totalChecks}`);
  console.log(`${colors.green}Passed: ${passedChecks}${colors.reset}`);
  console.log(`${colors.yellow}Warnings: ${warnings}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedChecks}${colors.reset}\n`);

  if (failedChecks === 0) {
    console.log(
      `${symbols.success} ${colors.bright}${colors.green}All critical checks passed! Ready for deployment.${colors.reset}\n`
    );

    console.log(`${colors.cyan}Next steps:${colors.reset}`);
    console.log(`  1. Commit and push your changes`);
    console.log(`  2. Monitor GitHub Actions workflows`);
    console.log(`  3. Check deployment status with: @github-actions deployment status\n`);

    return true;
  } else {
    console.log(
      `${symbols.error} ${colors.bright}${colors.red}${failedChecks} check(s) failed. Fix issues before deploying.${colors.reset}\n`
    );

    if (warnings > 0) {
      console.log(
        `${symbols.warning} ${colors.yellow}Note: ${warnings} warning(s) detected but not blocking deployment.${colors.reset}\n`
      );
    }

    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  printHeader('🚀 Photo2Profit Deployment Readiness Check');

  console.log(`${colors.cyan}Running pre-deployment verification...${colors.reset}\n`);

  // Run all checks
  const checks = [
    checkDependencies,
    checkLinting,
    checkFormatting,
    checkTests,
    checkBuild,
    checkEnvironmentFiles,
    checkWorkflows,
    checkDeploymentConfig,
    checkSecretsDocumentation,
    checkGitStatus,
  ];

  for (const check of checks) {
    try {
      check();
    } catch (checkError) {
      error(`Check failed with error: ${checkError.message}`);
    }
  }

  // Print summary
  const allPassed = printSummary();

  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
}

// Run the script
main().catch((mainError) => {
  console.error(`${colors.red}Fatal error: ${mainError.message}${colors.reset}`);
  process.exit(1);
});
