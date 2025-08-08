import { PrismaClient } from "@prisma/client";

declare global {
  // evita múltiplas instâncias no hot reload
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;