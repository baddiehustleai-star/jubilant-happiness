import { describe, it, expect } from 'vitest';

describe('Analytics', () => {
  it('should calculate total revenue correctly', () => {
    const payments = [
      { amount: 1000, email: 'user1@test.com' },
      { amount: 2000, email: 'user2@test.com' },
      { amount: 1500, email: 'user1@test.com' },
    ];
    
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    expect(totalRevenue).toBe(4500);
  });

  it('should count unique paying users correctly', () => {
    const payments = [
      { amount: 1000, email: 'user1@test.com' },
      { amount: 2000, email: 'user2@test.com' },
      { amount: 1500, email: 'user1@test.com' },
    ];
    
    const payingUsers = new Set(payments.map(p => p.email)).size;
    expect(payingUsers).toBe(2);
  });

  it('should count total transactions correctly', () => {
    const payments = [
      { amount: 1000, email: 'user1@test.com' },
      { amount: 2000, email: 'user2@test.com' },
      { amount: 1500, email: 'user1@test.com' },
    ];
    
    expect(payments.length).toBe(3);
  });

  it('should format revenue as dollars correctly', () => {
    const totalRevenue = 4500; // in cents
    const formattedRevenue = (totalRevenue / 100).toFixed(2);
    expect(formattedRevenue).toBe('45.00');
  });
});
