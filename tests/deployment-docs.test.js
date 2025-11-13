import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

describe('Deployment Status Documentation', () => {
  it('should have deployment status workflow file', () => {
    const workflowPath = resolve(process.cwd(), '.github/workflows/deployment-status.yml');
    expect(existsSync(workflowPath)).toBe(true);
  });

  it('should have deployment status guide', () => {
    const guidePath = resolve(process.cwd(), 'DEPLOYMENT-STATUS-GUIDE.md');
    expect(existsSync(guidePath)).toBe(true);
  });

  it('should have deployment status detailed docs', () => {
    const docsPath = resolve(process.cwd(), 'DEPLOYMENT-STATUS.md');
    expect(existsSync(docsPath)).toBe(true);
  });

  it('should have issue template for deployment status', () => {
    const templatePath = resolve(process.cwd(), '.github/ISSUE_TEMPLATE/deployment_status.md');
    expect(existsSync(templatePath)).toBe(true);
  });

  it('deployment status workflow should have issue_comment trigger', () => {
    const workflowPath = resolve(process.cwd(), '.github/workflows/deployment-status.yml');
    const workflowContent = readFileSync(workflowPath, 'utf-8');

    // Check for issue_comment trigger
    expect(workflowContent).toContain('issue_comment:');
    expect(workflowContent).toContain('types: [created]');

    // Check for the trigger condition
    expect(workflowContent).toContain('@github-actions');
    expect(workflowContent).toContain('deployment status');
  });

  it('README should reference deployment status system', () => {
    const readmePath = resolve(process.cwd(), 'README.md');
    const readmeContent = readFileSync(readmePath, 'utf-8');

    // Check for key sections
    expect(readmeContent).toContain('Deployment Status Check');
    expect(readmeContent).toContain('@github-actions deployment status');
    expect(readmeContent).toContain('DEPLOYMENT-STATUS-GUIDE.md');
  });

  it('deployment guide should have all required sections', () => {
    const guidePath = resolve(process.cwd(), 'DEPLOYMENT-STATUS-GUIDE.md');
    const guideContent = readFileSync(guidePath, 'utf-8');

    // Check for main sections
    expect(guideContent).toContain('Ask GitHub to Report the Status');
    expect(guideContent).toContain('Manual Workflow Trigger');
    expect(guideContent).toContain('Create a Deployment Status Issue');
    expect(guideContent).toContain('What Gets Checked');
    expect(guideContent).toContain('Use Cases');
    expect(guideContent).toContain('Troubleshooting');
  });
});
