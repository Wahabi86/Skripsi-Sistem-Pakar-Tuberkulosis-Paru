import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Buat koneksi pool ke PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Buat adapter Prisma menggunakan pg
const adapter = new PrismaPg(pool);

// Hindari membuat koneksi baru setiap hot-reload saat development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
