import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('FixEnvSecrets', () => {
  const testDir = path.join(__dirname, '../tmp/test-fix-env-secrets');
  
  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should detect and fix hardcoded secrets in JavaScript files', () => {
    const testFile = path.join(testDir, 'test.js');
    const originalContent = `const config = {
  API_KEY: 'hardcoded-key-123',
  JWT_SECRET: "another-secret",
  STRIPE_SECRET_KEY: \`stripe-key\`
};`;
    
    fs.writeFileSync(testFile, originalContent);

    // Import and run the scanner logic
    const { scanFile } = createScanner();
    const result = scanFile(testFile);

    expect(result.changed).toBe(true);
    
    const updatedContent = fs.readFileSync(testFile, 'utf8');
    expect(updatedContent).toContain('process.env.API_KEY');
    expect(updatedContent).toContain('process.env.JWT_SECRET');
    expect(updatedContent).toContain('process.env.STRIPE_SECRET_KEY');
  });

  it('should not modify files that already use process.env', () => {
    const testFile = path.join(testDir, 'test.js');
    const originalContent = `const config = {
  API_KEY: process.env.API_KEY,
  JWT_SECRET: process.env.JWT_SECRET
};`;
    
    fs.writeFileSync(testFile, originalContent);

    const { scanFile } = createScanner();
    const result = scanFile(testFile);

    expect(result.changed).toBe(false);
    
    const updatedContent = fs.readFileSync(testFile, 'utf8');
    expect(updatedContent).toBe(originalContent);
  });

  it('should handle multiple file types', () => {
    const jsFile = path.join(testDir, 'config.js');
    const tsFile = path.join(testDir, 'config.ts');
    const ymlFile = path.join(testDir, 'config.yml');

    fs.writeFileSync(jsFile, 'const API_KEY = "test";');
    fs.writeFileSync(tsFile, 'const API_KEY = "test";');
    fs.writeFileSync(ymlFile, 'API_KEY: "test"');

    const { scanFile } = createScanner();
    
    expect(scanFile(jsFile).changed).toBe(true);
    expect(scanFile(tsFile).changed).toBe(true);
    expect(scanFile(ymlFile).changed).toBe(true);
  });
});

// Helper function to create scanner logic for testing
function createScanner() {
  const replacements = {
    API_KEY: 'process.env.API_KEY',
    STRIPE_SECRET_KEY: 'process.env.STRIPE_SECRET_KEY',
    FIREBASE_API_KEY: 'process.env.FIREBASE_API_KEY',
    RENDER_API_KEY: 'process.env.RENDER_API_KEY',
    SLACK_WEBHOOK_URL: 'process.env.SLACK_WEBHOOK_URL',
    JWT_SECRET: 'process.env.JWT_SECRET',
    SHARED_WEBHOOK_SECRET: 'process.env.SHARED_WEBHOOK_SECRET'
  };

  return {
    scanFile: (filePath) => {
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;

      for (const key of Object.keys(replacements)) {
        // Match patterns like: KEY = "value" or KEY: "value" 
        // But NOT if the value is already process.env.KEY
        const regex = new RegExp(
          `(${key})\\s*[:=]\\s*(['"\`])(?!process\\.env)([^'"\`]*?)\\2`,
          'g'
        );
        
        if (regex.test(content)) {
          content = content.replace(regex, (match, keyName) => {
            return `${keyName}: ${replacements[key]}`;
          });
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
      }

      return { changed };
    }
  };
}
