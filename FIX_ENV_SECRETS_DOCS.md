# 🔒 FixEnvSecrets.js - Automated Environment Variable Configuration

## Overview

`FixEnvSecrets.js` is an automated tool that scans your entire project and fixes undefined secret, API key, password, and webhook URL references by replacing hardcoded values with proper environment variable references.

## What It Does

The script will:
- Find any line mentioning `API_KEY`, `PASSWORD`, `SECRET`, or `WEBHOOK_URL`
- Replace hard-coded values or empty references with proper environment-safe placeholders (e.g., `process.env.API_KEY`)
- Print a summary of every file it modified so you know what was patched
- Skip files that already use `process.env` correctly
- Automatically skip `node_modules`, `.git`, and build directories

## Usage

### Quick Run

From your repository root:

```bash
npm run fix:secrets
```

Or directly:

```bash
node FixEnvSecrets.js
```

### What Gets Fixed

The script handles the following secret keys:

- `API_KEY` → `process.env.API_KEY`
- `STRIPE_SECRET_KEY` → `process.env.STRIPE_SECRET_KEY`
- `FIREBASE_API_KEY` → `process.env.FIREBASE_API_KEY`
- `RENDER_API_KEY` → `process.env.RENDER_API_KEY`
- `SLACK_WEBHOOK_URL` → `process.env.SLACK_WEBHOOK_URL`
- `JWT_SECRET` → `process.env.JWT_SECRET`
- `SHARED_WEBHOOK_SECRET` → `process.env.SHARED_WEBHOOK_SECRET`

### Supported File Types

The script processes:
- JavaScript files (`.js`, `.jsx`)
- TypeScript files (`.ts`, `.tsx`)
- JSON files (`.json`)
- YAML files (`.yml`, `.yaml`)

## After Running

1. **Review the changes**: Check what files were modified
   ```bash
   git diff
   ```

2. **Verify the code**: Run linting and tests
   ```bash
   npm run lint
   npm test
   ```

3. **Check syntax**: Verify JavaScript files are valid
   ```bash
   node --check api/server.js
   ```

## Example

**Before:**
```javascript
const config = {
  API_KEY: 'hardcoded-key-123',
  JWT_SECRET: "my-secret",
  STRIPE_SECRET_KEY: `sk_test_abc123`
};
```

**After:**
```javascript
const config = {
  API_KEY: process.env.API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
};
```

## Safety Features

- **Smart Detection**: Only replaces actual hardcoded values, not references that already use `process.env`
- **Directory Skipping**: Automatically skips `node_modules`, `.git`, `dist`, `build`, and `.next` directories
- **Non-Destructive**: Creates backups via git before running (commit your changes first!)

## Integration with CI/CD

The script is ideal for:
- Pre-deployment security checks
- Automated environment variable migration
- Cleaning up configuration files before production deployment

## Extending the Script

To add more secret types, edit `FixEnvSecrets.js` and add to the `replacements` object:

```javascript
const replacements = {
  // ... existing keys ...
  YOUR_NEW_SECRET: 'process.env.YOUR_NEW_SECRET'
};
```

## Testing

The script includes comprehensive test coverage. Run tests with:

```bash
npm test -- tests/fix-env-secrets.test.js
```

## Security Note

⚠️ **Important**: This script helps automate the process of securing your configuration, but you should still:
1. Never commit actual secret values to git
2. Use `.env` files for local development (already in `.gitignore`)
3. Set environment variables properly in your deployment platform (Cloud Run, Vercel, etc.)
4. Review all changes made by the script before committing

## Troubleshooting

### The script modified files incorrectly

If the script makes changes you don't want:
```bash
git checkout -- <filename>
```

### Some secrets weren't caught

The script uses pattern matching. If you have secrets with different naming conventions, you may need to add them to the `replacements` object in `FixEnvSecrets.js`.
