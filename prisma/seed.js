/* eslint-env node */
/* eslint-disable no-undef */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a test user with paid status
  const paidUser = await prisma.user.upsert({
    where: { email: 'paid@example.com' },
    update: {},
    create: {
      email: 'paid@example.com',
      paid: true,
    },
  });

  // Create a test user without paid status
  const freeUser = await prisma.user.upsert({
    where: { email: 'free@example.com' },
    update: {},
    create: {
      email: 'free@example.com',
      paid: false,
    },
  });

  console.log('✅ Seeded users:');
  console.log('  Paid user:', paidUser.email);
  console.log('  Free user:', freeUser.email);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
