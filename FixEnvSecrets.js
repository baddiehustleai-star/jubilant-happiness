import fs from 'fs';
import path from 'path';

// Replacement map (add more if needed)
const replacements = {
  API_KEY: 'process.env.API_KEY',
  STRIPE_SECRET_KEY: 'process.env.STRIPE_SECRET_KEY',
  FIREBASE_API_KEY: 'process.env.FIREBASE_API_KEY',
  RENDER_API_KEY: 'process.env.RENDER_API_KEY',
  SLACK_WEBHOOK_URL: 'process.env.SLACK_WEBHOOK_URL',
  JWT_SECRET: 'process.env.JWT_SECRET',
  SHARED_WEBHOOK_SECRET: 'process.env.SHARED_WEBHOOK_SECRET'
};

const projectRoot = process.cwd();

function scanDir(dir) {
  // Skip node_modules and .git directories
  const skipDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'tests', 'test', '__tests__'];
  
  for (const file of fs.readdirSync(dir)) {
    if (skipDirs.includes(file)) continue;
    
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(js|jsx|ts|tsx|json|yml|yaml)$/i.test(file)) {
      // Skip test files
      if (/\.(test|spec)\.(js|jsx|ts|tsx)$/i.test(file)) continue;
      
      let content = fs.readFileSync(fullPath, 'utf8');
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
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Fixed secrets in: ${fullPath}`);
      }
    }
  }
}

console.log('🔍 Scanning project for secret misconfigurations...');
scanDir(projectRoot);
console.log('✨ Environment variable patch complete.');
