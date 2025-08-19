import { prisma } from "@/lib/prisma";

export type PromoItem = {
  id: number;
  name: string;
  priceCents: number;
  image?: string;
};

// 4 itens aleatórios ativos
export async function getRandomActiveProducts(limit = 4): Promise<PromoItem[]> {
  // PostgreSQL: ORDER BY random()
  const idsRows = await prisma.$queryRaw<Array<{ id: number }>>`
    SELECT id
    FROM "Product"
    WHERE "isActive" = true
    ORDER BY random()
    LIMIT ${limit};
  `;
  const ids = idsRows.map(r => r.id);
  if (ids.length === 0) return [];

  // Busca dados e 1ª imagem (por position)
  const rows = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      name: true,
      slug: true,
      priceCents: true,
      images: {
        select: { url: true, position: true },
        orderBy: { position: "asc" },
        take: 1,
      },
    },
  });

  // Preserva a ordem aleatória obtida no SELECT
  const byId = new Map(rows.map(r => [r.id, r]));
  return ids
    .map(id => byId.get(id)!)
    .filter(Boolean)
    .map(p => ({
      id: p.id,
      name: p.name,
      slugOrId: p.slug ?? String(p.id),
      priceCents: p.priceCents,
      firstImageUrl: p.images?.[0]?.url,
    }));
}