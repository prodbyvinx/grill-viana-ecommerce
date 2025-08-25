import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Tenta carregar categories.json (se existir). Se não existir, segue em frente.
let categories: any[] = [];
try {
  categories = require("./categories.json");
} catch { /* ok */ }

// Carrega produtos (pode ser products.json no formato novo OU seu seed antigo com "image")
const products: any[] = require("./products.json"); // ajuste o nome se for diferente

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// Extrai um array [{url, position}] tanto do formato novo quanto do antigo
function imagesFromSeed(p: any): { url: string; position: number }[] {
  if (p?.images?.create?.length) return p.images.create;
  if (Array.isArray(p?.images))  return p.images.map((url: string, i: number) => ({ url, position: i }));
  if (p?.image)                  return [{ url: p.image, position: 0 }];
  return [];
}

async function main() {
  // 1) Categorias (se arquivo existir)
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: { name: c.name, slug: c.slug },
    });
  }

  // 2) Produtos (+ imagens garantidas)
  for (const p of products) {
    const slug = p.slug ?? slugify(p.name);
    const priceCents = p.priceCents ?? Math.round(Number(p.price ?? 0) * 100);
    const imagesCreate = imagesFromSeed(p);

    await prisma.product.upsert({
      where: { slug },
      update: {
        name: p.name,
        description: p.description ?? "",
        material: p.material ?? null,
        priceCents,
        sku: p.sku ?? null,
        isActive: true,
        // conecta categoria por id/slug se vier
        ...(p.category ? { category: p.category } :
          p.categorySlug ? { category: { connect: { slug: p.categorySlug } } } : {}),
        // 🔥 chave do problema: recria as imagens no UPDATE
        ...(imagesCreate.length ? {
          images: {
            deleteMany: {},             // limpa as antigas (se houver)
            create: imagesCreate,       // recria a(s) nova(s)
          },
        } : {}),
      },
      create: {
        name: p.name,
        slug,
        description: p.description ?? "",
        material: p.material ?? null,
        priceCents,
        sku: p.sku ?? null,
        isActive: true,
        ...(p.category ? { category: p.category } :
          p.categorySlug ? { category: { connect: { slug: p.categorySlug } } } : {}),
        ...(imagesCreate.length ? { images: { create: imagesCreate } } : {}),
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