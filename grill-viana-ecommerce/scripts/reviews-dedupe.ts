// scripts/reviews-dedupe.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Quais pares têm duplicados?
  const pairs = await prisma.$queryRaw<Array<{ userId: number; productId: number }>>`
    SELECT "userId","productId"
    FROM "Review"
    GROUP BY "userId","productId"
    HAVING COUNT(*) > 1
  `;

  if (pairs.length === 0) {
    console.log("✅ Nada para deduplicar.");
    return;
  }

  for (const { userId, productId } of pairs) {
    // Carrega todas as reviews do par, mais recente primeiro
    const reviews = await prisma.review.findMany({
      where: { userId, productId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: { id: true },
    });

    const [keep, ...toDelete] = reviews;
    if (!keep || toDelete.length === 0) continue;

    await prisma.review.deleteMany({
      where: { id: { in: toDelete.map(r => r.id) } },
    });

    console.log(
      `Par (userId=${userId}, productId=${productId}): mantendo ${keep.id}, removidas ${toDelete.length}.`
    );
  }

  console.log("✅ Deduplicação concluída.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
