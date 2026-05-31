import 'dotenv/config'
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Optimize standard Pool connections to prevent ETIMEDOUT during heavy Next.js static generation
const pool = new Pool({ 
  connectionString,
  max: 3, // Prevent free-tier connection limits
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
