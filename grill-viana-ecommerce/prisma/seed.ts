// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Se seu seed-data.json estiver em CommonJS, ok usar require:
type SeedProduct = {
  name: string;
  slug?: string;
  description?: string;
  material?: string;
  price?: number | string; // em reais
  stock?: number;
  categorySlug?: string;   // "inox" | "galvanizado"
  images?: string[];       // URLs opcionais
  sku?: string;
  ncm?: string;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
};
const products: SeedProduct[] = require("./seed-data.json");

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

async function main() {
  // 1) Categorias (não enviar id — autoincrementa)
  const categorias = [
    { name: "Inox", slug: "inox" },
    { name: "Galvanizado", slug: "galvanizado" },
  ];

  for (const c of categorias) {
    await prisma.category.upsert({
      where: { slug: c.slug },           // slug é UNIQUE
      update: { name: c.name },
      create: { name: c.name, slug: c.slug },
    });
  }

  // 2) Produtos
  for (const p of products) {
    const productSlug = p.slug ?? slugify(p.name);
    const priceCents = Math.round(Number(p.price ?? 0) * 100); // R$ -> centavos

    await prisma.product.upsert({
      where: { slug: productSlug }, // usa UNIQUE slug para idempotência
      update: {
        name: p.name,
        description: p.description ?? "",       // String obrigatória
        material: p.material ?? null,
        priceCents,
        stockTotal: p.stock ?? 0,                    // campo correto
        ncm: p.ncm ?? null,
        widthCm: p.widthCm ?? null,
        heightCm: p.heightCm ?? null,
        depthCm: p.depthCm ?? null,
        ...(p.categorySlug
          ? { category: { connect: { slug: p.categorySlug } } }
          : {}),
      },
      create: {
        name: p.name,
        slug: productSlug,
        description: p.description ?? "",
        material: p.material ?? null,
        priceCents,
        stockTotal: p.stock ?? 0,
        ncm: p.ncm ?? null,
        widthCm: p.widthCm ?? null,
        heightCm: p.heightCm ?? null,
        depthCm: p.depthCm ?? null,
        ...(p.categorySlug
          ? { category: { connect: { slug: p.categorySlug } } }
          : {}),
        // cria imagens se vierem no JSON
        ...(p.images?.length
          ? {
              images: {
                create: p.images.map((url, i) => ({
                  url,
                  position: i,
                })),
              },
            }
          : {}),
      },
    });
  }
}

main()
  .then(() => console.log("✅ Seed concluído"))
  .catch((e) => {
    console.error("❌ Seed falhou:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
