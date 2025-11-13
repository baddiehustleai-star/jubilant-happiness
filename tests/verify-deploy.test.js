import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('verify-deploy script', () => {
  it('script file exists and is executable', () => {
    const scriptPath = join(process.cwd(), 'scripts', 'verify-deploy.js');
    expect(existsSync(scriptPath)).toBe(true);
  });

  it('package.json has verify:deploy script', () => {
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    expect(packageJson.scripts['verify:deploy']).toBeDefined();
    expect(packageJson.scripts['verify:deploy']).toContain('scripts/verify-deploy.js');
  });

  it('required directories exist', () => {
    expect(existsSync(join(process.cwd(), 'scripts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'api'))).toBe(true);
    expect(existsSync(join(process.cwd(), '.github', 'workflows'))).toBe(true);
  });

  it('required workflow files exist', () => {
    const workflows = ['ci.yml', 'deploy.yml', 'frontend-deploy.yml'];
    workflows.forEach((workflow) => {
      const path = join(process.cwd(), '.github', 'workflows', workflow);
      expect(existsSync(path)).toBe(true);
    });
  });

  it('API health endpoint exists', () => {
    const healthPath = join(process.cwd(), 'api', 'health.js');
    expect(existsSync(healthPath)).toBe(true);
  });

  it('.env.example exists', () => {
    const envExamplePath = join(process.cwd(), '.env.example');
    expect(existsSync(envExamplePath)).toBe(true);
  });
});
