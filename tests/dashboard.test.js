import { describe, it, expect } from 'vitest';
import Dashboard from '../src/pages/Dashboard.jsx';

describe('Dashboard', () => {
  it('should be a function', () => {
    expect(typeof Dashboard).toBe('function');
  });

  it('should export a component', () => {
    expect(Dashboard).toBeDefined();
  });
});
