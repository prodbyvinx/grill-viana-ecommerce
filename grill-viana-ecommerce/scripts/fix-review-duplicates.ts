import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1) Encontre duplicados (via SQL para performance)
  const dups: Array<{ userId: number; productId: number; qtd: number }> =
    await prisma.$queryRaw`
      SELECT "userId","productId", COUNT(*) AS qtd
      FROM "Review"
      GROUP BY "userId","productId"
      HAVING COUNT(*) > 1
    `;

  if (dups.length === 0) {
    console.log("Sem duplicados. Nada a fazer.");
    return;
  }

  console.log("Duplicados encontrados:", dups.length);

  for (const { userId, productId } of dups) {
    // 2) Carrega todas as reviews desse par e ordena (mais recente primeiro)
    const reviews = await prisma.review.findMany({
      where: { userId, productId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: { id: true },
    });

    const [keep, ...toDelete] = reviews;
    if (keep) {
      console.log(`Mantendo review ${keep.id} de user=${userId} product=${productId}`);
    }
    if (toDelete.length) {
      await prisma.review.deleteMany({
        where: { id: { in: toDelete.map(r => r.id) } },
      });
      console.log(`Removidas ${toDelete.length} duplicadas de user=${userId} product=${productId}`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });