import { PrismaClient } from '@prisma/client';

// Ensure a single PrismaClient instance across hot reloads in development
// const globalForPrisma = globalThis as unknown as {
//     prisma: PrismaClient | undefined;
// };

// export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// if (process.env.NODE_ENV !== 'production') {
//     globalForPrisma.prisma = prisma;
// }

// Ensure TypeScript recognizes our global
declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma ?? new PrismaClient();

// In development, attach to globalThis to avoid multiple instances
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}
