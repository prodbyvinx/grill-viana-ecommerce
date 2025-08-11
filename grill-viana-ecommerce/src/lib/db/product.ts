import { prisma } from "@/lib/prisma";

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { position: "asc" } } },
  });
}

export async function getTopProductSlugs(limit = 100) {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map((p) => ({ slug: p.slug }));
}
