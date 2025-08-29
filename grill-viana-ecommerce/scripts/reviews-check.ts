// scripts/reviews-check.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Row = { userid: number; productid: number; qtd: bigint };

async function main() {
  const dups = await prisma.$queryRaw<Row[]>`
    SELECT "userId" AS userid, "productId" AS productid, COUNT(*)::bigint AS qtd
    FROM "Review"
    GROUP BY "userId","productId"
    HAVING COUNT(*) > 1
    ORDER BY COUNT(*) DESC
  `;

  if (dups.length === 0) {
    console.log("✅ Sem duplicados em Review (userId, productId).");
  } else {
    console.log("⚠️  Duplicados encontrados:");
    console.table(dups);
  }
}

main().finally(() => prisma.$disconnect());
