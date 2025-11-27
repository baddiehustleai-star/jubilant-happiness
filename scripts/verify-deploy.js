#!/usr/bin/env node

/**
 * 🚀 Photo2Profit Deployment Verification Script
 *
 * This script performs comprehensive pre-deployment checks to ensure
 * the application is ready for production deployment.
 *
 * Checks performed:
 * - Linting (ESLint)
 * - Code formatting (Prettier)
 * - Unit tests (Vitest)
 * - Production build
 *
 * Exit codes:
 * - 0: All checks passed
 * - 1: One or more checks failed
 */

import { spawn } from 'child_process';
import chalk from 'chalk';

// Configuration
const checks = [
  {
    name: 'Dependency Audit',
    command: 'npm',
    args: ['audit', '--audit-level=moderate'],
    description: 'Checking for security vulnerabilities in dependencies',
  },
  {
    name: 'Linting',
    command: 'npm',
    args: ['run', 'lint'],
    description: 'Running ESLint to check code quality',
  },
  {
    name: 'Code Formatting',
    command: 'npm',
    args: ['run', 'format:check'],
    description: 'Verifying code formatting with Prettier',
  },
  {
    name: 'Unit Tests',
    command: 'npm',
    args: ['run', 'test'],
    description: 'Running test suite with Vitest',
  },
  {
    name: 'Production Build',
    command: 'npm',
    args: ['run', 'build'],
    description: 'Building application for production',
  },
  {
    name: 'Bundle Analysis',
    command: 'npx',
    args: ['vite-bundle-analyzer', './dist', '--open', 'false', '--mode', 'static'],
    description: 'Analyzing bundle size and dependencies',
    optional: true,
  },
];

// Helper function to run a command
function runCommand(check) {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue(`\n▶ ${check.description}...`));

    const process = spawn(check.command, check.args, {
      stdio: 'inherit',
      shell: true,
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green(`✓ ${check.name} passed`));
        resolve({ success: true, check: check.name });
      } else {
        console.log(chalk.red(`✗ ${check.name} failed`));
        reject({ success: false, check: check.name, code });
      }
    });

    process.on('error', (err) => {
      console.log(chalk.red(`✗ ${check.name} failed with error: ${err.message}`));
      reject({ success: false, check: check.name, error: err });
    });
  });
}

// Main execution
async function main() {
  console.log(chalk.bold.cyan('\n🚀 Photo2Profit Deployment Verification\n'));
  console.log(chalk.gray('Running comprehensive pre-deployment checks...\n'));

  const results = [];
  let allPassed = true;

  for (const check of checks) {
    try {
      const result = await runCommand(check);
      results.push(result);
    } catch (error) {
      results.push(error);
      if (!check.optional) {
        allPassed = false;
      }
      // Continue running remaining checks even if one fails
    }
  }

  // Print summary
  console.log(chalk.bold.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.cyan('📋 Deployment Verification Summary'));
  console.log(chalk.bold.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  results.forEach((result) => {
    const icon = result.success ? '✓' : '✗';
    const color = result.success ? chalk.green : chalk.red;
    const status = result.success ? 'PASSED' : 'FAILED';
    const optional = checks.find((c) => c.name === result.check)?.optional ? ' (optional)' : '';
    console.log(color(`${icon} ${result.check}: ${status}${optional}`));
  });

  // Additional deployment readiness checks
  console.log(chalk.gray('\n📊 Additional Information:'));

  // Check if dist folder exists and get size
  try {
    const fs = require('fs');
    const path = require('path');

    if (fs.existsSync('./dist')) {
      console.log(chalk.cyan('📦 Build output: ./dist directory created'));

      // Get approximate bundle size
      const indexHtml = path.join('./dist', 'index.html');
      if (fs.existsSync(indexHtml)) {
        console.log(chalk.cyan('📄 Entry point: index.html generated'));
      }
    }
  } catch {
    console.log(chalk.yellow('⚠️ Could not verify build output details'));
  }

  console.log('\n');

  if (allPassed) {
    console.log(chalk.bold.green('✅ All checks passed! Ready for deployment. 🎉\n'));
    process.exit(0);
  } else {
    console.log(chalk.bold.red('❌ Some checks failed. Please fix the issues before deploying.\n'));
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error(chalk.red('\n❌ Unexpected error:'), error);
  process.exit(1);
});
