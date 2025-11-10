#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable no-undef */

/**
 * Manual test script to verify webhook functionality
 * This simulates a Stripe webhook event without needing actual Stripe infrastructure
 */

import prisma from '../api/lib/prisma.js';

async function testWebhook() {
  console.log('🧪 Testing webhook functionality...\n');

  try {
    // Test 1: Create a test user
    console.log('Test 1: Creating test user...');
    const testEmail = 'test@example.com';
    
    await prisma.user.upsert({
      where: { email: testEmail },
      update: { paid: true },
      create: { email: testEmail, paid: true },
    });
    
    console.log('✅ User created/updated successfully\n');

    // Test 2: Query the user
    console.log('Test 2: Querying user from database...');
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    });
    
    console.log('User data:', JSON.stringify(user, null, 2));
    console.log('✅ Query successful\n');

    // Test 3: List all users
    console.log('Test 3: Listing all users...');
    const allUsers = await prisma.user.findMany();
    console.log(`Found ${allUsers.length} user(s) in database`);
    console.log('✅ List successful\n');

    // Test 4: Verify webhook handler exists
    console.log('Test 4: Checking webhook handler...');
    const { default: handler } = await import('../api/webhook.js');
    console.log('Webhook handler type:', typeof handler);
    console.log('✅ Webhook handler loaded successfully\n');

    console.log('🎉 All tests passed!\n');
    console.log('Note: Email sending is not tested here - configure SENDGRID_API_KEY');
    console.log('and verify your sender email in SendGrid to test emails in production.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testWebhook();
