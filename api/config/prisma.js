import { PrismaClient } from '@prisma/client';

// Ensure a single PrismaClient instance in dev hot-reload
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
